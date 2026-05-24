'use client';

import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {ChevronLeft, ChevronRight, X} from 'lucide-react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useCallback, useEffect, useId, useRef, useState} from 'react';
import {useDialogA11y} from '@/lib/a11y/use-dialog-a11y';
import {cn} from '@/lib/cn';
import type {ProductGalleryImage} from '@/lib/site-images';

type ProductGalleryProps = {
  productName: string;
  images: ProductGalleryImage[];
};

function GalleryImage({
  src,
  fallbackSrc,
  alt,
  fill,
  className,
  sizes,
  priority,
  quality,
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}) {
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    setActiveSrc(src);
  }, [src]);

  return (
    <Image
      src={activeSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      quality={quality}
      onError={() => {
        if (fallbackSrc && activeSrc !== fallbackSrc) {
          setActiveSrc(fallbackSrc);
        }
      }}
    />
  );
}

type GalleryLightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  images: ProductGalleryImage[];
  index: number;
  onPrev: () => void;
  onNext: () => void;
  productName: string;
};

function GalleryLightbox({
  isOpen,
  onClose,
  images,
  index,
  onPrev,
  onNext,
  productName,
}: GalleryLightboxProps) {
  const t = useTranslations('products.gallery');
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useDialogA11y({
    isOpen,
    onClose,
    initialFocusRef: closeBtnRef,
  });

  const current = images[index];
  const caption = current ? t(`captions.${current.captionKey}`) : '';
  const alt = current ? t('imageAlt', {product: productName, caption}) : '';
  const count = images.length;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onNext, onPrev]);

  return (
    <AnimatePresence>
      {isOpen && current ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-primary-dark/85 p-3 backdrop-blur-sm sm:p-5"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={reduceMotion ? {duration: 0} : {duration: 0.2}}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label={t('closeBackdrop')}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            className="relative z-10 flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-2xl"
            initial={reduceMotion ? false : {scale: 0.96, opacity: 0}}
            animate={reduceMotion ? undefined : {scale: 1, opacity: 1}}
            exit={reduceMotion ? undefined : {scale: 0.98, opacity: 0}}
            transition={{duration: 0.22}}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
              <div className="min-w-0 pr-2">
                <h2 id={titleId} className="font-display text-base text-primary-dark sm:text-lg">
                  {t('lightboxTitle')}
                </h2>
                <p className="mt-0.5 text-sm text-gray-600">
                  {caption}{' '}
                  <span className="text-gray-400">
                    ({index + 1} / {count})
                  </span>
                </p>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label={t('closeLightbox')}
                className="touch-target shrink-0 rounded-full border border-gray-200 p-2 text-gray-700 transition hover:border-gold hover:bg-gray-50 hover:text-primary"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="relative h-[min(68dvh,calc(100dvh-11rem))] min-h-[220px] w-full bg-gray-50 sm:h-[min(72dvh,calc(100dvh-12rem))]">
              <GalleryImage
                src={current.src}
                fallbackSrc={current.fallbackSrc}
                alt={alt}
                fill
                className="object-contain p-2 sm:p-4"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                quality={88}
              />
              {count > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={onPrev}
                    className="touch-target absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-primary-dark/75 p-2 text-white transition hover:border-gold-light hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label={t('prev')}
                  >
                    <ChevronLeft className="h-6 w-6" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="touch-target absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-primary-dark/75 p-2 text-white transition hover:border-gold-light hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label={t('next')}
                  >
                    <ChevronRight className="h-6 w-6" aria-hidden />
                  </button>
                </>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function ProductGallery({productName, images}: ProductGalleryProps) {
  const t = useTranslations('products.gallery');
  const reduceMotion = useReducedMotion();
  const regionId = useId();
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const count = images.length;
  const current = images[index];

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + count) % count);
    },
    [count]
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  const goToLightbox = useCallback(
    (next: number) => {
      setLightboxIndex((next + count) % count);
    },
    [count]
  );

  const lightboxPrev = useCallback(() => goToLightbox(lightboxIndex - 1), [goToLightbox, lightboxIndex]);
  const lightboxNext = useCallback(() => goToLightbox(lightboxIndex + 1), [goToLightbox, lightboxIndex]);

  const openLightbox = (imageIndex: number) => {
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (lightboxOpen) {
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, lightboxOpen]);

  if (!current) {
    return null;
  }

  const caption = t(`captions.${current.captionKey}`);
  const alt = t('imageAlt', {product: productName, caption});

  return (
    <section
      className="mt-8"
      aria-labelledby={regionId}
      aria-roledescription="carousel"
    >
      <h2 id={regionId} className="sr-only">
        {t('label')}
      </h2>

      {/* Mobile / tablet: carousel */}
      <div className="lg:hidden">
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-card">
          <div className="relative aspect-[16/10] w-full bg-primary-dark/5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.src}
                className="absolute inset-0"
                initial={reduceMotion ? false : {opacity: 0}}
                animate={reduceMotion ? undefined : {opacity: 1}}
                exit={reduceMotion ? undefined : {opacity: 0}}
                transition={{duration: 0.28}}
              >
                <GalleryImage
                  src={current.src}
                  fallbackSrc={current.fallbackSrc}
                  alt={alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority={index === 0}
                  quality={index === 0 ? 82 : 75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {count > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="touch-target absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-primary-dark/70 p-2 text-white transition hover:border-gold-light hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label={t('prev')}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="touch-target absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/25 bg-primary-dark/70 p-2 text-white transition hover:border-gold-light hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label={t('next')}
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </>
            ) : null}

            <p className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-primary-dark/80 to-transparent px-4 pb-3 pt-8 text-sm text-white">
              <span className="font-medium">{caption}</span>
              <span className="ml-2 text-white/70">
                {index + 1} / {count}
              </span>
            </p>
          </div>

          {count > 1 ? (
            <div
              className="flex gap-2 overflow-x-auto border-t border-gray-100 bg-white p-3"
              role="tablist"
              aria-label={t('thumbnailsLabel')}
            >
              {images.map((image, i) => {
                const thumbCaption = t(`captions.${image.captionKey}`);
                const selected = i === index;
                return (
                  <button
                    key={image.src}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-label={t('viewImage', {n: i + 1, caption: thumbCaption})}
                    onClick={() => goTo(i)}
                    className={cn(
                      'relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                      selected
                        ? 'border-gold ring-2 ring-gold/30'
                        : 'border-transparent opacity-80 hover:border-gray-200 hover:opacity-100'
                    )}
                  >
                    <GalleryImage
                      src={image.src}
                      fallbackSrc={image.fallbackSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Desktop: equal cards in one row, full viewport width */}
      <div className="relative hidden lg:left-1/2 lg:block lg:w-screen lg:max-w-[100vw] lg:-translate-x-1/2">
        <ul className="flex w-full list-none gap-3 px-6 lg:px-8" aria-label={t('thumbnailsLabel')}>
          {images.map((image, i) => {
            const thumbCaption = t(`captions.${image.captionKey}`);
            const thumbAlt = t('imageAlt', {product: productName, caption: thumbCaption});
            return (
              <li key={image.src} className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => openLightbox(i)}
                  aria-label={t('enlargeImage', {caption: thumbCaption})}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-card transition hover:border-gold/45 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                <div className="relative aspect-[4/3] w-full bg-gray-50">
                  <GalleryImage
                    src={image.src}
                    fallbackSrc={image.fallbackSrc}
                    alt={thumbAlt}
                    fill
                    className="object-contain p-2 transition duration-300 group-hover:scale-[1.02]"
                    sizes={`${Math.round(100 / count)}vw`}
                    priority={i === 0}
                    quality={i === 0 ? 82 : 72}
                  />
                </div>
                <p className="border-t border-gray-100 px-3 py-2.5 text-xs font-medium text-gray-700 group-hover:text-primary">
                  {thumbCaption}
                </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <GalleryLightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        images={images}
        index={lightboxIndex}
        onPrev={lightboxPrev}
        onNext={lightboxNext}
        productName={productName}
      />
    </section>
  );
}
