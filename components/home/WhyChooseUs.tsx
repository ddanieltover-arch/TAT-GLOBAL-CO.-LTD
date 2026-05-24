'use client';

import {useTranslations} from 'next-intl';
import {Leaf, ShieldCheck, Landmark, Package, FileText, Clock3} from 'lucide-react';
import AnimatedCard from '@/components/ui/AnimatedCard';
import SectionHeader from '@/components/ui/SectionHeader';

const items = [
  {Icon: Leaf, titleKey: 'r1Title' as const, descKey: 'r1Desc' as const},
  {Icon: ShieldCheck, titleKey: 'r2Title' as const, descKey: 'r2Desc' as const},
  {Icon: Landmark, titleKey: 'r3Title' as const, descKey: 'r3Desc' as const},
  {Icon: Package, titleKey: 'r4Title' as const, descKey: 'r4Desc' as const},
  {Icon: FileText, titleKey: 'r5Title' as const, descKey: 'r5Desc' as const},
  {Icon: Clock3, titleKey: 'r6Title' as const, descKey: 'r6Desc' as const},
];

export default function WhyChooseUs() {
  const t = useTranslations('whyUs');

  return (
    <section className="bg-gray-100 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={t('label')} headline={t('headline')} />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map(({Icon, titleKey, descKey}, idx) => (
            <AnimatedCard
              key={titleKey}
              index={idx}
              className="rounded-xl border border-white bg-white p-6 shadow-card"
            >
              <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              <h3 className="mt-4 font-display text-2xl text-gray-900">{t(titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{t(descKey)}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
