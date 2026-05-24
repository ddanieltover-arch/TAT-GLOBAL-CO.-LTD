import type {Metadata} from 'next';
import {Playfair_Display, DM_Sans, Sarabun} from 'next/font/google';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {OrganizationJsonLd} from '@/components/seo/OrganizationJsonLd';
import FloatingUi from '@/components/floating/FloatingUi';
import SkipToContent from '@/components/a11y/SkipToContent';
import PageTransition from '@/components/layout/PageTransition';
import GrainTexture from '@/components/ui/GrainTexture';
import MotionProvider from '@/components/providers/MotionProvider';
import {QuoteModalProvider} from '@/components/quote/QuoteModalContext';
import {routing} from '@/i18n/routing';
import {defaultLocale, locales} from '@/lib/translations';
import {getSiteUrl} from '@/lib/site-url';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

const displayFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const thaiFont = Sarabun({
  subsets: ['thai', 'latin'],
  variable: '--font-thai',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale: raw} = await unwrapRouteParams(params);
  const locale = hasLocale(routing.locales, raw) ? raw : defaultLocale;

  const t = await getTranslations({locale, namespace: 'meta'});

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: t('title'),
      template: `%s${t('titleSuffix')}`,
    },
    description: t('description'),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}> | {locale: string};
}) {
  const {locale} = await unwrapRouteParams(params);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = (await import(`../../messages/${locale}.json`)).default;

  const fontStack =
    locale === 'th' ? 'font-thai leading-relaxed' : 'font-sans';

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${thaiFont.variable} ${fontStack}`}
      >
        <OrganizationJsonLd locale={locale} />
        <GrainTexture />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MotionProvider>
            <QuoteModalProvider>
              <SkipToContent />
              <main id="main-content" tabIndex={-1} className="outline-none">
                <PageTransition>{children}</PageTransition>
              </main>
              <FloatingUi />
            </QuoteModalProvider>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
