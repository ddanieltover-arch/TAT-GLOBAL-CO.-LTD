import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ExportMarketsMapDynamic from '@/components/home/ExportMarketsMapDynamic';
import AnimatedCard from '@/components/ui/AnimatedCard';
import PageHero from '@/components/ui/PageHero';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/markets', 'markets');
}

const regionKeys = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'] as const;

export default async function MarketsPage() {
  const t = await getTranslations('markets');
  const tExtra = await getTranslations('marketsPage');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={t('label')} title={t('headline')} description={t('subheadline')} />

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <ScrollReveal direction="left">
                <ExportMarketsMapDynamic />
              </ScrollReveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {regionKeys.map((key, index) => (
                  <AnimatedCard
                    key={key}
                    index={index}
                    className="rounded-lg border border-gray-100 bg-white p-5 text-gray-700 shadow-card"
                  >
                    {t(key)}
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-3xl text-gray-900">{tExtra('docsTitle')}</h2>
                <p className="mt-3 text-gray-700">{tExtra('docsBody')}</p>
              </article>
            </ScrollReveal>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
