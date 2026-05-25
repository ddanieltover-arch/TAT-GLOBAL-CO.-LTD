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

const environmentalKeys = ['env1', 'env2', 'env3', 'env4'] as const;
const socialKeys = ['social1', 'social2', 'social3'] as const;
const proofKeys = ['proof1', 'proof2', 'proof3', 'proof4'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/sustainability', 'sustainability');
}

export default async function SustainabilityPage() {
  const tPage = await getTranslations('sustainabilityPage');
  const tCta = await getTranslations('cta');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={tPage('label')} title={tPage('title')} description={tPage('intro')}>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact">{tCta('contactSales')}</Button>
            <Button href="/quality" variant="outline-primary">
              {tCta('learnMore')}
            </Button>
          </div>
        </PageHero>

        <PageImageBanner
          src={siteImages.sustainabilityBanner}
          alt={imageAlts.sustainabilityBanner}
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
                {tPage('environmentTitle')}
              </p>
              <h2 className="mt-3 font-display text-4xl text-gray-900">{tPage('environmentTitle')}</h2>
              <p className="mt-3 text-gray-700">{tPage('environmentIntro')}</p>
            </ScrollReveal>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {environmentalKeys.map((key, index) => (
                <AnimatedCard
                  key={key}
                  index={index}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-card"
                >
                  <h3 className="font-display text-2xl text-gray-900">{tPage(`${key}Title`)}</h3>
                  <p className="mt-3 leading-6 text-gray-700">{tPage(`${key}Body`)}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3 lg:px-8">
            <ScrollReveal className="rounded-xl border border-gold/30 bg-primary-dark p-6 text-white shadow-card md:p-8 lg:col-span-1">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-light">
                {tPage('socialTitle')}
              </p>
              <h2 className="mt-3 font-display text-3xl text-white">{tPage('socialTitle')}</h2>
              <p className="mt-3 leading-6 text-white/80">{tPage('socialIntro')}</p>
            </ScrollReveal>

            <div className="grid gap-5 lg:col-span-2">
              {socialKeys.map((key, index) => (
                <AnimatedCard
                  key={key}
                  index={index}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-card"
                >
                  <h3 className="font-display text-2xl text-gray-900">{tPage(`${key}Title`)}</h3>
                  <p className="mt-3 leading-6 text-gray-700">{tPage(`${key}Body`)}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
            <ScrollReveal>
              <article className="h-full rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-3xl text-gray-900">{tPage('improvementTitle')}</h2>
                <p className="mt-4 leading-7 text-gray-700">{tPage('improvementBody')}</p>
              </article>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <article className="h-full rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-3xl text-gray-900">{tPage('proofTitle')}</h2>
                <ul className="mt-5 space-y-3 text-gray-700">
                  {proofKeys.map((key) => (
                    <li key={key} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden />
                      <span>{tPage(key)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          </div>
        </section>

        <section className="pb-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal>
              <article className="rounded-xl border border-gold/30 bg-primary-dark p-6 text-white shadow-card md:flex md:items-center md:justify-between md:gap-8 md:p-8">
                <div>
                  <h2 className="font-display text-3xl text-gold-light">{tPage('ctaTitle')}</h2>
                  <p className="mt-3 max-w-3xl leading-6 text-white/80">{tPage('ctaBody')}</p>
                </div>
                <Button href="/contact" className="mt-6 shrink-0 md:mt-0">
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
