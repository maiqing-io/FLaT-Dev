import type { Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";
import { getStore } from "@netlify/blobs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "https://maiqing-io.github.io",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_EMAIL_AND_IP = 5; // same person retrying
const MAX_PER_IP = 15;          // umbrella limit across all emails from one network

// Persisted in Netlify Blobs so the count survives cold starts, unlike an
// in-memory Map, which resets every time the function's container recycles.
async function checkAndRecordRateLimit(key: string, max: number): Promise<boolean> {
  const store = getStore("apply-rate-limits");
  const now = Date.now();
  const existing = (await store.get(key, { type: "json" })) as
    | { count: number; resetAt: number }
    | null;

  if (!existing || now > existing.resetAt) {
    await store.setJSON(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (existing.count >= max) {
    return false;
  }

  await store.setJSON(key, { count: existing.count + 1, resetAt: existing.resetAt });
  return true;
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
};

// Trim and cap length only — see the note above on why this doesn't escape
// HTML. That belongs at render time, not storage time.
const cleanInput = (input: string): string => input.trim().slice(0, 2000);

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

  const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
  const email = String(body.email ?? "").trim();

  const ipOk = await checkAndRecordRateLimit(`ip:${clientIp}`, MAX_PER_IP);
  if (!ipOk) {
    return new Response(
      JSON.stringify({ error: "Too many submissions from this network. Please try again later.", retryAfter: 3600 }),
      { status: 429, headers: { ...CORS_HEADERS, "Content-Type": "application/json", "Retry-After": "3600" } }
    );
  }

  const emailIpOk = await checkAndRecordRateLimit(`email-ip:${email}:${clientIp}`, MAX_PER_EMAIL_AND_IP);
  if (!emailIpOk) {
    return new Response(
      JSON.stringify({ error: "Too many submissions. Please try again later.", retryAfter: 3600 }),
      { status: 429, headers: { ...CORS_HEADERS, "Content-Type": "application/json", "Retry-After": "3600" } }
    );
  }

  const role = cleanInput(String(body.role ?? ""));
  const name = cleanInput(String(body.name ?? ""));
  const contact = cleanInput(String(body.contact ?? ""));
  const message = cleanInput(String(body.message ?? ""));

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

  if (name.length < 2 || name.length > 100) {
    return new Response(
      JSON.stringify({ error: "Name must be between 2 and 100 characters" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
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
        signal: AbortSignal.timeout(10000),
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
