import type {Metadata} from 'next';
import PrivacyPageClient from './PrivacyPageClient';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/privacy', 'privacy');
}

export default function PrivacyPage() {
  return <PrivacyPageClient />;
}
