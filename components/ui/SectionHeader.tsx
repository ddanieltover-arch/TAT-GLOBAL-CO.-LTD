'use client';

import {motion, useReducedMotion} from 'framer-motion';
import GoldDivider from './GoldDivider';
import {fadeUp, staggerContainer, viewTransition, viewportOnce} from '@/lib/motion';

type SectionHeaderProps = {
  label: string;
  headline: string;
  subheadline?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
};

export default function SectionHeader({
  label,
  headline,
  subheadline,
  align = 'left',
  theme = 'light',
}: SectionHeaderProps) {
  const reduceMotion = useReducedMotion();
  const isCenter = align === 'center';
  const isDark = theme === 'dark';

  const labelClass = isDark ? 'text-gold-light' : 'text-primary';
  const headlineClass = isDark ? 'text-white' : 'text-gray-900';
  const subClass = isDark ? 'text-white/80' : 'text-gray-700';

  if (reduceMotion) {
    return (
      <div className={isCenter ? 'text-center' : ''}>
        <p className={`font-mono text-xs uppercase tracking-[0.2em] ${labelClass}`}>{label}</p>
        <h2 className={`mt-4 font-display text-4xl ${headlineClass}`}>{headline}</h2>
        {subheadline ? <p className={`mt-3 max-w-3xl text-gray-700 ${subClass} ${isCenter ? 'mx-auto' : ''}`}>{subheadline}</p> : null}
        <GoldDivider className={isCenter ? 'mx-auto' : ''} />
      </div>
    );
  }

  return (
    <motion.div
      className={isCenter ? 'text-center' : ''}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
    >
      <motion.p
        variants={fadeUp}
        transition={viewTransition}
        className={`font-mono text-xs uppercase tracking-[0.2em] ${labelClass}`}
      >
        {label}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        transition={viewTransition}
        className={`mt-4 font-display text-4xl ${headlineClass}`}
      >
        {headline}
      </motion.h2>
      {subheadline ? (
        <motion.p
          variants={fadeUp}
          transition={viewTransition}
          className={`mt-3 max-w-3xl ${subClass} ${isCenter ? 'mx-auto' : ''}`}
        >
          {subheadline}
        </motion.p>
      ) : null}
      <motion.div variants={fadeUp} transition={viewTransition}>
        <GoldDivider className={isCenter ? 'mx-auto' : ''} />
      </motion.div>
    </motion.div>
  );
}
