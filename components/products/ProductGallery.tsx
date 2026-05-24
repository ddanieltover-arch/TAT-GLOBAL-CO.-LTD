'use client';

import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {useCallback, useEffect, useId, useState} from 'react';
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

export default function ProductGallery({productName, images}: ProductGalleryProps) {
  const t = useTranslations('products.gallery');
  const reduceMotion = useReducedMotion();
  const regionId = useId();
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
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
  }, [goNext, goPrev]);

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
                  className={[
                    'relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                    selected
                      ? 'border-gold ring-2 ring-gold/30'
                      : 'border-transparent opacity-80 hover:border-gray-200 hover:opacity-100',
                  ].join(' ')}
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
    </section>
  );
}
