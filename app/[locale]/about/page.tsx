import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import AnimatedCard from '@/components/ui/AnimatedCard';
import PageHero from '@/components/ui/PageHero';
import ParallaxImage from '@/components/ui/ParallaxImage';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {imageAlts, siteImages} from '@/lib/site-images';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/about', 'about');
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

export default async function AboutPage() {
  const t = await getTranslations('about');
  const tPage = await getTranslations('aboutPage');
  const tCommon = await getTranslations('common');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={t('label')} title={t('headline')} description={t('body1')} />

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <ParallaxImage
                src={siteImages.facility}
                alt={imageAlts.facility}
                className="h-72 w-full rounded-2xl border border-gold/25 shadow-card sm:h-96"
                speed={0.32}
                sizes="100vw"
                overlay={
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/40 via-transparent to-transparent" />
                }
              />
            </ScrollReveal>
          </div>
        </section>

        <section className="pb-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
            <AnimatedCard index={0} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{tPage('manufacturingTitle')}</h2>
              <ul className="mt-5 space-y-2 text-gray-700">
                <li>{t('stat1')}</li>
                <li>{t('stat2')}</li>
                <li>{t('stat3')}</li>
                <li>{t('stat4')}</li>
              </ul>
            </AnimatedCard>

            <AnimatedCard index={1} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{tPage('certificationsTitle')}</h2>
              <ul className="mt-5 space-y-2 text-gray-700">
                {certKeys.map((key) => (
                  <li key={key}>{tCommon(key)}</li>
                ))}
              </ul>
            </AnimatedCard>
          </div>
        </section>

        <ScrollReveal as="section" className="bg-primary py-16 text-white">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
            <h2 className="font-display text-4xl">{tPage('ctaHeadline')}</h2>
            <p className="mt-3 text-white/85">{tPage('ctaBody')}</p>
          </div>
        </ScrollReveal>
      </div>
      <Footer />
    </>
  );
}
