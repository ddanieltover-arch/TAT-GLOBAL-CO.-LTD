'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';
import {brandLogo} from '@/lib/site-assets';

type LogoVariant = 'header' | 'footer' | 'full';

const logoConfig: Record<
  LogoVariant,
  {src: string; width: number; height: number; imageClass: string; panelClass?: string}
> = {
  header: {
    src: brandLogo.header,
    width: 180,
    height: 48,
    imageClass: 'h-10 w-auto sm:h-11',
    panelClass: 'rounded-md bg-white px-2 py-1 shadow-sm',
  },
  footer: {
    src: brandLogo.full,
    width: 240,
    height: 160,
    imageClass: 'h-16 w-auto sm:h-[4.5rem]',
    panelClass: 'rounded-lg bg-white px-3 py-2 inline-block',
  },
  full: {
    src: brandLogo.full,
    width: 320,
    height: 213,
    imageClass: 'h-auto w-full max-w-[280px]',
    panelClass: 'rounded-lg bg-white px-4 py-3 inline-block',
  },
};

type LogoProps = {
  variant?: LogoVariant;
  className?: string;
  priority?: boolean;
};

export default function Logo({variant = 'header', className, priority = false}: LogoProps) {
  const t = useTranslations('a11y');
  const config = logoConfig[variant];

  return (
    <Link
      href="/"
      className={cn('touch-target-inline inline-flex shrink-0 items-center', className)}
      aria-label={t('logoHome')}
    >
      <span className={config.panelClass}>
        <Image
          src={config.src}
          alt={t('logoAlt')}
          width={config.width}
          height={config.height}
          className={config.imageClass}
          priority={priority}
          sizes={variant === 'header' ? '180px' : '240px'}
        />
      </span>
    </Link>
  );
}
