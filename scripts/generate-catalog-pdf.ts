/**
 * Generates public/catalog/TAT-Global-Catalog.pdf from lib/products.ts
 * Run: npm run generate:catalog
 */
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import {products} from '../lib/products';

const OUT_DIR = join(process.cwd(), 'public', 'catalog');
const OUT_FILE = join(OUT_DIR, 'TAT-Global-Catalog.pdf');

const primary = rgb(26 / 255, 74 / 255, 46 / 255);
const primaryDark = rgb(13 / 255, 46 / 255, 26 / 255);
const gold = rgb(201 / 255, 168 / 255, 76 / 255);
const gray = rgb(61 / 255, 58 / 255, 53 / 255);
const white = rgb(1, 1, 1);

function stripEmoji(text: string) {
  return text.replace(/[\u{1F300}-\u{1F9FF}\u2600-\u27BF]/gu, '').replace(/\s+/g, ' ').trim();
}

/** Standard PDF fonts only support WinAnsi; normalize common spec symbols. */
function toPdfText(text: string) {
  return stripEmoji(text)
    .replace(/\u2265/g, '>=')
    .replace(/\u2264/g, '<=')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u00d7/g, 'x')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '');
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars) {
      if (line) lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function main() {
  const doc = await PDFDocument.create();
  doc.setTitle('TAT Global Co., Ltd — Product Catalog');
  doc.setAuthor('TAT GLOBAL CO., LTD');
  doc.setSubject('Bulk Thai rice export catalog');

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageW = 595.28;
  const pageH = 841.89;
  const margin = 48;

  // Cover
  const cover = doc.addPage([pageW, pageH]);
  cover.drawRectangle({x: 0, y: 0, width: pageW, height: pageH, color: primaryDark});
  cover.drawRectangle({x: 0, y: pageH - 120, width: pageW, height: 120, color: primary});
  cover.drawText('TAT GLOBAL CO., LTD', {
    x: margin,
    y: pageH - 72,
    size: 22,
    font: fontBold,
    color: gold,
  });
  cover.drawText('Product Catalog', {
    x: margin,
    y: pageH - 108,
    size: 14,
    font,
    color: white,
  });
  cover.drawText('Premium Thai Rice — Bulk Export', {
    x: margin,
    y: pageH / 2 + 40,
    size: 28,
    font: fontBold,
    color: white,
  });
  cover.drawText('Manufactured and exported from Thailand', {
    x: margin,
    y: pageH / 2 + 12,
    size: 12,
    font,
    color: white,
  });
  cover.drawText('sales@tatglcoltd.com  |  tatglcoltd.com', {
    x: margin,
    y: margin + 24,
    size: 11,
    font,
    color: gold,
  });
  cover.drawText(`Generated ${new Date().toISOString().slice(0, 10)}`, {
    x: margin,
    y: margin,
    size: 9,
    font,
    color: white,
  });

  for (const product of products) {
    const page = doc.addPage([pageW, pageH]);
    let y = pageH - margin;

    page.drawRectangle({x: 0, y: pageH - 56, width: pageW, height: 56, color: primary});
    page.drawText(toPdfText(product.name), {
      x: margin,
      y: pageH - 36,
      size: 16,
      font: fontBold,
      color: white,
    });

    y = pageH - margin - 24;

    const bodyLines = wrapText(toPdfText(product.shortDescription), 88);
    for (const line of bodyLines) {
      page.drawText(line, {x: margin, y, size: 11, font, color: gray});
      y -= 14;
    }

    y -= 8;
    page.drawText('Specifications', {x: margin, y, size: 12, font: fontBold, color: primary});
    y -= 18;

    const specs = [
      product.grainSpec,
      product.moistureSpec,
      product.brokenSpec,
      `Packaging: ${product.packaging.join(', ')}`,
      `MOQ: ${product.moq}`,
    ];
    if (product.shipping) specs.push(`Shipping: ${product.shipping}`);

    for (const spec of specs) {
      for (const line of wrapText(toPdfText(spec), 90)) {
        page.drawText(line, {x: margin, y, size: 10, font, color: gray});
        y -= 13;
      }
    }

    y -= 6;
    page.drawText('Request a quote: sales@tatglcoltd.com', {
      x: margin,
      y: margin,
      size: 9,
      font,
      color: primary,
    });
  }

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, {recursive: true});
  const bytes = await doc.save();
  writeFileSync(OUT_FILE, bytes);
  console.log(`Wrote ${OUT_FILE} (${(bytes.length / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
