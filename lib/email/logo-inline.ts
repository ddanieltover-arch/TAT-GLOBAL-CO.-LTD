import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {getEmailLogoUrl} from '@/lib/email/brand';

const CANDIDATE_FILES = ['logo-email.png', 'logo.png', 'logo-header.webp'] as const;

/** Content-ID referenced in HTML as `cid:tat-email-logo` (Resend + nodemailer). */
export const EMAIL_LOGO_CID = 'tat-email-logo';

type LoadedLogo = {
  buffer: Buffer;
  filename: string;
  mime: string;
};

let cachedLogo: LoadedLogo | null | undefined;

function mimeFor(filename: string): string {
  if (filename.endsWith('.webp')) return 'image/webp';
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/png';
}

function loadEmailLogoFile(): LoadedLogo | null {
  if (cachedLogo !== undefined) {
    return cachedLogo;
  }

  for (const file of CANDIDATE_FILES) {
    const path = join(process.cwd(), 'public', 'images', file);
    if (!existsSync(path)) {
      continue;
    }
    try {
      cachedLogo = {
        buffer: readFileSync(path),
        filename: file,
        mime: mimeFor(file),
      };
      return cachedLogo;
    } catch {
      // try next file
    }
  }

  cachedLogo = null;
  return null;
}

/**
 * Logo `src` for HTML emails. Uses CID embedding when the file is available
 * (Gmail and most clients block data: URIs).
 */
export function getEmailLogoSrc(): string {
  if (loadEmailLogoFile()) {
    return `cid:${EMAIL_LOGO_CID}`;
  }
  return getEmailLogoUrl();
}

/** Inline logo attachment for transactional email providers. */
export function getEmailLogoInlineAttachment(): {
  filename: string;
  content: Buffer;
  contentType: string;
  contentId: string;
} | null {
  const logo = loadEmailLogoFile();
  if (!logo) {
    return null;
  }

  return {
    filename: logo.filename,
    content: logo.buffer,
    contentType: logo.mime,
    contentId: EMAIL_LOGO_CID,
  };
}
