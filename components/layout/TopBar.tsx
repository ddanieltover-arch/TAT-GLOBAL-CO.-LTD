'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';

type TopBarProps = {
  locale: string;
};

export default function TopBar({locale}: TopBarProps) {
  const pathname = usePathname();
  const otherLocale = locale === 'en' ? 'th' : 'en';

  const t = useTranslations('topbar');
  const tl = useTranslations('lang');

  return (
    <div className="hidden border-b border-primary-dark/15 bg-gold text-xs text-primary-dark md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1 lg:px-8">
        <span className="font-medium leading-tight">{t('email')}</span>
        <div className="flex items-center gap-6">
          <span className="leading-tight text-primary-dark/85">{t('tagline')}</span>
          <Link
            href={pathname}
            locale={otherLocale}
            className="inline-flex items-center rounded border border-primary-dark/20 bg-primary-dark/10 px-2 py-0.5 text-xs font-semibold tracking-wide text-primary-dark transition hover:border-primary-dark/35 hover:bg-primary-dark/15"
            title={locale === 'en' ? tl('switchToThai') : tl('switchToEnglish')}
          >
            <span className="sr-only">
              {locale === 'en' ? tl('switchToThai') : tl('switchToEnglish')}:{' '}
            </span>
            {tl('toggle')}
          </Link>
        </div>
      </div>
    </div>
  );
}
