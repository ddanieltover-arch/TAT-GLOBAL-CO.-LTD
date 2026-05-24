/** Registered / correspondence address for maps and structured data. */
export const COMPANY_ADDRESS = {
  streetAddress: '1826 Banthat Thong Rd',
  sublocality: 'Khwaeng Rong Muang, Pathum Wan',
  locality: 'Krung Thep Maha Nakhon',
  postalCode: '10330',
  country: 'Thailand',
  countryCode: 'TH',
} as const;

export function formatCompanyAddressMultiline(): string[] {
  const {streetAddress, sublocality, locality, postalCode, country} = COMPANY_ADDRESS;
  return [
    streetAddress,
    sublocality,
    `${locality} ${postalCode}`,
    country,
  ];
}

export function formatCompanyAddressOneLine(): string {
  return formatCompanyAddressMultiline().join(', ');
}

/** Google Maps search / embed query (no API key required for embed iframe). */
export function getGoogleMapsQuery(): string {
  return formatCompanyAddressOneLine();
}

export function getGoogleMapsSearchUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getGoogleMapsQuery())}`;
}

export function getGoogleMapsEmbedUrl(): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(getGoogleMapsQuery())}&output=embed`;
}
