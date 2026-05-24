'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import HeroHotspotLayer from '@/components/home/HeroHotspotLayer';
import {heroDesktopHotspots, HERO_DESKTOP_ASPECT} from '@/lib/hero-desktop-hotspots';
import {imageAlts, siteImages} from '@/lib/site-images';

export default function HeroDesktopArt() {
  const t = useTranslations('hero');
  const th = useTranslations('hero.hotspots');

  return (
    <div className="relative hidden w-full md:block">
      <div className="relative w-full" style={{aspectRatio: String(HERO_DESKTOP_ASPECT)}}>
        <Image
          src={siteImages.heroDesktop}
          alt={imageAlts.heroDesktop}
          fill
          priority
          fetchPriority="high"
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0">
          <HeroHotspotLayer hotspots={heroDesktopHotspots} label={(key) => th(key)} />
        </div>
      </div>

      <h1 className="sr-only">{t('headline')}</h1>
      <p className="sr-only">{t('subheadline')}</p>
    </div>
  );
}
