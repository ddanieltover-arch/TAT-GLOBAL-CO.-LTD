'use client';

import {useTranslations} from 'next-intl';
import ExportMarketsMapDynamic from './ExportMarketsMapDynamic';
import AnimatedCard from '@/components/ui/AnimatedCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import SectionHeader from '@/components/ui/SectionHeader';

const regionKeys = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'] as const;

export default function ExportMarkets() {
  const t = useTranslations('markets');

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={t('label')} headline={t('headline')} subheadline={t('subheadline')} />

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          <ScrollReveal direction="left">
            <ExportMarketsMapDynamic />
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {regionKeys.map((key, index) => (
              <AnimatedCard
                key={key}
                index={index}
                className="rounded-lg border border-gray-100 bg-gray-100 p-4 text-sm text-gray-700"
              >
                {t(key)}
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
