function intEnv(name: string, fallback: number) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') {
    return fallback;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Max quote POST attempts per IP per window. Default: 5 / 15 min. */
export const quoteRateLimitMax = intEnv('QUOTE_RATE_LIMIT_MAX', 5);

export const quoteRateLimitWindowMs = intEnv('QUOTE_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000);

/** Newsletter signups per IP per window. Default: 10 / hour. */
export const newsletterRateLimitMax = intEnv('NEWSLETTER_RATE_LIMIT_MAX', 10);

export const newsletterRateLimitWindowMs = intEnv(
  'NEWSLETTER_RATE_LIMIT_WINDOW_MS',
  60 * 60 * 1000
);

export const QUOTE_SUCCESS_MESSAGE =
  'Your inquiry has been received. Our export team will respond within 24 hours.';

export const NEWSLETTER_SUCCESS_MESSAGE =
  'Thank you — you are on the list. Watch your inbox for market and product updates.';

/** Contact form submissions per IP per window. Default: 5 / 15 min. */
export const contactRateLimitMax = intEnv('CONTACT_RATE_LIMIT_MAX', 5);

export const contactRateLimitWindowMs = intEnv(
  'CONTACT_RATE_LIMIT_WINDOW_MS',
  15 * 60 * 1000
);

export const CONTACT_SUCCESS_MESSAGE =
  'Your message has been received. Our export team will respond within 24 business hours.';
