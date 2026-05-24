'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import Button from '@/components/ui/Button';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {fadeUp, staggerContainer, viewTransition} from '@/lib/motion';

export default function CTASection() {
  const {openQuoteModal} = useQuoteModal();
  const tc = useTranslations('cta');
  const t = useTranslations('finalCta');
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-primary py-20 text-white">
      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(201,168,76,0.25),transparent_55%)]"
          animate={{opacity: [0.6, 1, 0.6]}}
          transition={{duration: 6, repeat: Infinity, ease: 'easeInOut'}}
          aria-hidden
        />
      ) : null}
      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
        <ScrollReveal direction="none">
          <motion.div
            initial={reduceMotion ? false : 'hidden'}
            whileInView={reduceMotion ? undefined : 'visible'}
            viewport={{once: true}}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} transition={viewTransition} className="font-display text-4xl">
              {t('headline')}
            </motion.h2>
            <motion.p variants={fadeUp} transition={viewTransition} className="mt-4 text-white/85">
              {t('subheadline')}
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={viewTransition}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <motion.div whileHover={{scale: 1.05, y: -3}} whileTap={{scale: 0.97}}>
                <Button type="button" size="lg" onClick={() => openQuoteModal()}>
                  {tc('requestQuoteArrow')}
                </Button>
              </motion.div>
              <motion.div whileHover={{scale: 1.03, y: -2}} whileTap={{scale: 0.97}}>
                <Button href="/contact" variant="outline-white" size="lg">
                  {tc('contactSalesTeam')}
                </Button>
              </motion.div>
            </motion.div>
            <motion.p variants={fadeUp} transition={viewTransition} className="mt-5 text-sm text-white/70">
              {t('trust')}
            </motion.p>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
