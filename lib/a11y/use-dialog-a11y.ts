'use client';

import {useEffect, useRef, type RefObject} from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type UseDialogA11yOptions = {
  isOpen: boolean;
  onClose: () => void;
  /** Element to receive focus when the dialog opens (defaults to first focusable inside container). */
  initialFocusRef?: RefObject<HTMLElement | null>;
};

/**
 * Focus trap, Escape to close, body scroll lock, and restore focus on close.
 */
export function useDialogA11y({isOpen, onClose, initialFocusRef}: UseDialogA11yOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusInitial = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }
      const root = containerRef.current;
      if (!root) return;
      const first = root.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    };

    const timer = window.setTimeout(focusInitial, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const root = containerRef.current;
      if (!root) return;

      const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
      );

      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose, initialFocusRef]);

  return containerRef;
}
