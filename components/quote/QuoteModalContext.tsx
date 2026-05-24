"use client";

import dynamic from "next/dynamic";
import {createContext, useCallback, useContext, useMemo, useState, type ReactNode} from "react";

const QuoteModal = dynamic(() => import("./QuoteModal"), {ssr: false});

type QuoteModalContextValue = {
  isOpen: boolean;
  prefilledProductSlug?: string;
  openQuoteModal: (productSlug?: string) => void;
  closeQuoteModal: () => void;
};

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null);

export function QuoteModalProvider({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledProductSlug, setPrefilledProductSlug] = useState<string | undefined>();

  const openQuoteModal = useCallback((productSlug?: string) => {
    setPrefilledProductSlug(productSlug);
    setIsOpen(true);
  }, []);

  const closeQuoteModal = useCallback(() => {
    setIsOpen(false);
    setPrefilledProductSlug(undefined);
  }, []);

  const value = useMemo(
    () => ({isOpen, prefilledProductSlug, openQuoteModal, closeQuoteModal}),
    [isOpen, prefilledProductSlug, openQuoteModal, closeQuoteModal]
  );

  return (
    <QuoteModalContext.Provider value={value}>
      {children}
      <QuoteModal />
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  const context = useContext(QuoteModalContext);
  if (!context) {
    throw new Error("useQuoteModal must be used within QuoteModalProvider");
  }
  return context;
}
