import type {Metadata} from 'next';
import ProductsPageClient from './ProductsPageClient';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/products', 'products');
}

export default function ProductsPage() {
  return <ProductsPageClient />;
}
