'use client';

import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useId, useRef} from 'react';
import {useDialogA11y} from '@/lib/a11y/use-dialog-a11y';
import QuoteForm from './QuoteForm';
import {useQuoteModal} from './QuoteModalContext';

export default function QuoteModal() {
  const {isOpen, closeQuoteModal} = useQuoteModal();
  const t = useTranslations('quote');
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useDialogA11y({
    isOpen,
    onClose: closeQuoteModal,
    initialFocusRef: closeBtnRef,
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-primary-dark/65 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          aria-modal="true"
          role="dialog"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label={t('closeBackdropAria')}
            onClick={closeQuoteModal}
          />
          <motion.div
            ref={panelRef}
            className="relative z-10 flex h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:rounded-2xl"
            initial={{y: 40, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{y: 24, opacity: 0}}
            transition={{duration: 0.22}}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 id={titleId} className="font-display text-2xl text-primary-dark">
                  {t('modalTitle')}
                </h2>
                <p className="mt-1 text-sm text-gray-700">{t('modalSubtitle')}</p>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeQuoteModal}
                className="touch-target rounded-full border border-gray-100 p-2 text-gray-700 transition hover:border-gold hover:text-primary"
                aria-label={t('closeButtonAria')}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="max-h-[calc(95vh-84px)] overflow-y-auto sm:max-h-[calc(90vh-84px)]">
              <QuoteForm />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
