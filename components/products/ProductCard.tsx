'use client';

import {motion} from 'framer-motion';
import {useMessages, useTranslations} from 'next-intl';
import Button from '@/components/ui/Button';
import {Link} from '@/i18n/navigation';
import {Product} from '@/lib/products';
import {catalogKeyFromSlug} from '@/lib/product-messages';
import {useQuoteModal} from '@/components/quote/QuoteModalContext';
import ParallaxImage from '@/components/ui/ParallaxImage';
import {cardHover, cardTap, fadeUp, viewTransition} from '@/lib/motion';
import {getProductImage, getProductImageFallback, imageAlts} from '@/lib/site-images';

type ProductCardProps = {
  product: Product;
  index?: number;
};

export default function ProductCard({product, index = 0}: ProductCardProps) {
  const {openQuoteModal} = useQuoteModal();
  const slugKey = catalogKeyFromSlug(product.slug);
  const messages = useMessages();
  const row = messages.products?.catalog?.[slugKey] as {badge?: string} | undefined;
  const t = useTranslations(`products.catalog.${slugKey}`);
  const tc = useTranslations('cta');
  return (
    <motion.article
      layout
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeUp}
      transition={{...viewTransition, delay: index * 0.05}}
      whileHover={cardHover}
      whileTap={cardTap}
      className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card"
    >
      <Link href={`/products/${product.slug}`} aria-label={t('name')} className="block">
        <ParallaxImage
          src={getProductImage(product.slug)}
          fallbackSrc={getProductImageFallback()}
          alt={`${t('name')} — ${imageAlts.product}`}
          className="h-56 w-full"
          speed={0.2}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          overlay={
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 via-transparent to-transparent" />
          }
        />
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-primary-dark px-3 py-1 text-xs font-medium text-gold-light">
            {t('availability')}
          </span>
          {row?.badge ? <span className="text-xs text-gray-700">{row.badge}</span> : null}
        </div>

        <h3 className="mt-4 font-display text-2xl text-gray-900">
          <Link href={`/products/${product.slug}`} className="transition hover:text-primary">
            {t('name')}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{t('shortDescription')}</p>

        <div className="mt-4 space-y-1 text-xs text-gray-600">
          <p>{t('grainSpec')}</p>
          <p>{t('moistureSpec')}</p>
          <p>{t('brokenSpec')}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.packaging.map((pack) => (
            <span key={pack} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
              {pack}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button href={`/products/${product.slug}`} variant="outline-primary" size="sm">
            {tc('viewDetails')}
          </Button>
          <Button type="button" size="sm" onClick={() => openQuoteModal(product.slug)}>
            {tc('requestQuoteCard')}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
