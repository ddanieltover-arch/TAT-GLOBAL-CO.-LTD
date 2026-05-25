'use client';

import {AnimatePresence, motion} from 'framer-motion';
import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {useTranslations} from 'next-intl';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import PageImageBanner from '@/components/ui/PageImageBanner';
import PageHero from '@/components/ui/PageHero';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {imageAlts, siteImages} from '@/lib/site-images';

const faqIndices = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export default function FaqPageClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = useTranslations('faqPage');

  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream">
        <PageHero label={t('label')} title={t('title')} />
        <PageImageBanner
          src={siteImages.faqBanner}
          alt={imageAlts.faqBanner}
          title={t('title')}
          intro={t('a1')}
          width={1536}
          height={1024}
        />

        <section className="py-12">
          <div className="mx-auto max-w-4xl space-y-3 px-6 lg:px-8">
            {faqIndices.map((n, index) => {
              const isOpen = openIndex === index;
              const qKey = `q${n}` as const;
              const aKey = `a${n}` as const;
              return (
                <ScrollReveal key={n} delay={index * 0.04}>
                  <article className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-card">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="font-medium text-gray-900">{t(qKey)}</span>
                      <motion.span animate={{rotate: isOpen ? 180 : 0}} transition={{duration: 0.25}}>
                        <ChevronDown className="h-5 w-5 text-primary" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{height: 0, opacity: 0}}
                          animate={{height: 'auto', opacity: 1}}
                          exit={{height: 0, opacity: 0}}
                          transition={{duration: 0.28, ease: [0.22, 1, 0.36, 1]}}
                        >
                          <p className="px-5 pb-5 text-gray-700">{t(aKey)}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
