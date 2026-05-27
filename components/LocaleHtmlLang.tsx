'use client';

import {useLocale} from 'next-intl';
import {useEffect} from 'react';

/** Keeps document lang in sync for localized routes (root layout defaults to en). */
export default function LocaleHtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
