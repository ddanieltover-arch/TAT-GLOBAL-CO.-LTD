'use client';

import {useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductSearch from '@/components/products/ProductSearch';
import ProductFilter from '@/components/products/ProductFilter';
import PageHero from '@/components/ui/PageHero';
import ProductGrid from '@/components/products/ProductGrid';
import {catalogKeyFromSlug} from '@/lib/product-messages';
import {products, type ProductGrain, type ProductPackaging, type ProductVariety} from '@/lib/products';

export default function ProductsPageClient() {
  const [query, setQuery] = useState('');
  const [variety, setVariety] = useState<ProductVariety | 'all'>('all');
  const [grain, setGrain] = useState<ProductGrain | 'all'>('all');
  const [packaging, setPackaging] = useState<ProductPackaging | 'all'>('all');

  const tp = useTranslations('products');
  const tCat = useTranslations('products.catalog');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const ck = catalogKeyFromSlug(product.slug);
      const searchBlob = [
        tCat(`${ck}.name`),
        tCat(`${ck}.shortDescription`),
        tCat(`${ck}.grainSpec`),
      ]
        .join(' ')
        .toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 || searchBlob.includes(normalizedQuery);

      const matchesVariety = variety === 'all' || product.variety === variety;
      const matchesGrain = grain === 'all' || product.grain === grain;
      const matchesPackaging =
        packaging === 'all' || product.packagingTypes.includes(packaging);

      return matchesQuery && matchesVariety && matchesGrain && matchesPackaging;
    });
  }, [grain, packaging, query, variety, tCat]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={tp('label')} title={tp('headline')} description={tp('subheadline')}>
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-100 p-4">
            <ProductSearch value={query} onChange={setQuery} />
            <ProductFilter
              variety={variety}
              grain={grain}
              packaging={packaging}
              onVarietyChange={setVariety}
              onGrainChange={setGrain}
              onPackagingChange={setPackaging}
            />
          </div>
        </PageHero>

        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ProductGrid products={filteredProducts} />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
