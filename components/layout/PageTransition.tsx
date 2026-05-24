'use client';

import {motion, useReducedMotion} from 'framer-motion';
import {useEffect} from 'react';
import {usePathname} from '@/i18n/navigation';

type PageTransitionProps = {
  children: React.ReactNode;
};

export default function PageTransition({children}: PageTransitionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({top: 0, behavior: 'auto'});
  }, [pathname]);

  if (reduceMotion) {
    return <>{children}</>;
  }

  // App Router client navigations can stall with AnimatePresence mode="wait" + opacity:0
  // initial states — content stays invisible until a full reload.
  return (
    <motion.div
      key={pathname}
      initial={{opacity: 0, y: 16}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.32, ease: [0.22, 1, 0.36, 1]}}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
