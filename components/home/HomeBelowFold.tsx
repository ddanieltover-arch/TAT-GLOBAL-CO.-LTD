'use client';

import dynamic from 'next/dynamic';

const AboutSection = dynamic(() => import('@/components/home/AboutSection'));
const ProductCategories = dynamic(() => import('@/components/home/ProductCategories'));
const WhyChooseUs = dynamic(() => import('@/components/home/WhyChooseUs'));
const QualitySection = dynamic(() => import('@/components/home/QualitySection'));
const PackagingSection = dynamic(() => import('@/components/home/PackagingSection'));
const ExportMarkets = dynamic(() => import('@/components/home/ExportMarkets'));
const Testimonials = dynamic(() => import('@/components/home/Testimonials'));
const CTASection = dynamic(() => import('@/components/home/CTASection'));

/** Below-fold homepage sections — code-split to improve initial JS and TBT. */
export default function HomeBelowFold() {
  return (
    <>
      <AboutSection />
      <ProductCategories />
      <WhyChooseUs />
      <QualitySection />
      <PackagingSection />
      <ExportMarkets />
      <Testimonials />
      <CTASection />
    </>
  );
}
