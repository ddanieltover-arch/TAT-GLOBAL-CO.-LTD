'use client';

import {useTranslations} from 'next-intl';
import QualityTimeline from '@/components/ui/QualityTimeline';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SectionHeader from '@/components/ui/SectionHeader';

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
        </ScrollReveal>
      </div>
    </section>
  );
}
