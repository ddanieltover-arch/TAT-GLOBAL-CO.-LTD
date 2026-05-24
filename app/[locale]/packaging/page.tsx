import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
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
  return pageMetadata(locale, '/packaging', 'packaging');
}

export default async function PackagingPage() {
  const tPack = await getTranslations('packagingPage');
  const p = await getTranslations('packaging');

  const pk = ['p1', 'p2', 'p3', 'p4', 'p5'] as const;
  const ck = ['c1', 'c2', 'c3', 'c4'] as const;
  const sk = ['s1', 's2', 's3', 's4'] as const;

  const columns = [
    {title: tPack('bagTitle'), keys: pk},
    {title: tPack('containerSpecsTitle'), keys: ck},
    {title: tPack('shippingTermsTitle'), keys: sk},
  ] as const;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={tPack('pageTitle')} title={tPack('pageHeadline')} />

        <section className="py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3 lg:px-8">
            {columns.map((col, index) => (
              <AnimatedCard
                key={col.title}
                index={index}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-card"
              >
                <h2 className="font-display text-3xl text-gray-900">{col.title}</h2>
                <ul className="mt-4 space-y-2 text-gray-700">
                  {col.keys.map((key) => (
                    <li key={key}>{p(key)}</li>
                  ))}
                </ul>
              </AnimatedCard>
            ))}
          </div>
        </section>

        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-3xl text-gray-900">{tPack('privateProgramTitle')}</h2>
                <p className="mt-3 text-gray-700">{tPack('privateProgramBody')}</p>
              </article>
            </ScrollReveal>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
