import type {HeroHotspot} from '@/lib/hero-hotspot-types';

/** Matches exported `hero-desktop.jpg` (from 1 (29).png). */
export const HERO_DESKTOP_ASPECT = 1536 / 856;

export const heroDesktopHotspots: HeroHotspot[] = [
  {
    id: 'cta-quote',
    labelKey: 'requestQuote',
    left: 6.6,
    top: 42.2,
    width: 14.8,
    height: 6.6,
    action: {type: 'quote'},
  },
  {
    id: 'cta-products',
    labelKey: 'ourProducts',
    left: 21.8,
    top: 42.2,
    width: 13.4,
    height: 6.6,
    action: {type: 'link', href: '/products'},
  },
];
