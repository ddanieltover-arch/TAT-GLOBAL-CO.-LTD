import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import AnimatedCard from '@/components/ui/AnimatedCard';
import PageHero from '@/components/ui/PageHero';
import PageImageBanner from '@/components/ui/PageImageBanner';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {imageAlts, siteImages} from '@/lib/site-images';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

const stageKeys = ['stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'stage6'] as const;
const protocolKeys = ['protocol1', 'protocol2', 'protocol3', 'protocol4', 'protocol5'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/quality-control', 'qualityControl');
}

export default async function QualityControlPage() {
  const tPage = await getTranslations('qualityControlPage');
  const tCta = await getTranslations('cta');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={tPage('label')} title={tPage('title')} description={tPage('intro')}>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact">{tCta('requestQuote')}</Button>
            <Button href="/quality" variant="outline-primary">
              {tCta('learnMore')}
            </Button>
          </div>
        </PageHero>

        <PageImageBanner
          src={siteImages.qualityControlBanner}
          alt={imageAlts.qualityControlBanner}
          title={tPage('title')}
          intro={tPage('intro')}
          width={1024}
          height={576}
          priority
        />

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-card md:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  {tPage('commitmentTitle')}
                </p>
                <h2 className="mt-3 font-display text-4xl text-gray-900">
                  {tPage('commitmentTitle')}
                </h2>
                <p className="mt-4 max-w-4xl leading-7 text-gray-700">{tPage('commitmentBody')}</p>
              </article>
            </ScrollReveal>
          </div>
        </section>

        <section className="pb-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {tPage('assuranceTitle')}
              </p>
              <h2 className="mt-3 font-display text-4xl text-gray-900">{tPage('assuranceTitle')}</h2>
            </ScrollReveal>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {stageKeys.map((key, index) => (
                <AnimatedCard
                  key={key}
                  index={index}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-card"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-gold-light">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-gray-900">{tPage(`${key}Title`)}</h3>
                  <p className="mt-3 leading-6 text-gray-700">{tPage(`${key}Body`)}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3 lg:px-8">
            <ScrollReveal className="lg:col-span-2">
              <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-3xl text-gray-900">{tPage('protocolsTitle')}</h2>
                <p className="mt-3 leading-6 text-gray-700">{tPage('protocolsIntro')}</p>
                <ul className="mt-5 space-y-3 text-gray-700">
                  {protocolKeys.map((key) => (
                    <li key={key} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
                      <span>{tPage(key)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <aside className="rounded-xl border border-gold/30 bg-primary-dark p-6 text-white shadow-card">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-light">
                  {tPage('documentationTitle')}
                </p>
                <p className="mt-4 text-sm leading-6 text-white/80">{tPage('documentationBody')}</p>
              </aside>
            </ScrollReveal>
          </div>
        </section>

        <section className="pb-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
            <ScrollReveal>
              <article className="h-full rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-3xl text-gray-900">{tPage('goalTitle')}</h2>
                <p className="mt-4 leading-7 text-gray-700">{tPage('goalBody')}</p>
              </article>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <article className="h-full rounded-xl border border-gold/30 bg-primary-dark p-6 text-white shadow-card">
                <h2 className="font-display text-3xl text-gold-light">{tPage('ctaTitle')}</h2>
                <p className="mt-3 leading-6 text-white/80">{tPage('ctaBody')}</p>
                <Button href="/contact" className="mt-6">
                  {tCta('contactSales')}
                </Button>
              </article>
            </ScrollReveal>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
