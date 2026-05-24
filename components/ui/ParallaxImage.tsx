'use client';

import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import Image from 'next/image';
import {useEffect, useRef, useState, type ReactNode} from 'react';

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

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {reduceMotion ? (
        <Image
          src={activeSrc}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
          fetchPriority={priority ? 'high' : undefined}
          quality={quality}
          onError={handleError}
        />
      ) : (
        <motion.div
          className="absolute inset-x-0 -top-[18%] h-[136%] w-full will-change-transform"
          style={{y}}
        >
          <Image
            src={activeSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes={sizes}
            priority={priority}
            fetchPriority={priority ? 'high' : undefined}
            quality={quality}
            onError={handleError}
          />
        </motion.div>
      )}
      {overlay}
    </div>
  );
}
