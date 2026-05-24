import {SITE_NAME} from '@/lib/seo/site';
import {getSiteUrl} from '@/lib/site-url';

type ProductJsonLdProps = {
  locale: string;
  slug: string;
  name: string;
  description: string;
};

/** Product rich result hints without Offer (wholesale / quote-based). */
export function ProductJsonLd({locale, slug, name, description}: ProductJsonLdProps) {
  const base = getSiteUrl();
  const url = `${base}/${locale}/products/${slug}`;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    url,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    countryOfOrigin: {
      '@type': 'Country',
      name: 'Thailand',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}
