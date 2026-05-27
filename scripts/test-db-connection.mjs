/**
 * Diagnose Supabase Postgres connectivity (loads .env.local).
 * Usage: node scripts/test-db-connection.mjs
 */
import {existsSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {PrismaClient} from '@prisma/client';

function loadEnvFile(filename) {
  const path = resolve(process.cwd(), filename);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

const base = process.env.DATABASE_URL;
if (!base) {
  console.error('DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const ref = 'xxgkxjhhqlebbhchfwbp';
const passwordMatch = base.match(/:\/\/postgres:([^@]+)@/);
const password = passwordMatch?.[1];
if (!password) {
  console.error('Could not parse password from DATABASE_URL');
  process.exit(1);
}

const regions = [
  'ap-southeast-1',
  'ap-southeast-2',
  'us-east-1',
  'eu-west-1',
  'eu-central-1',
];

const candidates = [
  {label: 'current', url: base},
  {
    label: 'current+sslmode',
    url: base.includes('?') ? `${base}&sslmode=require` : `${base}?sslmode=require`,
  },
  ...regions.flatMap((region) => [
    {
      label: `pooler-${region}-6543`,
      url: `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require`,
    },
    {
      label: `pooler-${region}-5432`,
      url: `postgresql://postgres.${ref}:${password}@aws-0-${region}.pooler.supabase.com:5432/postgres?sslmode=require`,
    },
  ]),
];

for (const {label, url} of candidates) {
  const prisma = new PrismaClient({datasources: {db: {url}}});
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`OK: ${label}`);
    console.log('Use this connection string pattern in DATABASE_URL (see Supabase → Database → Connection string).');
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`FAIL: ${label} — ${msg.split('\n')[0]}`);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

console.error('\nNo working connection. In Supabase dashboard → Project Settings → Database, copy the Session pooler URI.');
process.exit(1);
