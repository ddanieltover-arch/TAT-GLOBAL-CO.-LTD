'use client';

import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useCallback, useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import SectionHeader from '@/components/ui/SectionHeader';
import {heroEase} from '@/lib/motion';

const slides = [
  {quote: 'quote1' as const, author: 'author1' as const},
  {quote: 'quote2' as const, author: 'author2' as const},
  {quote: 'quote3' as const, author: 'author3' as const},
];

const AUTO_ADVANCE_MS = 7000;

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const slide = slides[index];

  return (
    <section className="relative overflow-hidden bg-primary-dark py-20 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(201,168,76,0.5), transparent 50%), radial-gradient(circle at 70% 80%, rgba(232,201,122,0.35), transparent 45%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={t('label')} headline={t('headline')} theme="dark" />

        <div className="relative mt-10">
          <div className="overflow-hidden rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm">
            <div className="flex min-h-[220px] items-center px-6 py-10 sm:min-h-[200px] sm:px-14">
              <AnimatePresence mode="wait" initial={false}>
                <motion.blockquote
                  key={slide.quote}
                  initial={reduceMotion ? false : {opacity: 0, x: 24}}
                  animate={reduceMotion ? undefined : {opacity: 1, x: 0}}
                  exit={reduceMotion ? undefined : {opacity: 0, x: -24}}
                  transition={{duration: 0.45, ease: heroEase}}
                  className="w-full"
                >
                  <p className="text-center text-lg leading-relaxed text-white/90 sm:text-xl">
                    {t(slide.quote)}
                  </p>
                  <footer className="mt-6 text-center text-sm text-gold-light">{t(slide.author)}</footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
          </div>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-primary-dark/80 p-2 text-white transition hover:border-gold-light hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light sm:-left-4"
            aria-label={t('prev')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-primary-dark/80 p-2 text-white transition hover:border-gold-light hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light sm:-right-4"
            aria-label={t('next')}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1" role="tablist" aria-label={t('dotsLabel')}>
          {slides.map((item, i) => (
            <button
              key={item.quote}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={t('goToSlide', {n: i + 1})}
              onClick={() => goTo(i)}
              className="touch-target rounded-full p-2"
            >
              <span
                aria-hidden
                className={[
                  'block h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-8 bg-gold-light' : 'w-2 bg-white/35 hover:bg-white/55',
                ].join(' ')}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
