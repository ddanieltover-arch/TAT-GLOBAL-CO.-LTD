'use client';

import Image from 'next/image';
import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import HeroHotspotLayer from '@/components/home/HeroHotspotLayer';
import MobileNav from '@/components/layout/MobileNav';
import {heroMobileHotspots, HERO_MOBILE_ASPECT} from '@/lib/hero-mobile-hotspots';
import {headerNav} from '@/lib/site-navigation';
import {imageAlts, siteImages} from '@/lib/site-images';

export default function HeroMobileArt() {
  const t = useTranslations('hero');
  const th = useTranslations('hero.hotspots');
  const tn = useTranslations('nav');
  const ta = useTranslations('a11y');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navItems = useMemo(
    () => headerNav.map((item) => ({href: item.href, label: tn(item.labelKey)})),
    [tn]
  );

  return (
    <section className="relative w-full md:hidden">
      <div className="relative w-full" style={{aspectRatio: String(HERO_MOBILE_ASPECT)}}>
        <Image
          src={siteImages.heroMobile}
          alt={imageAlts.heroMobile}
          fill
          priority
          fetchPriority="high"
          quality={86}
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0">
          <HeroHotspotLayer hotspots={heroMobileHotspots} label={(key) => th(key)} />
          <button
            type="button"
            aria-label={ta('openMobileNav')}
            onClick={() => setIsMobileNavOpen(true)}
            className="absolute right-[4%] top-[1.8%] z-20 block h-[6.2%] w-[16%] rounded-xl bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          />
        </div>
      </div>

      <h1 className="sr-only">{t('headline')}</h1>
      <p className="sr-only">{t('subheadline')}</p>
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={navItems}
      />
    </section>
  );
}
