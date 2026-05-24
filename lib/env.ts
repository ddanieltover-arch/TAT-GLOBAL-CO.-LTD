/**
 * Server and public environment helpers.
 * See `.env.example`, `docs/ENVIRONMENT.md`, and `docs/SUPABASE-STORAGE.md`.
 */
import {isSupabaseStorageConfigured} from '@/lib/supabase-storage';

const DEFAULT_WHATSAPP_DIGITS = '66829600612';

export type EnvRequirement = 'production' | 'recommended' | 'optional';

export type EnvCheckItem = {
  key: string;
  label: string;
  requirement: EnvRequirement;
  ok: boolean;
  hint: string;
};

function isSet(name: string): boolean {
  const value = process.env[name];
  return typeof value === 'string' && value.trim().length > 0;
}

export function isResendConfigured(): boolean {
  return isSet('RESEND_API_KEY');
}

export function hasSmtpFallback(): boolean {
  return (
    isSet('SMTP_HOST') && isSet('SMTP_PORT') && isSet('SMTP_USER') && isSet('SMTP_PASS')
  );
}

/** True when quote/contact/newsletter can send real email (not console-only). */
export function isEmailDeliveryConfigured(): boolean {
  return isResendConfigured() || hasSmtpFallback();
}

export function getWhatsAppPhoneRaw(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.trim() || `+${DEFAULT_WHATSAPP_DIGITS}`;
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(getWhatsAppPhoneRaw().replace(/\D/g, '').length >= 8);
}

export function getEnvChecklist(): EnvCheckItem[] {
  const items: EnvCheckItem[] = [
    {
      key: 'RESEND_API_KEY',
      label: 'Resend API key (live quote/contact/newsletter email)',
      requirement: 'production',
      ok: isResendConfigured(),
      hint: 'Create at resend.com → API Keys. Without this, forms only log to the server console.',
    },
    {
      key: 'QUOTE_FROM_EMAIL',
      label: 'Verified sender address in Resend',
      requirement: 'production',
      ok: isSet('QUOTE_FROM_EMAIL'),
      hint: 'e.g. TAT Global <notifications@tatglcoltd.com> — domain must be verified in Resend.',
    },
    {
      key: 'QUOTE_TO_EMAIL',
      label: 'Inbox for quote & contact notifications',
      requirement: 'recommended',
      ok: isSet('QUOTE_TO_EMAIL') || isSet('CONTACT_TO_EMAIL'),
      hint: 'Defaults to sales@tatglcoltd.com in code if unset.',
    },
    {
      key: 'NEXT_PUBLIC_WHATSAPP_PHONE',
      label: 'WhatsApp number (floating button + contact page)',
      requirement: 'recommended',
      ok: isWhatsAppConfigured(),
      hint: `Set at build time. Code default: +66 82 960 0612 (${DEFAULT_WHATSAPP_DIGITS}).`,
    },
    {
      key: 'NEXT_PUBLIC_SITE_URL',
      label: 'Public site URL (canonical, sitemap, OG)',
      requirement: 'recommended',
      ok: isSet('NEXT_PUBLIC_SITE_URL'),
      hint: 'e.g. https://tatglcoltd.com — required for correct SEO on production.',
    },
    {
      key: 'CRM_WEBHOOK_URL',
      label: 'CRM webhook (optional Zapier/Make/HubSpot)',
      requirement: 'optional',
      ok: isSet('CRM_WEBHOOK_URL') || isSet('CRM_QUOTE_WEBHOOK_URL'),
      hint: 'Quote/contact POST JSON after email is sent.',
    },
    {
      key: 'NEXT_PUBLIC_SUPABASE_URL',
      label: 'Supabase Storage for product images',
      requirement: 'optional',
      ok: isSupabaseStorageConfigured(),
      hint: 'Set URL + anon key to serve product WebPs from a public bucket. See docs/SUPABASE-STORAGE.md.',
    },
  ];

  return items;
}

export function formatEnvReport(): string {
  const items = getEnvChecklist();
  const lines = items.map((item) => {
    const status = item.ok ? 'OK' : 'MISSING';
    const tag =
      item.requirement === 'production'
        ? 'required'
        : item.requirement === 'recommended'
          ? 'recommended'
          : 'optional';
    return `[${status}] ${item.key} (${tag})\n    ${item.label}\n    ${item.hint}`;
  });
  return lines.join('\n\n');
}

/** Log once when the production server starts with incomplete config. */
export function logProductionEnvWarnings(): void {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const missing = getEnvChecklist().filter(
    (item) => !item.ok && item.requirement === 'production'
  );

  if (missing.length === 0) {
    return;
  }

  console.warn(
    '[tat-global] Production environment incomplete — live email may not send:\n' +
      missing.map((m) => `  • ${m.key}: ${m.hint}`).join('\n') +
      '\n  See docs/ENVIRONMENT.md'
  );
}
