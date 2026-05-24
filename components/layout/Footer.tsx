'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import PrivacyConsentLabel from '@/components/legal/PrivacyConsentLabel';
import CatalogDownload from './CatalogDownload';
import NewsletterSignup from './NewsletterSignup';
import Logo from './Logo';
import {featuredProductSlugs} from '@/lib/products';
import {catalogKeyFromSlug} from '@/lib/product-messages';
import {footerNav} from '@/lib/site-navigation';

export default function Footer() {
  const tf = useTranslations('footer');
  const tn = useTranslations('nav');
  const tCatalog = useTranslations('products.catalog');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/25 bg-primary-dark pb-20 text-white sm:pb-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo variant="footer" />
          <p className="mt-4 text-sm leading-relaxed text-white/80">{tf('tagline')}</p>
          <div className="mt-5 space-y-2 text-sm text-white/85">
            <p>sales@tatglcoltd.com</p>
            <p>tatglcoltd.com</p>
            <p>Thailand</p>
          </div>
          <div className="mt-6 rounded-xl border border-gold/30 bg-white/5 p-4">
            <p className="text-sm font-semibold text-gold-light">{tf('catalogTitle')}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/75">{tf('catalogDescription')}</p>
            <CatalogDownload className="mt-3 w-full justify-center sm:w-auto" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-gold-light">
            {tf('explore')}
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-gold-light">
                  {tn(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-gold-light">
            {tf('productsColumn')}
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            {featuredProductSlugs.map((slug) => {
              const key = catalogKeyFromSlug(slug);
              return (
                <li key={slug}>
                  <Link href={`/products/${slug}`} className="transition hover:text-gold-light">
                    {tCatalog(`${key}.name`)}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href="/products" className="font-medium text-gold-light transition hover:text-white">
                {tf('viewAllProducts')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-gold-light">
            {tf('newsletter')}
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-white/80">{tf('newsletterTitle')}</p>
          <NewsletterSignup />
          <p className="mt-6 text-xs text-white/60">{tf('socialLine')}</p>
        </div>
      </div>

      <div className="border-t border-gold/20 px-6 py-4 text-center text-xs text-white/60 lg:px-8">
        <PrivacyConsentLabel
          namespace="footer"
          messageKey="legalPrivacy"
          linkClassName="decoration-gold/60 hover:text-gold-light"
        />
        <p className="mt-2">{tf('copyrightLine', {year})}</p>
      </div>
    </footer>
  );
}
