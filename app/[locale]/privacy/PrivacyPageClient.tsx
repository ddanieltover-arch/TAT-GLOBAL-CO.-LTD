'use client';

import {useTranslations} from 'next-intl';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import GoldDivider from '@/components/ui/GoldDivider';
import PageHero from '@/components/ui/PageHero';
import ScrollReveal from '@/components/ui/ScrollReveal';

const SECTION_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'] as const;

export default function PrivacyPageClient() {
  const t = useTranslations('privacyPage');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={t('label')} title={t('title')} />

        <section className="py-12">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <ScrollReveal>
              <p className="text-sm text-gray-500">{t('lastUpdated')}</p>
              <p className="mt-4 text-base leading-relaxed text-gray-700">{t('intro')}</p>
            </ScrollReveal>

            <GoldDivider className="my-10" />

            <div className="space-y-10">
              {SECTION_KEYS.map((key, index) => (
                <ScrollReveal key={key} delay={index * 0.04}>
                  <article>
                    <h2 className="font-display text-xl text-primary-dark">
                      {t(`${key}Title`)}
                    </h2>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                      {t(`${key}Body`)}
                    </p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
