/**
 * Upload product WebPs from public/images/products/ to Supabase Storage.
 *
 * Prerequisites:
 *   - Bucket created (default name: product-images) with public read
 *   - .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage: npm run upload:product-images
 *
 * Note: `npm run import:product-image` uploads automatically when Supabase is configured.
 */
import {uploadProductImagesToSupabase} from './supabase-product-images.mjs';

async function main() {
  const result = await uploadProductImagesToSupabase();
  if (result.skipped) {
    process.exit(1);
  }
  if (result.ok < result.total) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
