import type {AppLocale} from '@/lib/translations';

const LOCALES: AppLocale[] = ['en', 'th'];

export function parseEmailLocale(value: unknown): AppLocale {
  if (typeof value === 'string' && LOCALES.includes(value as AppLocale)) {
    return value as AppLocale;
  }
  return 'en';
}
