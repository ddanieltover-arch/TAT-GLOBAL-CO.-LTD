import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductDetailContent from '@/components/products/ProductDetailContent';
import {ProductJsonLd} from '@/components/seo/ProductJsonLd';
import {routing} from '@/i18n/routing';
import {catalogKeyFromSlug} from '@/lib/product-messages';
import {products} from '@/lib/products';
import {productDetailMetadata} from '@/lib/seo/page-metadata';
import {unwrapRouteParams} from '@/lib/unwrap-route-params';

export async function generateStaticParams() {
  return products.map((p) => ({slug: p.slug}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string; slug: string}> | {locale: string; slug: string};
}): Promise<Metadata> {
  const {locale, slug} = await unwrapRouteParams(params);
  if (!locale || !hasLocale(routing.locales, locale) || !slug) {
    return {};
  }

  setRequestLocale(locale);
  return productDetailMetadata(locale, slug);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{locale: string; slug: string}> | {locale: string; slug: string};
}) {
  const {locale, slug} = await unwrapRouteParams(params);

  if (!locale || !hasLocale(routing.locales, locale) || !slug) {
    notFound();
  }

  setRequestLocale(locale);

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const ck = catalogKeyFromSlug(slug);
  const tp = await getTranslations({locale, namespace: 'products.catalog'});
  const name = tp(`${ck}.name`);
  const description = tp(`${ck}.shortDescription`);

  return (
    <>
      <ProductJsonLd
        locale={locale}
        slug={slug}
        name={name}
        description={description}
      />
      <Header />
      <ProductDetailContent product={product} allProducts={products} />
      <Footer />
    </>
  );
}
