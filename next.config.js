/** @type {import('next').NextConfig} */
const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    pathname: '/**',
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    remotePatterns.push({
      protocol: 'https',
      hostname: new URL(supabaseUrl).hostname,
      pathname: '/storage/v1/object/public/**',
    });
  } catch {
    // ignore invalid NEXT_PUBLIC_SUPABASE_URL at build time
  }
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns,
  },
};

const withNextIntl = require('next-intl/plugin')('./lib/request.ts');
module.exports = withNextIntl(nextConfig);
