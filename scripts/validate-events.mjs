#!/usr/bin/env node
// Validates data/events.json at build time so a malformed file fails the
// deploy instead of shipping a blank/broken events page.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EVENTS_PATH = path.join(__dirname, '..', 'data', 'events.json');
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CURLY_QUOTE_RE = /[‘’“”]/;
const REQUIRED_FIELDS = ['id', 'title', 'date', 'description', 'status'];
const OPTIONAL_STRING_FIELDS = ['time', 'location', 'host', 'registerUrl', 'recap'];

const errors = [];

function fail(message) {
  errors.push(message);
}

const raw = readFileSync(EVENTS_PATH, 'utf8');

if (raw.charCodeAt(0) === 0xfeff) {
  fail('data/events.json starts with a BOM (byte order mark); save it as plain UTF-8 without BOM.');
}

if (CURLY_QUOTE_RE.test(raw)) {
  const index = raw.search(CURLY_QUOTE_RE);
  const line = raw.slice(0, index).split('\n').length;
  fail(`data/events.json contains a curly/smart quote on line ${line}; use a straight " or '.`);
}

let events;
try {
  events = JSON.parse(raw);
} catch (err) {
  fail(`data/events.json is not valid JSON: ${err.message}`);
  report();
}

if (!Array.isArray(events)) {
  fail('data/events.json must contain a JSON array of events.');
  report();
}

const seenIds = new Set();

events.forEach((event, index) => {
  const label = event && typeof event === 'object' && event.id ? `"${event.id}"` : `entry at index ${index}`;

  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    fail(`Event ${label} is not an object.`);
    return;
  }

  for (const field of REQUIRED_FIELDS) {
    const value = event[field];
    if (typeof value !== 'string' || value.trim() === '') {
      fail(`Event ${label} is missing required field "${field}".`);
    }
  }

  if (typeof event.id === 'string') {
    if (seenIds.has(event.id)) {
      fail(`Duplicate event id "${event.id}".`);
    }
    seenIds.add(event.id);
  }

  if (typeof event.status === 'string' && event.status !== 'upcoming' && event.status !== 'past') {
    fail(`Event ${label} has status ${JSON.stringify(event.status)}; must be exactly "upcoming" or "past".`);
  }

  // Dates that look like ISO (YYYY-MM-DD) must actually be valid calendar
  // dates. Non-ISO strings (e.g. "TBC") are allowed as human-readable
  // placeholders — the renderer falls back to showing them verbatim.
  if (typeof event.date === 'string' && ISO_DATE_RE.test(event.date)) {
    const parsed = new Date(event.date + 'T00:00:00Z');
    const [, year, month, day] = event.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const isValidCalendarDate =
      !Number.isNaN(parsed.getTime()) &&
      parsed.getUTCFullYear() === Number(year) &&
      parsed.getUTCMonth() + 1 === Number(month) &&
      parsed.getUTCDate() === Number(day);
    if (!isValidCalendarDate) {
      fail(`Event ${label} has an invalid date "${event.date}".`);
    }
  }

  for (const field of OPTIONAL_STRING_FIELDS) {
    if (field in event && event[field] !== undefined && typeof event[field] !== 'string') {
      fail(`Event ${label} has non-string "${field}" (${JSON.stringify(event[field])}).`);
    }
  }
});

report();

function report() {
  if (errors.length > 0) {
    console.error(`events.json validation failed with ${errors.length} problem(s):`);
    for (const message of errors) {
      console.error(`  - ${message}`);
    }
    process.exit(1);
  }
  console.log(`events.json validation passed (${events.length} event${events.length === 1 ? '' : 's'}).`);
}
