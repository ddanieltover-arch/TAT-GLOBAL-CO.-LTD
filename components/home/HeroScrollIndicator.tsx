'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {ChevronDown} from 'lucide-react';
import {useTranslations} from 'next-intl';

export default function HeroScrollIndicator() {
  const t = useTranslations('hero');
  const reduceMotion = useReducedMotion();

  const scrollToContent = () => {
    const target = document.getElementById('trust-bar');
    if (target) {
      target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'start'});
      return;
    }
    window.scrollTo({
      top: window.innerHeight,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <motion.button
      type="button"
      onClick={scrollToContent}
      className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-gold-light/90 transition hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark md:flex"
      aria-label={t('scrollIndicator')}
      initial={reduceMotion ? false : {opacity: 0, y: -8}}
      animate={reduceMotion ? undefined : {opacity: 1, y: 0}}
      transition={{delay: 1.2, duration: 0.6}}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.22em]">{t('scrollLabel')}</span>
      <motion.span
        animate={reduceMotion ? undefined : {y: [0, 6, 0]}}
        transition={{duration: 1.6, repeat: Infinity, ease: 'easeInOut'}}
        aria-hidden
      >
        <ChevronDown className="h-6 w-6" strokeWidth={1.75} />
      </motion.span>
    </motion.button>
  );
}
