'use client';

import {useEffect, useState} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {ArrowUp} from 'lucide-react';
import {useTranslations} from 'next-intl';

const SCROLL_THRESHOLD_PX = 480;

export default function BackToTopButton() {
  const t = useTranslations('floating');
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: reduceMotion ? 'auto' : 'smooth'});
  };

  return (
    <motion.button
      type="button"
      onClick={scrollToTop}
      initial={false}
      animate={{opacity: visible ? 1 : 0, y: visible ? 0 : 12, scale: visible ? 1 : 0.96}}
      transition={reduceMotion ? {duration: 0} : {duration: 0.2, ease: 'easeOut'}}
      style={{pointerEvents: visible ? 'auto' : 'none'}}
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 bg-primary-dark text-gold-light shadow-lg shadow-primary-dark/20 transition hover:-translate-y-0.5 hover:border-gold hover:bg-primary hover:text-white hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 motion-reduce:transition-none sm:bottom-[calc(4.25rem+env(safe-area-inset-bottom))] sm:left-6"
      aria-label={t('backToTop')}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </motion.button>
  );
}
