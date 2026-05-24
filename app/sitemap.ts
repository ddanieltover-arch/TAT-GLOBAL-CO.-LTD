import type {MetadataRoute} from 'next';
import {locales} from '@/lib/translations';
import {products} from '@/lib/products';
import {getSiteUrl} from '@/lib/site-url';

const STATIC_PATHS = [
  '',
  '/about',
  '/products',
  '/quality',
  '/packaging',
  '/markets',
  '/faq',
  '/contact',
  '/privacy',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const out: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      out.push({
        url: `${base}/${locale}${path}`,
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.8,
      });
    }

    for (const p of products) {
      out.push({
        url: `${base}/${locale}/products/${p.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return out;
}
