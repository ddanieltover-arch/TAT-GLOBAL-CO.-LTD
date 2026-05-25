import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import HeroSection from '@/components/home/HeroSection';
import HomeBelowFold from '@/components/home/HomeBelowFold';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  const merged = await pageMetadata(locale, '', 'home');
  const t = await getTranslations({locale, namespace: 'meta'});
  const ogDescription = t('ogDescription');
  return {
    ...merged,
    openGraph: merged.openGraph ? {...merged.openGraph, description: ogDescription} : merged.openGraph,
    twitter: merged.twitter ? {...merged.twitter, description: ogDescription} : merged.twitter,
  };
}

export default function LocaleHomePage() {
  return (
    <>
      <div className="hidden md:contents">
        <Header />
      </div>
      <div className="min-h-screen">
        <HeroSection />
        <HomeBelowFold />
      </div>
      <Footer />
    </>
  );
}
