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
    <div className="hidden border-b border-gold/25 bg-primary-dark text-sm text-white md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 lg:px-8">
        <span className="text-white/90">{t('email')}</span>
        <div className="flex items-center gap-8">
          <span className="text-white/80">{t('tagline')}</span>
          <Link
            href={pathname}
            locale={otherLocale}
            className="touch-target-inline rounded px-2 font-medium tracking-wide text-gold-light transition hover:text-gold"
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
