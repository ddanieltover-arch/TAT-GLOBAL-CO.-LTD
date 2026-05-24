'use client';



import {AnimatePresence, motion} from 'framer-motion';

import {X} from 'lucide-react';

import {useTranslations} from 'next-intl';

import {useId, useRef} from 'react';

import {Link} from '@/i18n/navigation';

import Button from '@/components/ui/Button';

import {useDialogA11y} from '@/lib/a11y/use-dialog-a11y';

import {useQuoteModal} from '@/components/quote/QuoteModalContext';

import Logo from './Logo';



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

          className="fixed inset-0 z-[70] overflow-hidden text-white lg:hidden"

          initial={{opacity: 0, y: -24}}

          animate={{opacity: 1, y: 0}}

          exit={{opacity: 0, y: -24}}

          transition={{duration: 0.2}}

          role="dialog"

          aria-modal="true"

          aria-labelledby={titleId}

        >

          <div className="pointer-events-none absolute inset-0 backdrop-blur-xl" aria-hidden />

          <div

            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-dark/88 via-primary-dark/82 to-primary/78"

            aria-hidden

          />

          <div

            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(232,201,122,0.12),transparent_40%)]"

            aria-hidden

          />



          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-6 pb-10 pt-6">

            <div className="flex items-center justify-between">

              <div id={titleId}>

                <Logo variant="header" />

              </div>

              <button

                ref={closeBtnRef}

                type="button"

                onClick={onClose}

                aria-label={ta('closeMobileNav')}

                className="touch-target rounded-full border border-white/35 bg-primary-dark/70 p-2 text-white shadow-sm backdrop-blur-sm transition hover:border-gold-light hover:bg-primary-dark/90"

              >

                <X className="h-5 w-5" aria-hidden />

              </button>

            </div>



            <nav

              className="mt-8 flex flex-1 flex-col justify-start gap-2 overflow-y-auto"

              aria-label={ta('mobileNavLabel')}

            >

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

                    className="touch-target-inline block w-full rounded-lg border border-white/10 bg-primary-dark px-4 py-3 text-base font-semibold tracking-wide text-white shadow-lg transition hover:border-gold/50 hover:bg-black hover:text-gold-light"

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

              className="mt-8 shadow-lg"

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


