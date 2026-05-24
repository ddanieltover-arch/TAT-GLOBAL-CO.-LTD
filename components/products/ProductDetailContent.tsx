'use client';

import {useMemo} from 'react';
import {useMessages, useTranslations} from 'next-intl';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';
import Button from '@/components/ui/Button';
import PageHero from '@/components/ui/PageHero';
import ProductGallery from '@/components/products/ProductGallery';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProductGrid from '@/components/products/ProductGrid';
import {motion} from 'framer-motion';
import {getProductGallery} from '@/lib/site-images';
import type {Product} from '@/lib/products';
import {
  catalogKeyFromSlug,
  readCatalogEntry,
  type CatalogEntryMessages,
  type CatalogSpecRow,
} from '@/lib/product-messages';

type ProductDetailContentProps = {
  product: Product;
  allProducts: Product[];
};

export default function ProductDetailContent({product, allProducts}: ProductDetailContentProps) {
  const messages = useMessages();
  const slugKey = catalogKeyFromSlug(product.slug);
  const tp = useTranslations(`products.catalog.${slugKey}`);
  const tQuote = useTranslations('quote');
  const tCta = useTranslations('cta');

  const entry = readCatalogEntry(
    messages.products?.catalog as Record<string, CatalogEntryMessages> | undefined,
    product.slug
  );

  const {openQuoteModal} = useQuoteModal();

  const relatedProducts = useMemo(
    () => allProducts.filter((item) => item.slug !== product.slug).slice(0, 3),
    [allProducts, product.slug]
  );

  const specs: CatalogSpecRow[] =
    entry?.technicalSpecifications ??
    product.technicalSpecifications.map((spec) => ({
      attribute: spec.attribute,
      value: spec.value,
    }));

  const galleryImages = getProductGallery(product.slug);

  const shippingText = entry?.shipping ?? product.shipping;
  const storageText = entry?.storage ?? product.storage;

  return (
    <div className="min-h-screen bg-cream">
      <PageHero label={tQuote('detailLabel')} title={tp('name')} description={tp('shortDescription')}>
        <ProductGallery productName={tp('name')} images={galleryImages} />
      </PageHero>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <div className="space-y-8">
            <ScrollReveal as="article" className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{tQuote('fullDescription')}</h2>
              <p className="mt-4 leading-relaxed text-gray-700">{tp('fullDescription')}</p>
            </ScrollReveal>

            <ScrollReveal as="article" className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{tQuote('technicalSpecs')}</h2>
              <div className="mt-5 overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-100 text-left text-gray-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">{tQuote('attrColumn')}</th>
                      <th className="px-4 py-3 font-medium">{tQuote('valueColumn')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specs.map((spec) => (
                      <tr key={spec.attribute} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-700">{spec.attribute}</td>
                        <td className="px-4 py-3 text-gray-900">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>

            <ScrollReveal as="article" className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{tQuote('packagingMmq')}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.packaging.map((pack) => (
                  <span
                    key={pack}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                  >
                    {pack}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-gray-700">{tQuote('moqLine', {moq: tp('moq')})}</p>
            </ScrollReveal>

            <ScrollReveal as="article" className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
              <h2 className="font-display text-3xl text-gray-900">{tQuote('shippingStorage')}</h2>
              <p className="mt-4 text-gray-700">
                {tQuote('shippingLabel')}:{' '}
                {shippingText ?? tQuote('shippingFallback')}
              </p>
              <p className="mt-2 text-gray-700">
                {tQuote('storageLabel')}: {storageText ?? tQuote('storageFallback')}
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal
            as="aside"
            direction="right"
            className="h-fit rounded-xl border border-gold/30 bg-primary-dark p-5 text-white shadow-card lg:sticky lg:top-28"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-light">
              {tQuote('exportSales')}
            </p>
            <h3 className="mt-3 font-display text-3xl">{tQuote('sidebarTitle')}</h3>
            <p className="mt-3 text-sm text-white/85">{tQuote('sidebarBody')}</p>
            <motion.div
              className="mt-5 block"
              whileHover={{scale: 1.03, y: -2}}
              whileTap={{scale: 0.97}}
            >
              <Button
                type="button"
                size="md"
                fullWidth
                onClick={() => openQuoteModal(product.slug)}
              >
                {tCta('requestQuoteCard')}
              </Button>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      <ScrollReveal as="section" className="border-t border-gold/25 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="font-display text-4xl text-gray-900">{tQuote('relatedTitle')}</h2>
          <div className="mt-8">
            <ProductGrid products={relatedProducts} />
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
