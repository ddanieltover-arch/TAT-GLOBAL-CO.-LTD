'use client';

import {useTranslations} from 'next-intl';
import {
  grainFilters,
  packagingFilters,
  varietyFilters,
  type ProductGrain,
  type ProductPackaging,
  type ProductVariety,
} from '@/lib/products';

const varietyTKey: Record<
  ProductVariety,
  | 'jasmine'
  | 'white'
  | 'longGrain'
  | 'broken'
  | 'glutinous'
  | 'parboiled'
  | 'specialty'
> = {
  jasmine: 'jasmine',
  white: 'white',
  'long-grain': 'longGrain',
  broken: 'broken',
  glutinous: 'glutinous',
  parboiled: 'parboiled',
  specialty: 'specialty',
};

const grainTKey: Record<ProductGrain, 'grainLong' | 'grainShort' | 'grainBroken' | 'grainMixed'> = {
  long: 'grainLong',
  'short-medium': 'grainShort',
  broken: 'grainBroken',
  mixed: 'grainMixed',
};

const packagingTKey: Record<
  ProductPackaging,
  'packRetail' | 'pack25' | 'pack50' | 'packJumbo' | 'packBulk' | 'packPrivate'
> = {
  retail: 'packRetail',
  '25kg': 'pack25',
  '50kg': 'pack50',
  jumbo: 'packJumbo',
  bulk: 'packBulk',
  'private-label': 'packPrivate',
};

type ProductFilterProps = {
  variety: ProductVariety | 'all';
  grain: ProductGrain | 'all';
  packaging: ProductPackaging | 'all';
  onVarietyChange: (value: ProductVariety | 'all') => void;
  onGrainChange: (value: ProductGrain | 'all') => void;
  onPackagingChange: (value: ProductPackaging | 'all') => void;
};

export default function ProductFilter({
  variety,
  grain,
  packaging,
  onVarietyChange,
  onGrainChange,
  onPackagingChange,
}: ProductFilterProps) {
  const t = useTranslations('filters');
  const tp = useTranslations('products');

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <select
        value={variety}
        onChange={(event) => onVarietyChange(event.target.value as ProductVariety | 'all')}
        className="rounded-md border border-gray-100 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gold"
      >
        <option value="all">{tp('filterVarietyAll')}</option>
        {varietyFilters.map((option) => (
          <option key={option.value} value={option.value}>
            {t(varietyTKey[option.value])}
          </option>
        ))}
      </select>

      <select
        value={grain}
        onChange={(event) => onGrainChange(event.target.value as ProductGrain | 'all')}
        className="rounded-md border border-gray-100 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gold"
      >
        <option value="all">{tp('filterGrainAll')}</option>
        {grainFilters.map((option) => (
          <option key={option.value} value={option.value}>
            {t(grainTKey[option.value])}
          </option>
        ))}
      </select>

      <select
        value={packaging}
        onChange={(event) =>
          onPackagingChange(event.target.value as ProductPackaging | 'all')
        }
        className="rounded-md border border-gray-100 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gold"
      >
        <option value="all">{tp('filterPackagingAll')}</option>
        {packagingFilters.map((option) => (
          <option key={option.value} value={option.value}>
            {t(packagingTKey[option.value])}
          </option>
        ))}
      </select>
    </div>
  );
}
