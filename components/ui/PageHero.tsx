'use client';

import {motion, useReducedMotion} from 'framer-motion';
import type {ReactNode} from 'react';
import GoldDivider from './GoldDivider';
import {fadeUp, staggerContainer, viewTransition} from '@/lib/motion';

type PageHeroProps = {
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageHero({label, title, description, children}: PageHeroProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <section className="border-b border-gold/25 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{label}</p>
          <h1 className="mt-4 font-display text-5xl text-gray-900">{title}</h1>
          {description ? <p className="mt-3 max-w-3xl text-gray-700">{description}</p> : null}
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-gold/25 bg-white py-16">
      <motion.div
        className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        animate={{x: [0, -24, 0], y: [0, 16, 0]}}
        transition={{duration: 10, repeat: Infinity, ease: 'easeInOut'}}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.p
            variants={fadeUp}
            transition={viewTransition}
            className="font-mono text-xs uppercase tracking-[0.2em] text-primary"
          >
            {label}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            transition={viewTransition}
            className="mt-4 font-display text-5xl text-gray-900"
          >
            {title}
          </motion.h1>
          {description ? (
            <motion.p
              variants={fadeUp}
              transition={viewTransition}
              className="mt-3 max-w-3xl text-gray-700"
            >
              {description}
            </motion.p>
          ) : null}
          <motion.div variants={fadeUp} transition={viewTransition}>
            <GoldDivider />
          </motion.div>
          {children ? (
            <motion.div variants={fadeUp} transition={viewTransition} className="mt-8">
              {children}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
