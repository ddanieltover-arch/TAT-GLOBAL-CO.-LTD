'use client';

import {Search} from 'lucide-react';
import {useTranslations} from 'next-intl';

type ProductSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ProductSearch({value, onChange}: ProductSearchProps) {
  const t = useTranslations('products');

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full rounded-md border border-gray-100 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-gold"
      />
    </div>
  );
}
