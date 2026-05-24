import {COMPANY_ADDRESS} from '@/lib/company';
import {SITE_NAME} from '@/lib/seo/site';
import {brandLogo} from '@/lib/site-assets';
import {getSiteUrl} from '@/lib/site-url';

/** Localized Organization entity for current locale URL (single graph per page load). */
export function OrganizationJsonLd({locale}: {locale: string}) {
  const base = getSiteUrl();
  const email =
    process.env.QUOTE_TO_EMAIL?.split(',')[0]?.trim().replace(/^mailto:/i, '') ||
    'sales@tatglcoltd.com';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${base}/${locale}`,
    logo: `${base}${brandLogo.png}`,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_ADDRESS.streetAddress,
      addressLocality: COMPANY_ADDRESS.locality,
      addressRegion: COMPANY_ADDRESS.sublocality,
      postalCode: COMPANY_ADDRESS.postalCode,
      addressCountry: COMPANY_ADDRESS.countryCode,
    },
  };

  return (
    <script
      type="application/ld+json"
      // Trusted static JSON-LD — same pattern as Next.js docs for structured data.
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}
