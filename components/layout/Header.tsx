'use client';

import {motion} from 'framer-motion';
import {Menu} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import Button from '@/components/ui/Button';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';

export default function Header() {
  const locale = useLocale();
  const tn = useTranslations('nav');
  const tc = useTranslations('cta');
  const tBrand = useTranslations('common');
  const ta = useTranslations('a11y');

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
    () => [
      {label: tn('home'), href: '/'},
      {label: tn('about'), href: '/about'},
      {label: tn('products'), href: '/products'},
      {label: tn('quality'), href: '/quality'},
      {label: tn('packaging'), href: '/packaging'},
      {label: tn('markets'), href: '/markets'},
      {label: tn('faq'), href: '/faq'},
      {label: tn('contact'), href: '/contact'},
    ],
    [tn]
  );

  return (
    <>
      <header className="sticky top-0 z-50">
        <TopBar locale={locale} />
        <div
          className={[
            'border-b border-gold/20 transition-all duration-300',
            isScrolled ? 'bg-primary/90 shadow-card backdrop-blur-md' : 'bg-primary',
          ].join(' ')}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
            <Link href="/" className="touch-target-inline font-display text-xl text-white">
              {tBrand('brand')}
            </Link>

            <nav className="hidden items-center gap-1 xl:flex" aria-label={ta('mainNavLabel')}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="touch-target-inline group relative px-2 text-sm font-medium text-white/90 transition hover:text-gold-light"
                >
                  {item.label}
                  <span
                    className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-gold-light transition-transform duration-300 group-hover:scale-x-100"
                    aria-hidden
                  />
                </Link>
              ))}
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
                className="touch-target rounded-md border border-white/30 p-2 text-white transition hover:bg-white/10 xl:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
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
