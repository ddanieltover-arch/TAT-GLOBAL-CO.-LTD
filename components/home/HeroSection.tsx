'use client';

import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {useRef} from 'react';
import {useIsMobile} from '@/lib/a11y/use-is-mobile';
import {useLocale, useTranslations} from 'next-intl';
import Image from 'next/image';
import HeroScrollIndicator from '@/components/home/HeroScrollIndicator';
import Button from '@/components/ui/Button';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';
import {imageAlts, siteImages} from '@/lib/site-images';
import {
  heroCta,
  heroDramaticFade,
  heroEase,
  heroEyebrow,
  heroStagger,
  splitHeroHeadline,
} from '@/lib/motion';

function HeroBackground({
  reduceMotion,
  imageQuality,
}: {
  reduceMotion: boolean | null;
  imageQuality: number;
}) {
  const photo = (
    <picture className="absolute inset-0 block h-full w-full">
      <source media="(max-width: 767px)" srcSet={siteImages.heroMobile} />
      <Image
        src={siteImages.hero}
        alt={imageAlts.hero}
        fill
        priority
        fetchPriority="high"
        quality={imageQuality}
        sizes="100vw"
        className="object-cover object-center max-md:object-[center_28%]"
      />
    </picture>
  );

  return (
    <div className="absolute inset-0 h-full min-h-[100vh] w-full">
      {reduceMotion ? (
        <div className="absolute inset-0">{photo}</div>
      ) : (
        <motion.div
          className="absolute inset-0 scale-105"
          initial={{scale: 1.08}}
          animate={{scale: 1.05}}
          transition={{duration: 1.2, ease: [0.16, 1, 0.3, 1]}}
        >
          {photo}
        </motion.div>
      )}

      {/* Brand scrim: primary green 55% + black tint — readable copy on hero art */}
      <div className="absolute inset-0 bg-primary-dark/55" aria-hidden />
      <div className="absolute inset-0 bg-black/45" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/92 to-primary-dark/82"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary-dark/92 via-primary-dark/50 to-primary-dark/78"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 left-0 w-full max-w-4xl bg-gradient-to-r from-primary-dark/88 via-primary-dark/60 to-transparent"
        aria-hidden
      />
    </div>
  );
}

function HeroHeadline({text, reduceMotion}: {text: string; reduceMotion: boolean | null}) {
  const locale = useLocale();
  const heroHeadlineClass =
    locale === 'th'
      ? 'mt-5 max-w-4xl font-thai text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl'
      : 'mt-5 max-w-4xl font-display text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl';
  const lines = splitHeroHeadline(text);

  if (reduceMotion) {
    return (
      <h1 className={heroHeadlineClass}>
        {text}
      </h1>
    );
  }

  return (
    <h1 className={heroHeadlineClass}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="block overflow-hidden py-0.5">
          <motion.span
            className="block"
            initial={{y: '108%', opacity: 0, rotateX: 14}}
            animate={{y: 0, opacity: 1, rotateX: 0}}
            transition={{
              duration: 0.9,
              delay: 0.42 + index * 0.15,
              ease: heroEase,
            }}
            style={{transformPerspective: 800}}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const {openQuoteModal} = useQuoteModal();
  const t = useTranslations('hero');
  const tc = useTranslations('cta');
  const tTrust = useTranslations();
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const heroQuality = isMobile ? 68 : 82;

  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 120]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100vh] items-start overflow-hidden text-white"
    >
      <HeroBackground reduceMotion={reduceMotion} imageQuality={heroQuality} />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-8 lg:px-8 lg:pt-10">
        <motion.div
          style={{y: contentY}}
          initial={reduceMotion ? false : 'hidden'}
          animate={reduceMotion ? undefined : 'visible'}
          variants={heroStagger}
        >
          <div className="max-w-4xl">
            <motion.p
              variants={heroEyebrow}
              className="font-mono text-xs uppercase tracking-[0.2em] text-gold-light"
            >
              {t('eyebrow')}
            </motion.p>
            {!reduceMotion ? (
              <motion.div
                className="mt-4 h-px max-w-xs origin-left bg-gradient-to-r from-gold via-gold-light to-transparent"
                initial={{scaleX: 0, opacity: 0}}
                animate={{scaleX: 1, opacity: 1}}
                transition={{duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1]}}
                aria-hidden
              />
            ) : null}

            <HeroHeadline text={t('headline')} reduceMotion={reduceMotion} />

            <motion.p
              variants={heroDramaticFade}
              className="mt-6 max-w-3xl text-base leading-relaxed text-white sm:text-lg"
            >
              {t('subheadline')}
            </motion.p>
          </div>

          <motion.div variants={heroCta} className="mt-8 flex flex-wrap gap-3">
            <motion.div className="inline-flex" whileHover={{scale: 1.06, y: -4}} whileTap={{scale: 0.96}}>
              <Button
                type="button"
                size="lg"
                onClick={() => openQuoteModal()}
                className="shadow-[0_8px_32px_rgba(201,168,76,0.35)] hover:shadow-[0_12px_40px_rgba(201,168,76,0.45)]"
              >
                {tc('requestQuoteArrow')}
              </Button>
            </motion.div>
            <motion.div className="inline-flex" whileHover={{scale: 1.04, y: -3}} whileTap={{scale: 0.97}}>
              <Button href="/products" variant="outline-white" size="lg">
                {tc('exploreProducts')}
              </Button>
            </motion.div>
          </motion.div>

            <motion.p
              variants={heroDramaticFade}
              className="mt-6 text-sm text-white"
            >
              {tTrust('heroTrust')}
            </motion.p>
        </motion.div>
      </div>

      <HeroScrollIndicator />
    </section>
  );
}
