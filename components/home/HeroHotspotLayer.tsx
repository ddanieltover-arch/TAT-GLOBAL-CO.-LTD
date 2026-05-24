'use client';

import {Link} from '@/i18n/navigation';
import type {HeroHotspot} from '@/lib/hero-hotspot-types';
import {getWhatsAppHref} from '@/lib/whatsapp';
import {getWhatsAppPhoneRaw} from '@/lib/env';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';
import {cn} from '@/lib/cn';

const hotspotFocus =
  'rounded-md outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark';

type HeroHotspotLayerProps = {
  hotspots: HeroHotspot[];
  label: (key: string) => string;
};

export default function HeroHotspotLayer({hotspots, label}: HeroHotspotLayerProps) {
  const {openQuoteModal} = useQuoteModal();
  const whatsappHref = getWhatsAppHref();
  const telHref = `tel:${getWhatsAppPhoneRaw().replace(/\s/g, '')}`;

  return (
    <>
      {hotspots.map((spot) => {
        const ariaLabel = label(spot.labelKey);
        const style = {
          left: `${spot.left}%`,
          top: `${spot.top}%`,
          width: `${spot.width}%`,
          height: `${spot.height}%`,
        };

        const className = cn(
          'absolute z-10 cursor-pointer bg-transparent transition',
          'hover:bg-white/10 active:bg-white/15',
          hotspotFocus
        );

        if (spot.action.type === 'quote') {
          return (
            <button
              key={spot.id}
              type="button"
              className={className}
              style={style}
              aria-label={ariaLabel}
              onClick={() => openQuoteModal()}
            />
          );
        }

        if (spot.action.type === 'whatsapp') {
          if (!whatsappHref) return null;
          return (
            <a
              key={spot.id}
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              style={style}
              aria-label={ariaLabel}
            />
          );
        }

        if (spot.action.type === 'tel') {
          return (
            <a key={spot.id} href={telHref} className={className} style={style} aria-label={ariaLabel} />
          );
        }

        if (spot.action.type === 'external') {
          return (
            <a
              key={spot.id}
              href={spot.action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              style={style}
              aria-label={ariaLabel}
            />
          );
        }

        return (
          <Link
            key={spot.id}
            href={spot.action.href}
            className={className}
            style={style}
            aria-label={ariaLabel}
          />
        );
      })}
    </>
  );
}
