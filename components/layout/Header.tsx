'use client';

import {motion} from 'framer-motion';
import {Menu} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import Button from '@/components/ui/Button';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import Logo from './Logo';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';
import {cn} from '@/lib/cn';
import {headerNav, isNavActive} from '@/lib/site-navigation';

export default function Header() {
  const locale = useLocale();
  const tn = useTranslations('nav');
  const tc = useTranslations('cta');
  const ta = useTranslations('a11y');

  const pathname = usePathname();
  const {openQuoteModal} = useQuoteModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = useMemo(
    () => headerNav.map((item) => ({href: item.href, label: tn(item.labelKey)})),
    [tn]
  );

  return (
    <>
      <TopBar locale={locale} />
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-gold/25 bg-primary-dark transition-shadow duration-300',
          isScrolled && 'shadow-lg'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-8 lg:py-4">
          <Logo variant="header" priority className="min-h-0 py-0 lg:min-h-11 lg:py-2" />

          <nav className="hidden items-center gap-1.5 xl:flex" aria-label={ta('mainNavLabel')}>
            {navItems.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'touch-target-inline rounded-lg border px-2.5 text-sm font-medium transition',
                    active
                      ? 'border-gold/50 bg-gold/25 text-gold-light shadow-sm'
                      : 'border-white/15 bg-white/10 text-white hover:border-gold/40 hover:bg-white/15 hover:text-gold-light'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <motion.div
              className="hidden md:inline-flex"
              whileHover={{scale: 1.05, y: -1}}
              whileTap={{scale: 0.97}}
            >
              <Button type="button" size="sm" onClick={() => openQuoteModal()}>
                {tc('requestQuote')}
              </Button>
            </motion.div>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              aria-label={ta('openMobileNav')}
              className="touch-target h-10 w-10 rounded-lg border border-white/20 bg-white/10 p-2 text-white transition hover:border-gold/40 hover:bg-white/15 xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navItems={navItems}
      />
    </>
  );
}
