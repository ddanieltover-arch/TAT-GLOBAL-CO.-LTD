import type {Metadata} from 'next';
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
import {SITE_NAME} from '@/lib/seo/site';
import {brandLogo} from '@/lib/site-assets';
import {getSiteUrl} from '@/lib/site-url';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';
import LocaleHtmlLang from '@/components/LocaleHtmlLang';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}> | {locale: string};
}): Promise<Metadata> {
  const {locale: raw} = await unwrapRouteParams(params);
  const locale = hasLocale(routing.locales, raw) ? raw : defaultLocale;

  const t = await getTranslations({locale, namespace: 'meta'});
  const base = getSiteUrl();
  const imageUrl = `${base}${brandLogo.png}`;

  return {
    metadataBase: new URL(base),
    title: {
      default: t('title'),
      template: `%s${t('titleSuffix')}`,
    },
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [imageUrl],
    },
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
    <div className={fontStack}>
      <OrganizationJsonLd locale={locale} />
      <GrainTexture />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <LocaleHtmlLang />
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
    </div>
  );
}
