'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {cn} from '@/lib/cn';

type PrivacyConsentLabelProps = {
  namespace: string;
  messageKey: string;
  linkClassName?: string;
};

export default function PrivacyConsentLabel({
  namespace,
  messageKey,
  linkClassName,
}: PrivacyConsentLabelProps) {
  const t = useTranslations(namespace);

  return (
    <span className="block min-w-0 whitespace-pre-line leading-snug">
      {t.rich(messageKey, {
        privacyLink: (chunks) => (
          <Link
            href="/privacy"
            className={cn(
              'font-medium underline underline-offset-2 transition',
              linkClassName ?? 'decoration-primary/50 hover:text-primary'
            )}
          >
            {chunks}
          </Link>
        ),
      })}
    </span>
  );
}
