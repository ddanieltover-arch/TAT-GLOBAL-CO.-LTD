/**
 * Site-wide navigation — primary routes in the header, secondary routes in the footer.
 * Product detail pages (/products/[slug]) are reached via the catalog and footer highlights.
 */

export type NavLabelKey =
  | 'home'
  | 'about'
  | 'products'
  | 'quality'
  | 'qualityControl'
  | 'packaging'
  | 'markets'
  | 'orderingProcedure'
  | 'sustainability'
  | 'testimonials'
  | 'faq'
  | 'contact'
  | 'privacy';

export type SiteNavItem = {
  href: string;
  labelKey: NavLabelKey;
};

/** Main header — high-intent pages only. */
export const headerNav: SiteNavItem[] = [
  {href: '/', labelKey: 'home'},
  {href: '/products', labelKey: 'products'},
  {href: '/about', labelKey: 'about'},
  {href: '/quality', labelKey: 'quality'},
  {href: '/contact', labelKey: 'contact'},
];

/** Footer company column — remaining marketing pages. */
export const footerNav: SiteNavItem[] = [
  {href: '/quality-control', labelKey: 'qualityControl'},
  {href: '/ordering-procedure', labelKey: 'orderingProcedure'},
  {href: '/sustainability', labelKey: 'sustainability'},
  {href: '/testimonials', labelKey: 'testimonials'},
  {href: '/packaging', labelKey: 'packaging'},
  {href: '/markets', labelKey: 'markets'},
  {href: '/faq', labelKey: 'faq'},
  {href: '/privacy', labelKey: 'privacy'},
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
