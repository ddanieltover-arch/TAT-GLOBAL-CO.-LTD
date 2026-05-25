/**
 * Brand imagery served from `public/images/` or Supabase Storage when configured.
 * Product photos: {slug}.webp — local public/images/products/ or Supabase bucket (see docs/SUPABASE-STORAGE.md)
 */
import {productImageSlugs} from '@/lib/product-image-manifest';
import {getSupabaseProductImageUrl, getSupabasePublicUrl, isSupabaseStorageConfigured} from '@/lib/supabase-storage';

const img = (path: string) => `/images/${path}`;

export const siteImages = {
  hero: img('hero.jpg'),
  /** Homepage hero — interactive dashboard art (desktop, ≥768px). */
  heroDesktop: img('hero-desktop.jpg'),
  /** Homepage hero — portrait art direction for viewports ≤767px (`md`). */
  heroMobile: img('hero-mobile.jpg'),
  about: img('about.jpg'),
  aboutFacility: img('about-facility.png'),
  facility: img('facility.jpg'),
  aboutBanner: img('about-banner.jpg'),
  qualityBanner: img('quality-banner.jpg'),
  contactBanner: img('contact-banner.jpg'),
  packagingBanner: img('packaging-banner.jpg'),
  marketsBanner: img('markets-banner.jpg'),
  qualityControlBanner: img('quality-control-banner.png'),
  orderingProcedureBanner: img('ordering-procedure-banner.png'),
  sustainabilityBanner: img('sustainability-banner.png'),
  testimonialsBanner: img('testimonials-banner.png'),
  faqBanner: img('faq-banner.jpg'),
  privacyBanner: img('privacy-banner.jpg'),
  whyUsQuality: img('why-us-quality.jpg'),
  homeCertifications: img('home-certifications.jpg'),
  productDefault: img('product-default.jpg'),
  gallery: {
    grainsCloseup: img('gallery/grains-closeup.jpg'),
    packagingBags: img('gallery/packaging-bags.jpg'),
    exportReady: img('gallery/export-ready.jpg'),
  },
  categoryImages: {
    jasmine: img('products/jasmine-rice.jpg'),
    white: img('products/white-rice.jpg'),
    longGrain: img('products/long-grain-rice.jpg'),
    broken: img('products/broken-rice.jpg'),
    glutinous: img('products/glutinous-rice.jpg'),
    parboiled: img('products/parboiled-rice.jpg'),
    specialty: img('product-default.jpg'),
  },
} as const;

export type ProductGalleryCaptionKey =
  | 'product'
  | 'grains'
  | 'facility'
  | 'origin'
  | 'packaging';

export type ProductGalleryImage = {
  src: string;
  captionKey: ProductGalleryCaptionKey;
  fallbackSrc?: string;
};

export const imageAlts = {
  hero: 'Thai rice supply chain from farm fields through mill to global export port',
  heroMobile:
    'TAT Global mobile homepage — premium Thai rice export, quote request, WhatsApp, and product selection',
  heroDesktop:
    'TAT Global export logistics — connecting Thai rice to the world with port operations, shipment tracking, and global destinations',
  about: 'Thai rice farmers working in green rice fields',
  aboutFacility: 'Aerial view of TAT Global rice manufacturing and export facility at sunset',
  facility: 'Rice processing and export facility',
  aboutBanner:
    'TAT Global about banner — Premium Thai rice manufacturer and global bulk supplier with quality, global supply, and export expertise',
  qualityBanner:
    'TAT Global quality assurance — Warehouse quality control, certified Thai rice bags, and export-ready inventory',
  contactBanner:
    'TAT Global contact banner — Get in touch for Thai rice exports with email, phone, and website details',
  packagingBanner:
    'TAT Global packaging and processing line with branded export rice bags in a modern facility',
  marketsBanner:
    'TAT Global export markets map connecting Thailand to major rice import regions worldwide',
  qualityControlBanner:
    'TAT Global rice export quality control with Thai rice bags, laboratory inspection, secure warehouse, and global shipping',
  orderingProcedureBanner:
    'TAT Global rice export logistics banner with warehouse, container port, and global shipping map',
  sustainabilityBanner:
    'TAT Global premium Thai rice range with natural rice, quality assurance, and sustainable farming practices',
  testimonialsBanner:
    'TAT Global trusted partner banner for premium Thai rice delivery, global reach, and reliable supply',
  faqBanner:
    'TAT Global wholesale inquiry and quote banner with export logistics, rice products, and contact details',
  privacyBanner:
    'Aerial view of TAT Global manufacturing and logistics facility in Thailand',
  whyUsQuality:
    'TAT Global international export quality standards, laboratory inspection, certifications, and premium Thai rice',
  homeCertifications:
    'TAT Global food safety and quality assurance laboratory with ISO, HACCP, GMP, Halal, and export compliance certifications',
  product: 'Premium Thai rice grains',
} as const;

const FIVE_IMAGE_GALLERY_SLUGS = new Set([
  'jasmine-rice-thai-hom-mali',
  'thai-white-rice-100-sortexed',
  'white-rice-5-broken',
]);

function productAsset(filename: string): string {
  if (isSupabaseStorageConfigured()) {
    const remote = getSupabasePublicUrl(filename);
    if (remote) {
      return remote;
    }
  }
  return img(`products/${filename}`);
}

const PRODUCT_GALLERY_PACKAGING_OVERRIDE: Record<string, string> = {
  'thai-parboiled-rice': productAsset('thai-parboiled-rice-gallery.webp'),
};

const PRODUCT_IMAGE_OVERRIDE_BY_SLUG: Record<string, string> = {
  '1121-sella-basmati-rice': productAsset('1121-sella-basmati-rice.png'),
  'arborio-rice': productAsset('arborio-rice.png'),
  'japonica-rice': productAsset('japonica-rice.png'),
  'thai-parboiled-rice': productAsset('thai-parboiled-rice.png'),
};

function productWebp(slug: string): string {
  if (isSupabaseStorageConfigured()) {
    const remote = getSupabaseProductImageUrl(slug);
    if (remote) {
      return remote;
    }
  }
  return img(`products/${slug}.webp`);
}

function categoryImageForSlug(slug: string): string {
  if (slug.includes('jasmine') || slug.includes('hom-patum') || slug.includes('patum')) {
    return siteImages.categoryImages.jasmine;
  }
  if (slug.includes('glutinous') || slug.includes('japonica') || slug.includes('arborio')) {
    if (slug.includes('glutinous')) return siteImages.categoryImages.glutinous;
    return siteImages.categoryImages.specialty;
  }
  if (slug.includes('parboiled')) return siteImages.categoryImages.parboiled;
  if (slug.includes('broken') || slug.includes('100-broken')) {
    return siteImages.categoryImages.broken;
  }
  if (
    slug.includes('irri') ||
    slug.includes('long-grain') ||
    slug.includes('basmati') ||
    slug.includes('sortexed')
  ) {
    return siteImages.categoryImages.longGrain;
  }
  if (
    slug.includes('brown') ||
    slug.includes('cargo') ||
    slug.includes('riceberry') ||
    slug.includes('basmati') ||
    slug.includes('arborio')
  ) {
    return siteImages.categoryImages.specialty;
  }
  if (slug.includes('white') || slug.includes('5-broken')) {
    return siteImages.categoryImages.white;
  }
  return siteImages.productDefault;
}

/** Dedicated WebP if imported; otherwise category placeholder until you upload. */
export function getProductImage(slug: string): string {
  const override = PRODUCT_IMAGE_OVERRIDE_BY_SLUG[slug];
  if (override) {
    return override;
  }

  if (productImageSlugs.has(slug)) {
    return productWebp(slug);
  }
  return categoryImageForSlug(slug);
}

/** Generic fallback when a product image URL fails to load. */
export function getProductImageFallback(): string {
  return siteImages.productDefault;
}

/**
 * Hero gallery for product detail (3–5 images).
 * Slot 1: product-specific; slots 2–5: shared process/packaging shots.
 */
export function getProductGallery(slug: string): ProductGalleryImage[] {
  const primary = getProductImage(slug);
  const images: ProductGalleryImage[] = [
    {src: primary, fallbackSrc: siteImages.productDefault, captionKey: 'product'},
    {src: siteImages.gallery.packagingBags, fallbackSrc: siteImages.productDefault, captionKey: 'packaging'},
    {src: siteImages.facility, fallbackSrc: siteImages.productDefault, captionKey: 'facility'},
    {src: siteImages.about, fallbackSrc: siteImages.productDefault, captionKey: 'origin'},
  ];

  if (FIVE_IMAGE_GALLERY_SLUGS.has(slug)) {
    images.push({
      src: PRODUCT_GALLERY_PACKAGING_OVERRIDE[slug] ?? siteImages.gallery.grainsCloseup,
      fallbackSrc: siteImages.productDefault,
      captionKey: 'grains',
    });
  }

  return images;
}
