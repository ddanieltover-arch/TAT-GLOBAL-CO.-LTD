import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import AnimatedCard from '@/components/ui/AnimatedCard';
import PageHero from '@/components/ui/PageHero';
import QualityTimeline from '@/components/ui/QualityTimeline';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/quality', 'quality');
}

const certKeys = [
  'certGmp',
  'certHaccp',
  'certIso',
  'certFda',
  'certHalal',
  'certPhyto',
  'certCoo',
  'certGmo',
] as const;

export default async function QualityPage() {
  const t = await getTranslations('quality');
  const tPage = await getTranslations('qualityPage');
  const tCommon = await getTranslations('common');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={tPage('pageTitle')} title={tPage('pageHeadline')} />

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <QualityTimeline />
          </div>
        </section>

        <section className="pb-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
            <AnimatedCard index={0} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{t('certHeadline')}</h2>
              <p className="mt-3 text-gray-700">{t('certBody')}</p>
              <ul className="mt-4 space-y-2 text-gray-700">
                {certKeys.map((key) => (
                  <li key={key}>{tCommon(key)}</li>
                ))}
              </ul>
            </AnimatedCard>

            <AnimatedCard index={1} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{t('thirdPartyTitle')}</h2>
              <p className="mt-3 text-gray-700">{t('thirdPartyBody')}</p>
            </AnimatedCard>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
