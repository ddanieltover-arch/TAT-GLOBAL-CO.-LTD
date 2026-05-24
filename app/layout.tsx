import type {Metadata} from 'next';
import './globals.css';
import {getSiteUrl} from '@/lib/site-url';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'TAT GLOBAL CO., LTD',
  description: 'Premium Thai Rice — Manufactured and Exported from Thailand to the World.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
