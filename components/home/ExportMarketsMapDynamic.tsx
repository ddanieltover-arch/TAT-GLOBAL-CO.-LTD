'use client';

import dynamic from 'next/dynamic';
import {useTranslations} from 'next-intl';
import {ClientErrorBoundary} from '@/components/ClientErrorBoundary';

function MapSkeleton() {
  const t = useTranslations('markets');
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={t('mapLoading')}
      className="aspect-[5/3] w-full max-w-full animate-pulse rounded-xl border border-gray-100 bg-gray-100"
    />
  );
}

function MapFallbackNote() {
  const t = useTranslations('markets');
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-100 px-4 py-6 text-center text-sm text-gray-700">
      {t('mapCaption')}
    </div>
  );
}

const ExportMarketsMap = dynamic(() => import('./ExportMarketsMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default function ExportMarketsMapDynamic() {
  return (
    <ClientErrorBoundary fallback={<MapFallbackNote />}>
      <ExportMarketsMap />
    </ClientErrorBoundary>
  );
}
