/**
 * Deploy brand photography from New folder / New folder (2) into public/images.
 * Run: node scripts/deploy-brand-images.mjs
 */
import {existsSync} from 'node:fs';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {products} from '../lib/products.ts';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const src2 = join(root, 'New folder (2)');
const src1 = join(root, 'New folder');
const out = join(root, 'public', 'images');
const productsDir = join(out, 'products');
const galleryDir = join(out, 'gallery');
const manifestPath = join(root, 'lib', 'product-image-manifest.ts');

/** Site-wide JPG targets (max width 1920). */
const SITE_JPG = {
  'hero.jpg': join(src2, '1 (5).png'),
  'hero-desktop.jpg': join(src2, '1 (29).png'),
  'hero-mobile.jpg': join(src2, '1 (33).png'),
  'about.jpg': join(src2, '1 (7).png'),
  'facility.jpg': join(src2, '5.png'),
  'product-default.jpg': join(src1, '1 (4).png'),
  'gallery/grains-closeup.jpg': join(src1, '1 (4).png'),
  'gallery/packaging-bags.jpg': join(src2, '1 (8).png'),
  'gallery/export-ready.jpg': join(src2, '1 (9).png'),
  'about-banner.jpg': join(src2, '4.png'),
  'quality-banner.jpg': join(src2, '1 (13).png'),
  'contact-banner.jpg': join(src2, '1 (12).png'),
  'products/jasmine-rice.jpg': join(src1, '1 (2).png'),
  'products/white-rice.jpg': join(src1, '1 (4).png'),
  'products/long-grain-rice.jpg': join(src1, '1 (3).png'),
  'products/broken-rice.jpg': join(src1, '1 (10).png'),
  'products/glutinous-rice.jpg': join(src1, '1 (9).png'),
  'products/parboiled-rice.jpg': join(src1, '1 (7).png'),
  'products/premium-export-rice.jpg': join(src1, '1 (6).png'),
};

/** Product slug → source PNG for dedicated WebP cards. */
const PRODUCT_WEBP = {
  '1121-sella-basmati-rice': join(src2, '1 (2).png'),
  'arborio-rice': join(src2, '1 (3).png'),
  'jasmine-rice-thai-hom-mali': join(src1, '1 (2).png'),
  'thai-long-grain-rice': join(src1, '1 (3).png'),
  'thai-parboiled-rice': join(src1, '1 (7).png'),
  'thai-glutinous-rice': join(src1, '1 (9).png'),
  'thai-white-rice-100-sortexed': join(src1, '1 (4).png'),
  'white-rice-5-broken': join(src1, '1 (10).png'),
  'thai-brown-jasmine-rice': join(src1, '1 (12).png'),
  'thai-jasmine-red-cargo-rice': join(src1, '1 (11).png'),
  'thai-jasmine-black-cargo-rice': join(src1, '1 (11).png'),
  'parboiled-rice-5-broken': join(src1, '1 (8).png'),
  'thai-white-rice-25-broken': join(src1, '1 (10).png'),
  'quality-brown-rice': join(src1, '1 (12).png'),
  'thai-hom-patum-rice': join(src1, '1 (2).png'),
  'thai-white-rice-10-broken': join(src1, '1 (4).png'),
  'thai-white-rice-100-broken': join(src1, '1 (10).png'),
  'thai-glutinous-rice-25-broken': join(src1, '1 (9).png'),
  'thai-riceberry-rice': join(src1, '1 (11).png'),
  'irri-6-long-grain-rice': join(src1, '1 (3).png'),
  'irri-9-long-grain-rice': join(src1, '1 (3).png'),
  'japonica-rice': join(src1, '1 (2).png'),
};

const GALLERY_EXTRA = {
  'thai-parboiled-rice-gallery.webp': join(src1, '1 (8).png'),
};

const MAX_SITE = 1920;
const MAX_PRODUCT = 1200;
const WEBP_Q = 82;

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Install sharp: npm install sharp --save-dev');
    process.exit(1);
  }

  await mkdir(galleryDir, {recursive: true});
  await mkdir(productsDir, {recursive: true});

  console.log('Site images…');
  for (const [rel, input] of Object.entries(SITE_JPG)) {
    if (!existsSync(input)) {
      console.warn(`  SKIP ${rel} — missing ${input}`);
      continue;
    }
    const dest = join(out, rel);
    await mkdir(join(dest, '..'), {recursive: true});
    const buf = await sharp(await readFile(input))
      .rotate()
      .resize({width: MAX_SITE, withoutEnlargement: true})
      .jpeg({quality: 84, mozjpeg: true})
      .toBuffer();
    await writeFile(dest, buf);
    console.log(`  OK ${rel} (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  console.log('\nProduct WebPs…');
  const slugs = new Set();
  for (const [slug, input] of Object.entries(PRODUCT_WEBP)) {
    if (!products.some((p) => p.slug === slug)) {
      console.warn(`  SKIP unknown slug ${slug}`);
      continue;
    }
    if (!existsSync(input)) {
      console.warn(`  SKIP ${slug} — missing source`);
      continue;
    }
    const dest = join(productsDir, `${slug}.webp`);
    const buf = await sharp(await readFile(input))
      .rotate()
      .resize({width: MAX_PRODUCT, height: MAX_PRODUCT, fit: 'inside', withoutEnlargement: true})
      .webp({quality: WEBP_Q, effort: 4})
      .toBuffer();
    await writeFile(dest, buf);
    slugs.add(slug);
    console.log(`  OK ${slug}.webp (${(buf.length / 1024).toFixed(0)} KB)`);
  }

  for (const [name, input] of Object.entries(GALLERY_EXTRA)) {
    if (!existsSync(input)) continue;
    const dest = join(productsDir, name);
    const buf = await sharp(await readFile(input))
      .rotate()
      .resize({width: MAX_PRODUCT, withoutEnlargement: true})
      .webp({quality: WEBP_Q, effort: 4})
      .toBuffer();
    await writeFile(dest, buf);
    console.log(`  OK ${name}`);
  }

  const manifest = `/**
 * Auto-generated by scripts/deploy-brand-images.mjs — do not edit manually.
 * Slugs listed here have a dedicated WebP at public/images/products/{slug}.webp
 */
export const productImageSlugs = new Set<string>([
${[...slugs].sort().map((s) => `  ${JSON.stringify(s)},`).join('\n')}
]);
`;
  await writeFile(manifestPath, manifest);
  console.log(`\nManifest: ${slugs.size} product image(s)`);
  console.log('Done. Run: npm run upload:product-images (if using Supabase)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
