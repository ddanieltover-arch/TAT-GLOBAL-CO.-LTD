import {hasLocale} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
import {routing} from '@/i18n/routing';

/** Aligns with next-intl v4 — resolve `[locale]` via `requestLocale`, not optional `locale`. */
export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
