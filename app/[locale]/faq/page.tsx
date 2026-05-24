import type {Metadata} from 'next';
import FaqPageClient from './FaqPageClient';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/faq', 'faq');
}

export default function FaqPage() {
  return <FaqPageClient />;
}
