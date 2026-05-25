'use client';

import {motion} from 'framer-motion';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {imageAlts, siteImages} from '@/lib/site-images';

export default function AboutSection() {
  const t = useTranslations('about');
  const tc = useTranslations('cta');

  return (
    <section className="bg-cream py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8">
        <ScrollReveal as="div">
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
        <ScrollReveal as="div" delay={0.12}>
          <Image
            src={siteImages.aboutFacility}
            alt={imageAlts.aboutFacility}
            width={1024}
            height={650}
            className="h-auto w-full rounded-2xl border border-gold/20 object-cover shadow-card"
            sizes="(max-width: 1024px) 100vw, 640px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
