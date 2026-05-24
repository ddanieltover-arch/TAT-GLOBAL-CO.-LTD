'use client';

import {useTranslations} from 'next-intl';
import AnimatedCard from '@/components/ui/AnimatedCard';
import SectionHeader from '@/components/ui/SectionHeader';

export default function PackagingSection() {
  const t = useTranslations('packaging');
  const pk = ['p1', 'p2', 'p3', 'p4', 'p5'] as const;
  const ck = ['c1', 'c2', 'c3', 'c4'] as const;
  const sk = ['s1', 's2', 's3', 's4'] as const;

  const columns = [
    {title: t('typesTitle'), keys: pk},
    {title: t('containerTitle'), keys: ck},
    {title: t('shippingTitle'), keys: sk},
  ] as const;

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={t('label')} headline={t('headline')} />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {columns.map((col, idx) => (
            <AnimatedCard
              key={col.title}
              index={idx}
              className="rounded-xl border border-gold/25 bg-white p-6"
            >
              <h3 className="font-display text-2xl text-gray-900">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                {col.keys.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
