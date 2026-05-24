'use client';

import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import Image from 'next/image';
import {useEffect, useRef, useState, type ReactNode} from 'react';
import {cn} from '@/lib/cn';

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** Scroll parallax intensity — higher moves more (typical 0.15–0.5). */
  speed?: number;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  overlay?: ReactNode;
  /** Used when `src` is missing or fails to load (e.g. product photo not uploaded yet). */
  fallbackSrc?: string;
  /** `contain` fits the full image inside the frame (best for product pack shots). */
  objectFit?: 'cover' | 'contain';
  /** Extra classes on the underlying `Image` (e.g. product padding/scale). */
  imageClassName?: string;
};

export default function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 0.3,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = priority ? 82 : 75,
  overlay,
  fallbackSrc,
  objectFit = 'cover',
  imageClassName,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    setActiveSrc(src);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && activeSrc !== fallbackSrc) {
      setActiveSrc(fallbackSrc);
    }
  };

  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const travel = Math.round(speed * 140);
  const y = useTransform(scrollYProgress, [0, 1], [`-${travel}px`, `${travel}px`]);
  const isContain = objectFit === 'contain';
  const imageClasses = cn(
    isContain ? 'object-contain' : 'object-cover',
    imageClassName
  );

  const image = (
    <Image
      src={activeSrc}
      alt={alt}
      fill
      className={imageClasses}
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      quality={quality}
      onError={handleError}
    />
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {reduceMotion || isContain || speed === 0 ? (
        image
      ) : (
        <motion.div
          className="absolute inset-x-0 -top-[18%] h-[136%] w-full will-change-transform"
          style={{y}}
        >
          {image}
        </motion.div>
      )}
      {overlay}
    </div>
  );
}
