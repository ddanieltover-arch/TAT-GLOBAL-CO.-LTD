'use client';

import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useId, useRef} from 'react';
import {Link} from '@/i18n/navigation';
import Button from '@/components/ui/Button';
import {useDialogA11y} from '@/lib/a11y/use-dialog-a11y';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';

type NavItem = {
  label: string;
  href: string;
};

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

export default function MobileNav({isOpen, onClose, navItems}: MobileNavProps) {
  const {openQuoteModal} = useQuoteModal();
  const tBrand = useTranslations('common');
  const tc = useTranslations('cta');
  const ta = useTranslations('a11y');
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useDialogA11y({
    isOpen,
    onClose,
    initialFocusRef: closeBtnRef,
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={panelRef}
          className="fixed inset-0 z-[70] bg-primary-dark/95 text-white backdrop-blur-md lg:hidden"
          initial={{opacity: 0, y: -24}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -24}}
          transition={{duration: 0.2}}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="mx-auto flex h-full max-w-7xl flex-col px-6 pb-10 pt-6">
            <div className="flex items-center justify-between">
              <p id={titleId} className="font-display text-lg text-gold-light">
                {tBrand('brand')}
              </p>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label={ta('closeMobileNav')}
                className="touch-target rounded-full border border-white/30 p-2 text-white transition hover:bg-white/10"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <nav className="mt-10 flex flex-1 flex-col justify-start gap-1" aria-label={ta('mobileNavLabel')}>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{opacity: 0, x: -16}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.3, delay: 0.05 + index * 0.04}}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="touch-target-inline block w-full border-b border-white/15 pb-3 font-medium tracking-wide text-white/90 transition hover:text-gold-light"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <Button
              type="button"
              size="md"
              fullWidth
              className="mt-8"
              onClick={() => {
                openQuoteModal();
                onClose();
              }}
            >
              {tc('requestQuote')}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
