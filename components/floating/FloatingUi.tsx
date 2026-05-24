'use client';

import CookieConsent from './CookieConsent';
import StickyQuoteCTA from './StickyQuoteCTA';
import WhatsAppButton from './WhatsAppButton';

/**
 * Site-wide persistent actions: WhatsApp, scroll-triggered quote bar, cookie notice.
 * Stacked bottom: sticky CTA above cookie strip so both stay reachable on mobile.
 */
export default function FloatingUi() {
  return (
    <>
      <WhatsAppButton />
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-[56] flex flex-col overflow-hidden">
        <div className="pointer-events-auto">
          <StickyQuoteCTA />
        </div>
        <div className="pointer-events-auto">
          <CookieConsent />
        </div>
      </div>
    </>
  );
}
