'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import QualityTimeline from '@/components/ui/QualityTimeline';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SectionHeader from '@/components/ui/SectionHeader';
import {imageAlts, siteImages} from '@/lib/site-images';

export default function QualitySection() {
  const t = useTranslations('quality');

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={t('label')} headline={t('headline')} />

        <QualityTimeline className="mt-12" />

        <ScrollReveal className="mt-14 rounded-xl border border-gold/20 bg-cream p-8">
          <h3 className="font-display text-3xl text-gray-900">{t('certHeadline')}</h3>
          <p className="mt-2 text-gray-700">{t('certBody')}</p>
          <div className="mt-6 overflow-hidden rounded-xl border border-gold/20 bg-white shadow-card">
            <Image
              src={siteImages.homeCertifications}
              alt={imageAlts.homeCertifications}
              width={1536}
              height={1024}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="h-auto w-full"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
