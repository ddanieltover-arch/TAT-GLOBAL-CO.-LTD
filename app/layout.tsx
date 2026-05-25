import type {Metadata} from 'next';
import './globals.css';
import {SITE_NAME} from '@/lib/seo/site';
import {brandLogo} from '@/lib/site-assets';
import {getSiteUrl} from '@/lib/site-url';

const siteUrl = getSiteUrl();
const ogImageUrl = `${siteUrl}${brandLogo.png}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'TAT GLOBAL CO., LTD',
  description: 'Premium Thai Rice — Manufactured and Exported from Thailand to the World.',
  openGraph: {
    title: 'TAT GLOBAL CO., LTD',
    description: 'Premium Thai Rice — Manufactured and Exported from Thailand to the World.',
    siteName: SITE_NAME,
    images: [
      {
        url: ogImageUrl,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAT GLOBAL CO., LTD',
    description: 'Premium Thai Rice — Manufactured and Exported from Thailand to the World.',
    images: [ogImageUrl],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
