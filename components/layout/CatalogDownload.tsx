'use client';

import {FileDown} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {buttonClassName} from '@/components/ui/Button';
import {cn} from '@/lib/cn';
import {CATALOG_PDF} from '@/lib/site-assets';

type CatalogDownloadProps = {
  className?: string;
  variant?: 'footer' | 'inline';
};

export default function CatalogDownload({className, variant = 'footer'}: CatalogDownloadProps) {
  const t = useTranslations('footer');

  const isFooter = variant === 'footer';

  return (
    <a
      href={CATALOG_PDF.path}
      download={CATALOG_PDF.filename}
      className={cn(
        buttonClassName({
          variant: 'gold',
          size: isFooter ? 'sm' : 'md',
        }),
        className
      )}
    >
      <FileDown className="h-4 w-4 shrink-0" aria-hidden />
      <span>{t('downloadCatalog')}</span>
    </a>
  );
}
