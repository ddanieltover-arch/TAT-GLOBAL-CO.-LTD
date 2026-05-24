/**
 * Validate environment before deploy or local testing.
 * Loads `.env.local` then `.env` (does not override existing process.env).
 *
 * Usage: npm run check:env
 */
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {formatEnvReport, getEnvChecklist} from '../lib/env';

function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) {
    return;
  }

  const content = readFileSync(path, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

const items = getEnvChecklist();
const missingProduction = items.filter((i) => !i.ok && i.requirement === 'production');
const missingRecommended = items.filter((i) => !i.ok && i.requirement === 'recommended');

console.log('TAT Global — environment check\n');
console.log(formatEnvReport());
console.log('');

if (missingProduction.length > 0) {
  console.error(
    `FAIL: ${missingProduction.length} required variable(s) missing for live email.\n` +
      'Copy .env.example → .env.local and set RESEND_API_KEY + QUOTE_FROM_EMAIL.\n' +
      'See docs/ENVIRONMENT.md'
  );
  process.exit(1);
}

if (missingRecommended.length > 0) {
  console.warn(
    `WARN: ${missingRecommended.length} recommended variable(s) missing (site may still run with defaults).`
  );
}

console.log('PASS: required production variables are set.');
process.exit(0);
