'use client';

import {motion, useReducedMotion, type HTMLMotionProps} from 'framer-motion';
import type {ReactNode} from 'react';
import {cardHover, cardTap, fadeUp, viewTransition, viewportOnce} from '@/lib/motion';

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  index?: number;
} & Pick<HTMLMotionProps<'article'>, 'layout'>;

export default function AnimatedCard({
  children,
  className,
  delay = 0,
  index = 0,
  layout,
}: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();
  const staggerDelay = delay + index * 0.06;

  if (reduceMotion) {
    return <article className={className}>{children}</article>;
  }

  return (
    <motion.article
      className={className}
      layout={layout}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{...viewTransition, delay: staggerDelay}}
      whileHover={cardHover}
      whileTap={cardTap}
    >
      {children}
    </motion.article>
  );
}
