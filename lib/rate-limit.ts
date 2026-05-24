type Bucket = {count: number; resetAt: number};

const store = new Map<string, Bucket>();

function pruneExpired() {
  if (store.size < 2500) {
    return;
  }
  const now = Date.now();
  for (const [key, bucket] of store) {
    if (now > bucket.resetAt) {
      store.delete(key);
    }
  }
}

/** Best-effort client IP for rate limiting behind proxies (e.g. Vercel). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) {
      return first;
    }
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

export type RateLimitResult = {ok: true} | {ok: false; retryAfterSec: number};

/**
 * Sliding window-ish fixed window counter per key.
 * Not shared across serverless isolates — for production edge cases use Redis/Upstash.
 */
export function takeToken(key: string, max: number, windowMs: number): RateLimitResult {
  pruneExpired();

  const now = Date.now();
  let bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    bucket = {count: 1, resetAt: now + windowMs};
    store.set(key, bucket);
    return {ok: true};
  }

  if (bucket.count >= max) {
    return {ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))};
  }

  bucket.count += 1;
  return {ok: true};
}
