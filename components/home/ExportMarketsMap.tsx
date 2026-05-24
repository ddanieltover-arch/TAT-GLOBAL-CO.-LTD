'use client';

import {useTranslations} from 'next-intl';
import {ComposableMap, Geographies, Geography, Marker} from 'react-simple-maps';
import {EXPORT_MARKET_MARKERS} from '@/lib/export-market-markers';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const geoStyle = {
  default: {
    fill: 'var(--color-gray-100)',
    stroke: 'var(--color-gray-400)',
    strokeWidth: 0.35,
    outline: 'none',
  },
  hover: {
    fill: 'rgba(26, 74, 46, 0.1)',
    stroke: 'var(--color-gray-400)',
    strokeWidth: 0.35,
    outline: 'none',
  },
  pressed: {
    fill: 'rgba(26, 74, 46, 0.12)',
    outline: 'none',
  },
} as const;

export default function ExportMarketsMap() {
  const t = useTranslations('markets');

  return (
    <figure className="overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-card">
      <div className="w-full">
        <ComposableMap
          width={980}
          height={588}
          projection="geoMercator"
          projectionConfig={{
            scale: 138,
            center: [78, 18],
          }}
          className="rsm-export-map block h-auto w-full max-w-full text-gray-400"
        >
          {/** Markers only render after topology loads inside this callback — avoids projection/render crashes */}
          <Geographies geography={GEO_URL}>
            {({geographies}) => (
              <>
                {geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={-1}
                    className="outline-none"
                    style={geoStyle}
                  />
                ))}
                {geographies.length > 0
                  ? EXPORT_MARKET_MARKERS.map(({regionKey, coordinates}) => (
                      <Marker key={regionKey} coordinates={coordinates}>
                        <g role="img" aria-label={t(regionKey)}>
                          <circle r={9} fill="var(--color-gold)" stroke="var(--color-primary-dark)" strokeWidth={1.2} />
                          <circle r={3} fill="var(--color-primary-dark)" />
                        </g>
                      </Marker>
                    ))
                  : null}
              </>
            )}
          </Geographies>
        </ComposableMap>
      </div>
      <figcaption className="border-t border-gray-100 bg-white px-4 py-3 text-xs text-gray-600">
        {t('mapCaption')}
      </figcaption>
    </figure>
  );
}
