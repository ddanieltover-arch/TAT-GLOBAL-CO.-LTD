'use client';

import {motion, useReducedMotion, type HTMLMotionProps} from 'framer-motion';
import type {ReactNode} from 'react';
import {fadeUp, slideLeft, slideRight, viewTransition, viewportOnce} from '@/lib/motion';

type Direction = 'up' | 'left' | 'right' | 'none';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  as?: 'div' | 'section' | 'article' | 'aside';
} & Pick<HTMLMotionProps<'div'>, 'layout'>;

const directionVariants = {
  up: fadeUp,
  left: slideLeft,
  right: slideRight,
  none: {hidden: {opacity: 0}, visible: {opacity: 1}},
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  as = 'div',
  layout,
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];
  const variants = directionVariants[direction];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      className={className}
      layout={layout}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={{...viewTransition, delay}}
    >
      {children}
    </Component>
  );
}
