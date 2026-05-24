import {routing} from '@/i18n/routing';

export const locales = routing.locales;
export type AppLocale = (typeof locales)[number];
export const defaultLocale = routing.defaultLocale;
