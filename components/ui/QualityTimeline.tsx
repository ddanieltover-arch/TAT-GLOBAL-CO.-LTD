'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {
  ClipboardCheck,
  FlaskConical,
  Search,
  Settings2,
  ShieldCheck,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {parseStepText} from '@/lib/parse-step';
import {fadeUp, viewTransition, viewportOnce} from '@/lib/motion';

const stepKeys = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6'] as const;

const stepIcons: LucideIcon[] = [Sprout, Search, Settings2, FlaskConical, ShieldCheck, ClipboardCheck];

type QualityTimelineProps = {
  className?: string;
};

export default function QualityTimeline({className = ''}: QualityTimelineProps) {
  const t = useTranslations('quality');
  const reduceMotion = useReducedMotion();

  const steps = stepKeys.map((key, index) => {
    const parsed = parseStepText(t(key));
    return {
      key,
      index,
      Icon: stepIcons[index],
      ...parsed,
    };
  });

  return (
    <div className={className}>
      {/* Desktop: horizontal timeline */}
      <div className="relative hidden lg:block">
        <div
          className="pointer-events-none absolute left-0 right-0 top-8 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
          aria-hidden
        />
        <ol className="relative grid grid-cols-6 gap-4">
          {steps.map((step, idx) => (
            <motion.li
              key={step.key}
              className="relative flex flex-col items-center text-center"
              initial={reduceMotion ? false : 'hidden'}
              whileInView={reduceMotion ? undefined : 'visible'}
              viewport={viewportOnce}
              variants={fadeUp}
              transition={{...viewTransition, delay: idx * 0.08}}
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold/40 bg-white shadow-card">
                <step.Icon className="h-7 w-7 text-primary" strokeWidth={1.5} aria-hidden />
                <span className="absolute -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-gold-light">
                  {idx + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-lg leading-snug text-gray-900">{step.title}</h3>
              {step.description ? (
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{step.description}</p>
              ) : null}
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Mobile / tablet: vertical timeline */}
      <div className="relative lg:hidden">
        <div
          className="pointer-events-none absolute bottom-4 left-8 top-4 w-px bg-gradient-to-b from-gold/20 via-gold/50 to-gold/20"
          aria-hidden
        />
        <ol className="relative space-y-0">
          {steps.map((step, idx) => (
            <motion.li
              key={step.key}
              className="relative flex gap-6 pb-10 last:pb-0"
              initial={reduceMotion ? false : 'hidden'}
              whileInView={reduceMotion ? undefined : 'visible'}
              viewport={viewportOnce}
              variants={fadeUp}
              transition={{...viewTransition, delay: idx * 0.06}}
            >
              <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-gold/40 bg-white shadow-card">
                <step.Icon className="h-6 w-6 text-primary" strokeWidth={1.5} aria-hidden />
              </div>
              <div className="pt-3">
                <p className="font-mono text-xs text-primary">0{idx + 1}</p>
                <h3 className="mt-1 font-display text-xl text-gray-900">{step.title}</h3>
                {step.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{step.description}</p>
                ) : null}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
