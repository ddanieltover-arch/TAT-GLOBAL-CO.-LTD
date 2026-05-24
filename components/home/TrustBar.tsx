'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import {fadeUp, viewTransition, viewportOnce} from '@/lib/motion';

/** Matches SKILL.md Section 2 — Trust Bar stats */
const statConfig = [
  {labelKey: 'yearsExperience' as const, value: 20, suffix: '+'},
  {labelKey: 'exportCountries' as const, value: 40, suffix: '+'},
  {labelKey: 'mtAnnualCapacity' as const, value: 50000, suffix: '+'},
  {labelKey: 'riceVarieties' as const, value: 22, suffix: ''},
  {labelKey: 'qualityCertifications' as const, value: 8, suffix: ''},
  {labelKey: 'responseTime' as const, value: 24, suffix: 'h'},
];

export default function TrustBar() {
  const t = useTranslations('trustBar');
  const reduceMotion = useReducedMotion();

  return (
    <section id="trust-bar" className="scroll-mt-24 bg-primary py-10">
      <div className="mx-auto grid max-w-7xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-8 xl:grid-cols-6">
        {statConfig.map((stat, index) => (
          <motion.div
            key={stat.labelKey}
            className="rounded-lg border border-gold/20 bg-primary-dark/35 p-4 text-center"
            initial={reduceMotion ? false : 'hidden'}
            whileInView={reduceMotion ? undefined : 'visible'}
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{...viewTransition, delay: index * 0.07}}
            whileHover={reduceMotion ? undefined : {y: -4, scale: 1.02}}
          >
            <AnimatedCounter
              target={stat.value}
              suffix={stat.suffix}
              className="text-2xl font-bold text-gold-light sm:text-3xl"
            />
            <p className="mt-2 text-xs leading-relaxed text-white/80">{t(stat.labelKey)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
