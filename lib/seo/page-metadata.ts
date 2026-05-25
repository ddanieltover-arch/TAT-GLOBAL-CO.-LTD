import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {catalogKeyFromSlug} from '@/lib/product-messages';
import {products} from '@/lib/products';
import {localizedAlternates} from '@/lib/seo/hreflang';
import {SITE_NAME} from '@/lib/seo/site';
import {brandLogo} from '@/lib/site-assets';
import {getSiteUrl} from '@/lib/site-url';

export type SeoPageKey =
  | 'home'
  | 'about'
  | 'products'
  | 'quality'
  | 'qualityControl'
  | 'packaging'
  | 'markets'
  | 'orderingProcedure'
  | 'sustainability'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'privacy';

/** Path segment after locale: `''` for home, `/about`, `/products/foo`, … */
export function normalizeSeoPath(path: string): string {
  if (path === '/' || path === '') {
    return '';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

function ogTwitterBlock(
  title: string,
  description: string,
  locale: string,
  path: string
): Pick<Metadata, 'openGraph' | 'twitter'> {
  const base = getSiteUrl();
  const normalized = normalizeSeoPath(path);
  const ogLocale = locale === 'th' ? 'th_TH' : 'en_US';
  const url = `${base}/${locale}${normalized}`;
  const imageUrl = `${base}${brandLogo.png}`;

  return {
    openGraph: {
      title,
      description,
      url,
      locale: ogLocale,
      type: 'website',
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

/** Per-route metadata from `seo` entries in locale message files. */
export async function pageMetadata(
  locale: string,
  path: string,
  seoPageKey: SeoPageKey
): Promise<Metadata> {
  const ts = await getTranslations({locale, namespace: 'seo'});
  const title = ts(`${seoPageKey}.title`);
  const description = ts(`${seoPageKey}.description`);
  const normalized = normalizeSeoPath(path);

  return {
    title,
    description,
    alternates: localizedAlternates(locale, normalized),
    ...ogTwitterBlock(title, description, locale, normalized),
  };
}

/** Product detail: title/description from `products.catalog` (no Offer; B2B). */
export async function productDetailMetadata(
  locale: string,
  slug: string
): Promise<Metadata> {
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return {};
  }

  const ck = catalogKeyFromSlug(slug);
  const tp = await getTranslations({locale, namespace: 'products.catalog'});
  const title = tp(`${ck}.name`);
  const description = tp(`${ck}.shortDescription`);
  const path = `/products/${slug}`;

  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    ...ogTwitterBlock(title, description, locale, path),
  };
}
