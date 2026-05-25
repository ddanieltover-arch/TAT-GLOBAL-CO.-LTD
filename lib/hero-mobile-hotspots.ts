import type {HeroHotspot} from '@/lib/hero-hotspot-types';

/** Matches exported `hero-mobile.jpg` (from 1 (33).png). */
export const HERO_MOBILE_ASPECT = 864 / 1821;

export const heroMobileHotspots: HeroHotspot[] = [
  {
    id: 'cta-quote',
    labelKey: 'requestQuote',
    left: 4.8,
    top: 33.3,
    width: 43.5,
    height: 4.5,
    action: {type: 'quote'},
  },
  {
    id: 'cta-whatsapp',
    labelKey: 'chatWhatsApp',
    left: 4.8,
    top: 38.6,
    width: 34.8,
    height: 4.4,
    action: {type: 'whatsapp'},
  },
  {
    id: 'bar-whatsapp',
    labelKey: 'barWhatsApp',
    left: 69,
    top: 95.6,
    width: 28,
    height: 3.9,
    action: {type: 'whatsapp'},
  },
];
