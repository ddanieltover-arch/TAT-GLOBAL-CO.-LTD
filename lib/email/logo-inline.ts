import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {getEmailLogoUrl} from '@/lib/email/brand';

const CANDIDATE_FILES = ['logo-email.png', 'logo.png', 'logo-header.webp'] as const;

let cachedDataUri: string | null = null;

function mimeFor(filename: string): string {
  if (filename.endsWith('.webp')) return 'image/webp';
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/png';
}

/**
 * Inline logo for HTML emails — avoids broken remote images when the site
 * is not deployed or email clients block external images.
 */
export function getEmailLogoSrc(): string {
  if (cachedDataUri) {
    return cachedDataUri;
  }

  for (const file of CANDIDATE_FILES) {
    const path = join(process.cwd(), 'public', 'images', file);
    if (!existsSync(path)) {
      continue;
    }
    try {
      const buffer = readFileSync(path);
      const mime = mimeFor(file);
      cachedDataUri = `data:${mime};base64,${buffer.toString('base64')}`;
      return cachedDataUri;
    } catch {
      // try next file
    }
  }

  return getEmailLogoUrl();
}
