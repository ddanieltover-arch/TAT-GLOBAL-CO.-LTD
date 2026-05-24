import {getSiteUrl} from '@/lib/site-url';

export const emailBrand = {
  primary: '#1a4a2e',
  primaryDark: '#0d2e1a',
  gold: '#c9a84c',
  goldLight: '#e8c97a',
  cream: '#f9f7f2',
  white: '#ffffff',
  text: '#3d3a35',
  textMuted: '#6b6560',
  border: '#e5e0d6',
} as const;

export function getEmailSiteUrl(): string {
  return getSiteUrl();
}

/** Absolute URL fallback when inline embedding is unavailable. */
export function getEmailLogoUrl(): string {
  return `${getEmailSiteUrl()}/images/logo-email.png`;
}
