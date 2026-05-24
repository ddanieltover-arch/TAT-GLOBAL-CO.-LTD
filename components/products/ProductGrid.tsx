'use client';

import {motion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import ProductCard from './ProductCard';
import type {Product} from '@/lib/products';

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({products}: ProductGridProps) {
  const t = useTranslations('products');

  if (products.length === 0) {
    return (
      <motion.div
        initial={false}
        animate={{opacity: 1, y: 0}}
        className="rounded-lg border border-dashed border-gray-400 bg-white px-5 py-12 text-center text-gray-700"
      >
        {t('noResults')}
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.slug} product={product} index={index} />
      ))}
    </div>
  );
}
