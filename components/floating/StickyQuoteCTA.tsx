'use client';

import {useEffect, useState} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import Button from '@/components/ui/Button';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';

const SCROLL_THRESHOLD_PX = 300;

export default function StickyQuoteCTA() {
  const t = useTranslations('floating');
  const {openQuoteModal, isOpen} = useQuoteModal();
  const reduceMotion = useReducedMotion();
  const [scrolledEnough, setScrolledEnough] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledEnough(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visible = scrolledEnough && !isOpen;

  return (
    <motion.div
      initial={false}
      animate={{y: visible ? 0 : '110%'}}
      transition={
        reduceMotion
          ? {duration: 0}
          : {type: 'spring', stiffness: 420, damping: 36, mass: 0.8}
      }
      /** Do not animate `opacity` on this wrapper — it can visually wash out backgrounds/text against the page */
      style={{
        pointerEvents: visible ? 'auto' : 'none',
      }}
      className="w-full shadow-[0_-6px_24px_rgba(26,74,46,0.12)]"
      aria-hidden={!visible}
    >
      <div
        className="border-t border-gold/50 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        style={{
          backgroundColor: 'var(--color-gray-100)',
          color: 'var(--color-gray-900)',
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:px-8">
          <p className="text-center text-sm font-medium leading-snug sm:text-left" style={{color: '#1a1814'}}>
            {t('stickyPitch')}
          </p>
          <Button
            type="button"
            size="md"
            tabIndex={visible ? 0 : -1}
            onClick={() => openQuoteModal()}
            className="shrink-0 hover:brightness-105 focus-visible:ring-primary"
          >
            {t('stickyCta')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
