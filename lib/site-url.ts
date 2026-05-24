/** Public site origin for canonical URLs, sitemap, and JSON-LD (no trailing slash). */
export function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) {
    try {
      return new URL(env).origin;
    } catch {
      // ignore invalid URL
    }
  }
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/\/$/, '');
    return host.startsWith('http') ? new URL(host).origin : `https://${host}`;
  }
  return 'https://tatglcoltd.com';
}
