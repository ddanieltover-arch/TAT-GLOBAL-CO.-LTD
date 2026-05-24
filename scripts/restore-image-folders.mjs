/**
 * Restore public/images folder structure and category placeholder JPGs.
 * Run: node scripts/restore-image-folders.mjs
 */
import {existsSync, mkdirSync} from 'node:fs';
import {copyFile, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const root = join(process.cwd(), 'public', 'images');
const productsDir = join(root, 'products');
const galleryDir = join(root, 'gallery');

const categoryProductImages = [
  'jasmine-rice.jpg',
  'white-rice.jpg',
  'long-grain-rice.jpg',
  'broken-rice.jpg',
  'glutinous-rice.jpg',
  'parboiled-rice.jpg',
  'premium-export-rice.jpg',
];

async function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, {recursive: true});
    console.log(`Created ${path}`);
  }
}

async function optimizeCopy(sharp, source, dest) {
  const before = await readFile(source);
  const out = await sharp(before)
    .rotate()
    .resize({width: 1200, withoutEnlargement: true})
    .jpeg({quality: 82, mozjpeg: true})
    .toBuffer();
  await writeFile(dest, out);
  console.log(`Restored ${dest.replace(process.cwd(), '.')} (${(out.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  await ensureDir(productsDir);
  await ensureDir(galleryDir);

  const source =
    [join(root, 'gallery', 'grains-closeup.jpg'), join(root, 'product-default.jpg')].find((p) =>
      existsSync(p),
    );

  if (!source) {
    console.error('No source image found (grains-closeup.jpg or product-default.jpg).');
    process.exit(1);
  }

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    for (const name of categoryProductImages) {
      const dest = join(productsDir, name);
      if (!existsSync(dest)) {
        await copyFile(source, dest);
        console.log(`Copied ${name}`);
      }
    }
    return;
  }

  for (const name of categoryProductImages) {
    const dest = join(productsDir, name);
    await optimizeCopy(sharp, source, dest);
  }

  console.log(`Done. Restored ${categoryProductImages.length} files in public/images/products/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
