/**
 * Supabase Storage for product images (public bucket).
 * When NEXT_PUBLIC_SUPABASE_* is set, dedicated product WebPs are served from the bucket;
 * otherwise the site uses public/images/products/ locally.
 */

export const SUPABASE_PRODUCT_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || 'product-images';

function supabaseOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) {
    return null;
  }
  try {
    return new URL(raw).origin.replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(supabaseOrigin() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
}

/** Public object URL for a path inside the product-images bucket (e.g. `jasmine-rice.webp`). */
export function getSupabasePublicUrl(objectPath: string): string | null {
  const origin = supabaseOrigin();
  if (!origin) {
    return null;
  }
  const path = objectPath.replace(/^\//, '');
  return `${origin}/storage/v1/object/public/${SUPABASE_PRODUCT_BUCKET}/${path}`;
}

export function getSupabaseProductImageUrl(slug: string): string | null {
  return getSupabasePublicUrl(`${slug}.webp`);
}

export function getSupabaseHostname(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) {
    return null;
  }
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
}
