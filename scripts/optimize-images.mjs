/**
 * Losslessly re-encode JPGs in public/images (max width 1920, mozjpeg).
 * Run: node scripts/optimize-images.mjs
 */
import {existsSync} from 'node:fs';
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Install sharp first: npm install sharp --save-dev');
    process.exit(1);
  }

  const dir = join(process.cwd(), 'public', 'images');
  if (!existsSync(dir)) {
    console.error('No public/images directory');
    process.exit(1);
  }

  const files = await readdir(dir, {recursive: true});
  const jpgs = files.filter((f) => /\.jpe?g$/i.test(f));

  for (const rel of jpgs) {
    const file = join(dir, rel);
    const before = await readFile(file);
    const out = await sharp(before)
      .rotate()
      .resize({width: 1920, withoutEnlargement: true})
      .jpeg({quality: 82, mozjpeg: true})
      .toBuffer();

    if (out.length < before.length) {
      await writeFile(file, out);
      console.log(
        `${rel}: ${(before.length / 1024).toFixed(0)} KB → ${(out.length / 1024).toFixed(0)} KB`
      );
    } else {
      console.log(`${rel}: skipped (already small)`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
