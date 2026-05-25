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

const testimonialKeys = ['1', '2', '3', '4', '5', '6'] as const;
const proofKeys = ['proof1', 'proof2', 'proof3', 'proof4'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/testimonials', 'testimonials');
}

export default async function TestimonialsPage() {
  const tPage = await getTranslations('testimonialsPage');
  const tCta = await getTranslations('cta');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={tPage('label')} title={tPage('title')} description={tPage('intro')}>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact">{tCta('requestQuote')}</Button>
            <Button href="/products" variant="outline-primary">
              {tCta('viewProducts')}
            </Button>
          </div>
        </PageHero>

        <PageImageBanner
          src={siteImages.testimonialsBanner}
          alt={imageAlts.testimonialsBanner}
          title={tPage('title')}
          intro={tPage('intro')}
          width={1024}
          height={576}
          priority
        />

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {tPage('sectionLabel')}
              </p>
              <h2 className="mt-3 font-display text-4xl text-gray-900">{tPage('sectionTitle')}</h2>
            </ScrollReveal>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonialKeys.map((key, index) => (
                <AnimatedCard
                  key={key}
                  index={index}
                  className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-card"
                >
                  <p className="text-5xl leading-none text-gold" aria-hidden>
                    &ldquo;
                  </p>
                  <blockquote className="mt-2 flex-1 text-gray-700">
                    <p className="leading-7">{tPage(`quote${key}`)}</p>
                  </blockquote>
                  <footer className="mt-6 border-t border-gray-100 pt-4">
                    <p className="font-semibold text-gray-900">{tPage(`name${key}`)}</p>
                    <p className="mt-1 text-sm text-gray-700">{tPage(`role${key}`)}</p>
                    <p className="mt-1 text-sm font-medium text-primary">{tPage(`location${key}`)}</p>
                  </footer>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-3 lg:px-8">
            <ScrollReveal className="lg:col-span-2">
              <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
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

            <ScrollReveal direction="right">
              <aside className="rounded-xl border border-gold/30 bg-primary-dark p-6 text-white shadow-card">
                <h2 className="font-display text-3xl text-gold-light">{tPage('ctaTitle')}</h2>
                <p className="mt-3 text-sm leading-6 text-white/80">{tPage('ctaBody')}</p>
                <Button href="/contact" className="mt-6 w-full">
                  {tCta('contactSales')}
                </Button>
              </aside>
            </ScrollReveal>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
