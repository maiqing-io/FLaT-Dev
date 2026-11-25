#!/usr/bin/env node
// Guards against the failure mode that broke the events page: netlify.toml's
// Content-Security-Policy allows inline <script> blocks by exact SHA-256
// hash, so editing any inline script's text without updating that hash makes
// the browser silently block the script (logged only as a CSP console
// error, with no visible error on the page). This fails the build if any
// inline script in a shipped HTML file isn't covered by the CSP allowlist.

import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const toml = readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
const cspMatch = toml.match(/Content-Security-Policy\s*=\s*"([^"]*)"/);

if (!cspMatch) {
  console.error('Could not find a Content-Security-Policy header in netlify.toml.');
  process.exit(1);
}

const scriptSrcMatch = cspMatch[1].match(/script-src([^;]*);/);
const allowed = new Set(
  scriptSrcMatch ? [...scriptSrcMatch[1].matchAll(/'sha256-([A-Za-z0-9+/=]+)'/g)].map((m) => `sha256-${m[1]}`) : []
);

const htmlFiles = readdirSync(ROOT).filter((f) => f.endsWith('.html'));
const problems = [];

// CSP script-src only gates elements the browser would execute as script.
// A type like "application/ld+json" is inert data, never executed, so it
// isn't subject to the allowlist and must be skipped here.
const EXECUTABLE_TYPE_RE = /^\s*(text\/javascript|application\/javascript|module)?\s*$/i;

for (const file of htmlFiles) {
  const html = readFileSync(path.join(ROOT, file), 'utf8');
  const scriptRe = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  let match;
  let index = 0;
  while ((match = scriptRe.exec(html))) {
    index += 1;
    const attrs = match[1];
    if (/\bsrc=/.test(attrs)) continue;
    const typeMatch = attrs.match(/\btype=["']?([^"'\s>]*)/i);
    if (typeMatch && !EXECUTABLE_TYPE_RE.test(typeMatch[1])) continue;
    const content = match[2];
    if (!content.trim()) continue;
    const hash = `sha256-${createHash('sha256').update(content, 'utf8').digest('base64')}`;
    if (!allowed.has(hash)) {
      problems.push(
        `${file} inline script #${index} (${hash}) is not in netlify.toml's script-src allowlist. ` +
          'Add this hash to the CSP, or the browser will silently block the script.'
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`CSP validation failed with ${problems.length} problem(s):`);
  for (const problem of problems) {
    console.error(`  - ${problem}`);
  }
  process.exit(1);
}

console.log(`CSP validation passed (checked ${htmlFiles.length} HTML files).`);
