'use client';

import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {useEffect} from 'react';
import {usePathname} from '@/i18n/navigation';
import {pageEnter} from '@/lib/motion';

type PageTransitionProps = {
  children: React.ReactNode;
};

export default function PageTransition({children}: PageTransitionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'auto'});
  }, [pathname, reduceMotion]);

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageEnter}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
