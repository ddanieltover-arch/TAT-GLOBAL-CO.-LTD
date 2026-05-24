# Supabase Storage — product images

Host dedicated product photos in a **public** Supabase bucket. Hero, about, and gallery shots stay in `public/images/`; only product WebPs use Storage when configured.

---

## 1. Create project & bucket

1. [supabase.com](https://supabase.com) → New project  
2. **Storage** → **New bucket**  
   - Name: `product-images` (or set `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`)  
   - **Public bucket**: ON (allows read via public URL)

---

## 2. Environment variables

Add to `.env.local` (and your host for production):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=product-images

# Scripts only — never expose in the browser or commit to git
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Find keys under **Project Settings → API**.

---

## 3. Import a product image

```bash
npm run import:product-image -- jasmine-rice-thai-hom-mali "./path/to/photo.png"
```

This writes `public/images/products/{slug}.webp`, updates the manifest, and **automatically uploads all product WebPs to Supabase** when your `.env.local` keys are set.

To re-upload everything without importing:

```bash
npm run upload:product-images
```

---

## 4. Run the site

```bash
npm run dev
```

When `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, product cards and detail pages load images from:

`https://YOUR_PROJECT.supabase.co/storage/v1/object/public/product-images/{slug}.webp`

If Supabase is not configured, the site keeps using local `public/images/products/` (no code change needed).

---

## Production (Vercel / etc.)

1. Add the four variables above (service role only if you run upload from CI; not required at runtime for reads).  
2. **Redeploy** after changing `NEXT_PUBLIC_*` (rebuild required for Next.js image domains).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Broken images in dev | Re-run `import:product-image` or `upload:product-images`; confirm bucket is public |
| Next.js image error | Rebuild after setting `NEXT_PUBLIC_SUPABASE_URL` |
| Upload 403 | Use **service role** key, not anon, in `SUPABASE_SERVICE_ROLE_KEY` |
| Wrong bucket | Match `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` to bucket name |
