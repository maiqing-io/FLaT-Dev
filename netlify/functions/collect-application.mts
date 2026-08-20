import type { Config } from "@netlify/functions";
import { getDatabase } from "@netlify/database";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
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

  const role = String(body.role ?? "").trim();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const contact = String(body.contact ?? "").trim();
  const message = String(body.message ?? "").trim();

  const missing = ["role", "name", "email"].filter((k) => !String(body[k] ?? "").trim());
  if (missing.length) {
    return new Response(JSON.stringify({ error: "Missing fields", missing }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
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
      await db.sql`UPDATE applications SET synced_to_sheet = TRUE WHERE email = ${email} AND role = ${role} AND created_at = (SELECT MAX(created_at) FROM applications WHERE email = ${email} AND role = ${role})`;
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
