import {getWhatsAppPhoneRaw} from '@/lib/env';

function normalizeDigits(raw: string): string {
  return raw.replace(/\D/g, '');
}

/** Digits only, including country code (no +), for wa.me links. */
export function getWhatsAppDigits(): string | null {
  const raw = getWhatsAppPhoneRaw();
  const digits = normalizeDigits(raw);
  return digits.length >= 8 ? digits : null;
}

/** Human-readable display, e.g. +66 82 960 0612 */
export function getWhatsAppDisplay(): string | null {
  const digits = getWhatsAppDigits();
  if (!digits) {
    return null;
  }

  if (digits.startsWith('66') && digits.length === 11) {
    const national = digits.slice(2);
    return `+66 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5)}`;
  }

  return `+${digits}`;
}

/** wa.me link (no pre-filled message). */
export function getWhatsAppHref(): string | null {
  const digits = getWhatsAppDigits();
  return digits ? `https://wa.me/${digits}` : null;
}
