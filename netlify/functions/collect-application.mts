import type { Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "https://maiqing-io.github.io",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Simple in-memory rate limiter (resets per function invocation)
// For production, use Redis or a persistent store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const getRateLimit = (identifier: string, windowMs: number = 3600000): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= 5) {
    return false;
  }

  entry.count++;
  return true;
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
};

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .slice(0, 2000)
    .replace(/[<>]/g, "");
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("OK", { status: 200, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Get client IP for rate limiting
  const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  const email = String(body.email ?? "").trim();
  const rateLimitKey = `${email}:${clientIp}`;

  // Check rate limit (max 5 submissions per email+IP per hour)
  if (!getRateLimit(rateLimitKey)) {
    return new Response(
      JSON.stringify({
        error: "Too many submissions. Please try again later.",
        retryAfter: 3600,
      }),
      {
        status: 429,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
          "Retry-After": "3600",
        },
      }
    );
  }

  const role = sanitizeInput(String(body.role ?? ""));
  const name = sanitizeInput(String(body.name ?? ""));
  const contact = sanitizeInput(String(body.contact ?? ""));
  const message = sanitizeInput(String(body.message ?? ""));

  // Validate required fields
  const missing = ["role", "name", "email"].filter((k) => {
    if (k === "email") return !isValidEmail(email);
    return !String(body[k] ?? "").trim();
  });

  if (missing.length) {
    return new Response(JSON.stringify({ error: "Missing or invalid fields", missing }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Validate name length
  if (name.length < 2 || name.length > 100) {
    return new Response(
      JSON.stringify({ error: "Name must be between 2 and 100 characters" }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }

  const db = getDatabase();

  let storedInDatabase = false;
  try {
    await db.sql`
      INSERT INTO applications (role, name, email, contact, message)
      VALUES (${role}, ${name}, ${email}, ${contact}, ${message})
    `;
    storedInDatabase = true;
  } catch (err) {
    console.error("Failed to store application in Netlify Database", err);
  }

  let storedInSheet = false;
  const sheetUrl = process.env.GSHEET_WEBAPP_URL;
  const sheetSecret = process.env.GSHEET_SECRET;

  if (sheetUrl && sheetSecret) {
    try {
      const resp = await fetch(sheetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: sheetSecret,
          role,
          name,
          email,
          contact,
          message,
          submittedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      const respText = await resp.text();
      let parsed: Record<string, unknown> | null = null;
      try {
        parsed = JSON.parse(respText);
      } catch {
        parsed = null;
      }
      storedInSheet = resp.ok && (parsed === null || parsed.status !== "error");
      if (!storedInSheet) {
        console.error("Google Sheet webapp did not confirm the write", resp.status, respText.slice(0, 500));
      }
    } catch (err) {
      console.error("Failed to forward application to Google Sheet", err);
    }
  } else {
    console.warn("GSHEET_WEBAPP_URL / GSHEET_SECRET not configured; skipping sheet sync");
  }

  if (storedInDatabase && storedInSheet) {
    try {
      await db.sql`
        UPDATE applications 
        SET synced_to_sheet = TRUE 
        WHERE email = ${email} AND role = ${role} 
        AND created_at = (SELECT MAX(created_at) FROM applications WHERE email = ${email} AND role = ${role})
      `;
    } catch (err) {
      console.error("Failed to mark application as synced", err);
    }
  }

  if (!storedInDatabase && !storedInSheet) {
    return new Response(
      JSON.stringify({ error: "Could not save application to either storage backend" }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ status: "ok", storedInDatabase, storedInSheet }),
    { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
  );
};

export const config: Config = {
  path: "/api/apply",
};
