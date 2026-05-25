/** Maps product slug to nested key under products.catalog in messages (hyphens → underscores). */
export function catalogKeyFromSlug(slug: string) {
  return slug.replace(/-/g, '_');
}

export type CatalogSpecRow = {attribute: string; value: string};

export type CatalogEntryMessages = {
  name: string;
  shortDescription: string;
  badge?: string;
  availability: string;
  grainSpec: string;
  moistureSpec: string;
  brokenSpec: string;
  fullDescription: string;
  moq: string;
  shipping?: string;
  storage?: string;
  technicalSpecifications: CatalogSpecRow[];
};

/** Read typed catalog row from merged next-intl messages (client). */
export function readCatalogEntry(
  catalog: Record<string, CatalogEntryMessages> | undefined,
  slug: string
): CatalogEntryMessages | undefined {
  const raw = catalog?.[catalogKeyFromSlug(slug)];
  if (
    raw &&
    typeof raw.name === 'string' &&
    Array.isArray(raw.technicalSpecifications)
  ) {
    return raw;
  }
  return undefined;
}
