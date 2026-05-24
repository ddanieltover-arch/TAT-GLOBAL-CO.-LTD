import type {Metadata} from 'next';
import {locales} from '@/lib/translations';
import {getSiteUrl} from '@/lib/site-url';

/**
 * Canonical + hreflang for a locale-aware path.
 * @param path `''` for home, or `/about`, `/products/jasmine-rice`, etc.
 */
export function localizedAlternates(locale: string, path: string): Metadata['alternates'] {
  const base = getSiteUrl();
  const normalized = path === '/' || path === '' ? '' : path.startsWith('/') ? path : `/${path}`;
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${base}/${loc}${normalized}`;
  }
  return {
    canonical: `${base}/${locale}${normalized}`,
    languages: {
      ...languages,
      'x-default': `${base}/en${normalized}`,
    },
  };
}
