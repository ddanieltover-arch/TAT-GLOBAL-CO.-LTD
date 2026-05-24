'use client';

import Image from 'next/image';
import {useTranslations} from 'next-intl';
import HeroHotspotLayer from '@/components/home/HeroHotspotLayer';
import {heroMobileHotspots, HERO_MOBILE_ASPECT} from '@/lib/hero-mobile-hotspots';
import {imageAlts, siteImages} from '@/lib/site-images';

export default function HeroMobileArt() {
  const t = useTranslations('hero');
  const th = useTranslations('hero.hotspots');

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
        </div>
      </div>

      <h1 className="sr-only">{t('headline')}</h1>
      <p className="sr-only">{t('subheadline')}</p>
    </section>
  );
}
