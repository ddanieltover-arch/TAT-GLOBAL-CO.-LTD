/**
 * Brand imagery served from `public/images/`.
 * Product photos: public/images/products/{slug}.webp (import via scripts/import-product-image.mjs)
 */
import {productImageSlugs} from '@/lib/product-image-manifest';

const img = (path: string) => `/images/${path}`;

export const siteImages = {
  hero: img('hero.jpg'),
  about: img('about.jpg'),
  facility: img('facility.jpg'),
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
  hero: 'Golden rice paddies in Thailand at sunrise',
  about: 'Thai rice farmers working in green rice fields',
  facility: 'Rice processing and export facility',
  product: 'Premium Thai rice grains',
} as const;

const FIVE_IMAGE_GALLERY_SLUGS = new Set([
  'jasmine-rice-thai-hom-mali',
  'thai-parboiled-rice',
  'thai-white-rice-100-sortexed',
  'white-rice-5-broken',
]);

const PRODUCT_GALLERY_PACKAGING_OVERRIDE: Record<string, string> = {
  'thai-parboiled-rice': img('products/thai-parboiled-rice-gallery.webp'),
};

function productWebp(slug: string): string {
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
    {src: siteImages.gallery.grainsCloseup, fallbackSrc: siteImages.productDefault, captionKey: 'grains'},
    {src: siteImages.facility, fallbackSrc: siteImages.productDefault, captionKey: 'facility'},
    {src: siteImages.about, fallbackSrc: siteImages.productDefault, captionKey: 'origin'},
  ];

  if (FIVE_IMAGE_GALLERY_SLUGS.has(slug)) {
    images.push({
      src: PRODUCT_GALLERY_PACKAGING_OVERRIDE[slug] ?? siteImages.gallery.packagingBags,
      fallbackSrc: siteImages.productDefault,
      captionKey: 'packaging',
    });
  }

  return images;
}
