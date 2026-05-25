import Image from 'next/image';

type PageImageBannerProps = {
  src: string;
  alt: string;
  title: string;
  intro?: string;
  priority?: boolean;
  width: number;
  height: number;
};

export default function PageImageBanner({
  src,
  alt,
  title,
  intro,
  priority = false,
  width,
  height,
}: PageImageBannerProps) {
  return (
    <section className="border-b border-gold/25 bg-white" aria-label={title}>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {intro ? <p className="sr-only">{intro}</p> : null}
        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-card">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
