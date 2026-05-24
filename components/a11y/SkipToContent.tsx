'use client';

import {useTranslations} from 'next-intl';

export default function SkipToContent() {
  const t = useTranslations('a11y');
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-md bg-white px-4 py-3 text-sm font-semibold text-primary-dark shadow-lg ring-2 ring-gold transition focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {t('skipToContent')}
    </a>
  );
}
