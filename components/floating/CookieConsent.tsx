'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import PrivacyConsentLabel from '@/components/legal/PrivacyConsentLabel';

const STORAGE_KEY = 'tat-cookie-consent-v1';

export default function CookieConsent() {
  const t = useTranslations('floating');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1') {
        setVisible(false);
      } else {
        setVisible(true);
      }
    } catch {
      setVisible(false);
    }
    setMounted(true);
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore quota / privacy mode
    }
    setVisible(false);
  };

  if (!mounted || !visible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label={t('cookieRegionAria')}
      className="border-t border-gray-100 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-sm text-gray-700 shadow-[0_-8px_32px_rgba(26,74,46,0.12)] backdrop-blur-sm supports-[backdrop-filter]:bg-white/90"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-8">
        <p className="leading-relaxed">
          {t('cookieText')}{' '}
          <PrivacyConsentLabel
            namespace="floating"
            messageKey="cookiePrivacy"
            linkClassName="text-primary underline decoration-primary/40 hover:text-primary-dark"
          />
        </p>
        <button
          type="button"
          onClick={accept}
          className="shrink-0 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {t('cookieAccept')}
        </button>
      </div>
    </div>
  );
}
