'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import Button from '@/components/ui/Button';
import ParallaxImage from '@/components/ui/ParallaxImage';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {imageAlts, siteImages} from '@/lib/site-images';
import {viewTransition} from '@/lib/motion';

export default function AboutSection() {
  const t = useTranslations('about');
  const tc = useTranslations('cta');
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2 lg:px-8">
        <ScrollReveal direction="left" as="div">
          <motion.div
            className="overflow-hidden rounded-2xl border border-gold/25 shadow-card"
            whileHover={reduceMotion ? undefined : {scale: 1.02}}
            transition={viewTransition}
          >
            <ParallaxImage
              src={siteImages.about}
              alt={imageAlts.about}
              className="h-[360px] w-full"
              speed={0.35}
              sizes="(max-width: 1024px) 100vw, 50vw"
              overlay={
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-dark/50 via-transparent to-transparent" />
              }
            />
          </motion.div>
        </ScrollReveal>
        <ScrollReveal direction="right" as="div">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{t('label')}</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-gray-900">{t('headline')}</h2>
          <p className="mt-5 text-gray-700">{t('body1')}</p>
          <p className="mt-4 text-gray-700">{t('body2')}</p>
          <p className="mt-4 text-gray-700">{t('body3')}</p>
          <ul className="mt-6 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <li>{t('stat1')}</li>
            <li>{t('stat2')}</li>
            <li>{t('stat3')}</li>
            <li>{t('stat4')}</li>
          </ul>
          <motion.div whileHover={{x: 4}} whileTap={{scale: 0.98}} className="mt-7 inline-block">
            <Button href="/about" variant="outline-primary" size="md">
              {tc('learnMoreArrow')}
            </Button>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
