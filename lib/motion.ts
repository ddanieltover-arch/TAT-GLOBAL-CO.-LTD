import type {Transition, Variants} from 'framer-motion';

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 34,
};

export const viewTransition: Transition = {
  duration: 0.55,
  ease: easeOut,
};

export const fadeUp: Variants = {
  hidden: {opacity: 0, y: 32},
  visible: {opacity: 1, y: 0},
};

export const fadeIn: Variants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
};

export const scaleIn: Variants = {
  hidden: {opacity: 0, scale: 0.94},
  visible: {opacity: 1, scale: 1},
};

export const slideLeft: Variants = {
  hidden: {opacity: 0, x: -36},
  visible: {opacity: 1, x: 0},
};

export const slideRight: Variants = {
  hidden: {opacity: 0, x: 36},
  visible: {opacity: 1, x: 0},
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

export const cardHover = {
  y: -8,
  transition: {duration: 0.28, ease: easeOut},
};

export const cardTap = {scale: 0.98};

export const viewportOnce = {once: true, margin: '-60px' as const};

export const heroEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.25,
    },
  },
};

export const heroEyebrow: Variants = {
  hidden: {opacity: 0, x: -72, letterSpacing: '0.32em'},
  visible: {
    opacity: 1,
    x: 0,
    letterSpacing: '0.2em',
    transition: {duration: 0.9, ease: heroEase},
  },
};

export const heroLine: Variants = {
  hidden: {y: '108%', opacity: 0, rotateX: 12},
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {duration: 0.85, ease: heroEase},
  },
};

export const heroDramaticFade: Variants = {
  hidden: {opacity: 0, y: 56, scale: 0.88, filter: 'blur(14px)'},
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {duration: 0.95, ease: heroEase},
  },
};

export const heroCta: Variants = {
  hidden: {opacity: 0, y: 40, scale: 0.85},
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {type: 'spring', stiffness: 260, damping: 22},
  },
};

export const pageEnter: Variants = {
  initial: {opacity: 0, y: 28, filter: 'blur(8px)'},
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {duration: 0.45, ease: heroEase},
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: 'blur(6px)',
    transition: {duration: 0.32, ease: heroEase},
  },
};

/** Split headline into dramatic line-by-line reveals (— and sentence breaks). */
export function splitHeroHeadline(text: string): string[] {
  return text
    .split(/\s*—\s*/)
    .flatMap((part) => part.split(/(?<=\.)\s+/))
    .map((line) => line.trim())
    .filter(Boolean);
}
