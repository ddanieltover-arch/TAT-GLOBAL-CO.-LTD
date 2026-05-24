import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import ContactForm from '@/components/contact/ContactForm';
import ContactMap from '@/components/contact/ContactMap';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import AnimatedCard from '@/components/ui/AnimatedCard';
import PageHero from '@/components/ui/PageHero';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';
import {getWhatsAppDisplay, getWhatsAppHref} from '@/lib/whatsapp';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale} = await unwrapRouteParams(params);
  return pageMetadata(locale, '/contact', 'contact');
}

export default async function ContactPage() {
  const t = await getTranslations('contactPage');
  const whatsappDisplay = getWhatsAppDisplay();
  const whatsappHref = getWhatsAppHref();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={t('label')} title={t('title')} description={t('intro')} />

        <section className="py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
            <AnimatedCard index={0} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{t('formTitle')}</h2>
              <ContactForm />
            </AnimatedCard>

            <div className="space-y-6">
              <AnimatedCard index={1} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-3xl text-gray-900">{t('directTitle')}</h2>
                <p className="mt-3 text-gray-700">{t('emailLabel')}</p>
                <p className="mt-1 text-gray-700">
                  {t('whatsappLabel')}:{' '}
                  {whatsappDisplay && whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:text-primary-dark"
                    >
                      {whatsappDisplay}
                    </a>
                  ) : (
                    <span>—</span>
                  )}
                </p>
              </AnimatedCard>

              <AnimatedCard index={2} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
                <h2 className="font-display text-3xl text-gray-900">{t('mapTitle')}</h2>
                <ContactMap />
              </AnimatedCard>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
