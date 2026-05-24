import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import ContactBanner from '@/components/contact/ContactBanner';
import ContactForm from '@/components/contact/ContactForm';
import ContactMap from '@/components/contact/ContactMap';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import AnimatedCard from '@/components/ui/AnimatedCard';
import {pageMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <ContactBanner title={t('title')} intro={t('intro')} />

        <section className="py-12">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
            <AnimatedCard index={0} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{t('formTitle')}</h2>
              <ContactForm />
            </AnimatedCard>

            <AnimatedCard index={1} className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{t('mapTitle')}</h2>
              <ContactMap />
            </AnimatedCard>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
