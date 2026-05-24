import Image from 'next/image';
import {imageAlts, siteImages} from '@/lib/site-images';

type ContactBannerProps = {
  /** Screen-reader heading when the banner image includes visible title text. */
  title: string;
  intro: string;
};

export default function ContactBanner({title, intro}: ContactBannerProps) {
  return (
    <section className="border-b border-gold/25 bg-white" aria-labelledby="contact-hero-heading">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <h1 id="contact-hero-heading" className="sr-only">
          {title}
        </h1>
        <p className="sr-only">{intro}</p>
        <Image
          src={siteImages.contactBanner}
          alt={imageAlts.contactBanner}
          width={1920}
          height={1080}
          className="h-auto w-full rounded-xl border border-gray-100 shadow-card"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </div>
    </section>
  );
}
