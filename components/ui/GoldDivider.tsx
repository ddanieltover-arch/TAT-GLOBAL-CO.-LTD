'use client';

import {motion, useReducedMotion} from 'framer-motion';

type GoldDividerProps = {
  className?: string;
};

export default function GoldDivider({className = ''}: GoldDividerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={`mt-6 h-px w-16 bg-gold/60 ${className}`} aria-hidden />;
  }

  return (
    <motion.div
      className={`mt-6 h-px origin-left bg-gold/60 ${className}`}
      initial={{scaleX: 0, opacity: 0}}
      whileInView={{scaleX: 1, opacity: 1}}
      viewport={{once: true, margin: '-40px'}}
      transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
      aria-hidden
    />
  );
}
