'use client';

import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {useRef} from 'react';
import {useIsMobile} from '@/lib/a11y/use-is-mobile';
import {useTranslations} from 'next-intl';
import HeroScrollIndicator from '@/components/home/HeroScrollIndicator';
import Button from '@/components/ui/Button';
import ParallaxImage from '@/components/ui/ParallaxImage';
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
  const overlays = (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(201,168,76,0.24),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(232,201,122,0.2),transparent_40%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/78 to-primary/58" />
    </>
  );

  if (reduceMotion) {
    return (
      <>
        <ParallaxImage
          src={siteImages.hero}
          alt={imageAlts.hero}
          className="absolute inset-0"
          speed={0}
          priority
          sizes="100vw"
          quality={imageQuality}
        />
        {overlays}
      </>
    );
  }

  return (
    <>
      <ParallaxImage
        src={siteImages.hero}
        alt={imageAlts.hero}
        className="absolute inset-0"
        speed={0.45}
        priority
        sizes="(max-width: 767px) 100vw, 1920px"
        quality={imageQuality}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(201,168,76,0.28),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(232,201,122,0.22),transparent_45%)]"
        initial={{scale: 1.2, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 1.6, ease: [0.16, 1, 0.3, 1]}}
      />
      {overlays}

      <motion.div
        className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-gold/20 blur-3xl"
        animate={{x: [0, 80, 20, 0], y: [0, -48, 12, 0], scale: [1, 1.15, 1.05, 1]}}
        transition={{duration: 16, repeat: Infinity, ease: 'easeInOut'}}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-gold-light/15 blur-3xl"
        animate={{x: [0, -60, -20, 0], y: [0, 40, -20, 0], scale: [1, 1.2, 1.08, 1]}}
        transition={{duration: 20, repeat: Infinity, ease: 'easeInOut'}}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-primary/40 blur-3xl"
        animate={{opacity: [0.3, 0.65, 0.3], scale: [0.9, 1.1, 0.9]}}
        transition={{duration: 8, repeat: Infinity, ease: 'easeInOut'}}
        aria-hidden
      />

      <motion.div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'linear-gradient(105deg, transparent 40%, rgba(232,201,122,0.12) 50%, transparent 60%)',
        }}
        animate={{x: ['-100%', '200%']}}
        transition={{duration: 5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut'}}
        aria-hidden
      />
    </>
  );
}

function HeroHeadline({text, reduceMotion}: {text: string; reduceMotion: boolean | null}) {
  const lines = splitHeroHeadline(text);

  if (reduceMotion) {
    return (
      <h1 className="mt-5 max-w-4xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
        {text}
      </h1>
    );
  }

  return (
    <h1 className="mt-5 max-w-4xl font-display text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
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
  const bgY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.08]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100vh] items-start overflow-hidden bg-primary-dark text-white"
    >
      <motion.div className="absolute inset-0" style={{y: bgY, scale: bgScale}}>
        <HeroBackground reduceMotion={reduceMotion} imageQuality={heroQuality} />
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-8 lg:px-8 lg:pt-10">
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
              className="mt-6 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg"
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
            className="mt-6 text-sm text-white/75"
          >
            {tTrust('heroTrust')}
          </motion.p>
        </motion.div>
      </div>

      <HeroScrollIndicator />
    </section>
  );
}
