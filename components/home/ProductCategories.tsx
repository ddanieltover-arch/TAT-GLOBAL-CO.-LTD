'use client';

import {useMessages, useTranslations} from 'next-intl';
import Button from '@/components/ui/Button';
import {featuredProductSlugs, products} from '@/lib/products';
import {catalogKeyFromSlug} from '@/lib/product-messages';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';
import AnimatedCard from '@/components/ui/AnimatedCard';
import ParallaxImage from '@/components/ui/ParallaxImage';
import SectionHeader from '@/components/ui/SectionHeader';
import {getProductImage, imageAlts} from '@/lib/site-images';

function ProductCategoryCard({
  product,
  index,
}: {
  product: (typeof products)[number];
  index: number;
}) {
  const {openQuoteModal} = useQuoteModal();
  const messages = useMessages();
  const slugKey = catalogKeyFromSlug(product.slug);
  const row = messages.products?.catalog?.[slugKey] as {badge?: string} | undefined;
  const tp = useTranslations(`products.catalog.${slugKey}`);
  const tc = useTranslations('cta');

  return (
    <AnimatedCard
      index={index}
      className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card"
    >
      <ParallaxImage
        src={getProductImage(product.slug)}
        alt={`${tp('name')} — ${imageAlts.product}`}
        className="h-44 w-full"
        speed={0.22}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        overlay={
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/55 via-primary/10 to-transparent" />
        }
      />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-primary-dark px-3 py-1 text-xs font-medium text-gold-light">
            {tp('availability')}
          </span>
          {row?.badge ? <span className="text-xs text-gray-700">{row.badge}</span> : null}
        </div>
        <h3 className="mt-4 font-display text-2xl text-gray-900">{tp('name')}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{tp('shortDescription')}</p>
        <p className="mt-4 text-xs text-gray-600">{tp('grainSpec')}</p>
        <p className="mt-1 text-xs text-gray-600">{tp('moistureSpec')}</p>
        <p className="mt-1 text-xs text-gray-600">{tp('brokenSpec')}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.packaging.map((pack) => (
            <span key={pack} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
              {pack}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button href={`/products/${product.slug}`} variant="outline-primary" size="sm">
            {tc('viewSpecs')}
          </Button>
          <Button type="button" size="sm" onClick={() => openQuoteModal(product.slug)}>
            {tc('requestQuoteCard')}
          </Button>
        </div>
      </div>
    </AnimatedCard>
  );
}

export default function ProductCategories() {
  const t = useTranslations('products');
  const tc = useTranslations('cta');
  const featuredProducts = products.filter((product) =>
    featuredProductSlugs.includes(product.slug),
  );

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={t('label')} headline={t('headline')} subheadline={t('subheadline')} />

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product, index) => (
            <ProductCategoryCard key={product.slug} product={product} index={index} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href="/products" variant="outline-primary">
            {tc('exploreProducts')}
          </Button>
        </div>
      </div>
    </section>
  );
}
