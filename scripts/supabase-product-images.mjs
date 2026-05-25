/**
 * Shared Supabase Storage upload for product images.
 */
import {createClient} from '@supabase/supabase-js';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const productsDir = join(root, 'public', 'images', 'products');

let envLoaded = false;

export function loadEnvFiles() {
  if (envLoaded) {
    return;
  }
  for (const filename of ['.env', '.env.local']) {
    const path = join(root, filename);
    if (!existsSync(path)) {
      continue;
    }
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
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
  envLoaded = true;
}

export function isSupabaseUploadConfigured() {
  loadEnvFiles();
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

/**
 * Upload every supported product image in public/images/products/ to Supabase Storage (upsert).
 * @returns {Promise<{ok: number, total: number, skipped: boolean}>}
 */
export async function uploadProductImagesToSupabase() {
  loadEnvFiles();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || 'product-images';

  if (!url || !serviceKey) {
    console.warn(
      'Supabase upload skipped — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    );
    return {ok: 0, total: 0, skipped: true};
  }

  if (!existsSync(productsDir)) {
    throw new Error(`No product images folder: ${productsDir}`);
  }

  const files = readdirSync(productsDir).filter((name) => /\.(webp|png)$/i.test(name));
  if (files.length === 0) {
    throw new Error('No supported image files in public/images/products/');
  }

  const supabase = createClient(url, serviceKey, {
    auth: {persistSession: false, autoRefreshToken: false},
  });

  console.log(`Supabase bucket: ${bucket}`);
  console.log(`Uploading ${files.length} file(s)…`);

  let ok = 0;
  for (const name of files) {
    const body = readFileSync(join(productsDir, name));
    const contentType = name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/webp';
    const {error} = await supabase.storage.from(bucket).upload(name, body, {
      contentType,
      upsert: true,
    });

    if (error) {
      console.error(`  FAIL ${name}: ${error.message}`);
    } else {
      console.log(`  OK   ${name}`);
      ok += 1;
    }
  }

  console.log(`Supabase: ${ok}/${files.length} uploaded.`);
  return {ok, total: files.length, skipped: false};
}
