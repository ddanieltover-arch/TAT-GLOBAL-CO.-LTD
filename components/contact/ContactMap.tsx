'use client';

import {MapPin} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {
  formatCompanyAddressMultiline,
  getGoogleMapsEmbedUrl,
  getGoogleMapsSearchUrl,
} from '@/lib/company';

export default function ContactMap() {
  const t = useTranslations('contactPage');
  const lines = formatCompanyAddressMultiline();

  return (
    <div className="mt-4 space-y-4">
      <address className="flex gap-3 not-italic text-sm leading-relaxed text-gray-700">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div>
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </div>
      </address>

      <div className="overflow-hidden rounded-lg border border-gray-100 shadow-inner">
        <iframe
          title={t('mapIframeTitle')}
          src={getGoogleMapsEmbedUrl()}
          className="h-56 w-full border-0 sm:h-64"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <p className="text-center text-sm">
        <a
          href={getGoogleMapsSearchUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:text-primary-dark"
        >
          {t('mapDirections')}
        </a>
      </p>
    </div>
  );
}
