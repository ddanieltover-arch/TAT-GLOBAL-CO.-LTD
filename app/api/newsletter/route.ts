import {NextResponse} from 'next/server';
import {
  NEWSLETTER_SUCCESS_MESSAGE,
  newsletterRateLimitMax,
  newsletterRateLimitWindowMs,
} from '@/lib/api-config';
import {getClientIp, takeToken} from '@/lib/rate-limit';
import {newsletterRequestSchema} from '@/lib/schema';
import {sendNewsletterFormEmails} from '@/lib/email';

function honeypotSilentSuccess() {
  return NextResponse.json({ok: true as const, message: NEWSLETTER_SUCCESS_MESSAGE}, {status: 200});
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ok: false as const, code: 'INVALID'}, {status: 400});
    }

    if (
      typeof body === 'object' &&
      body !== null &&
      typeof (body as {honeypot?: unknown}).honeypot === 'string' &&
      String((body as {honeypot: string}).honeypot).trim().length > 0
    ) {
      return honeypotSilentSuccess();
    }

    const ip = getClientIp(request);
    const rl = takeToken(`newsletter:${ip}`, newsletterRateLimitMax, newsletterRateLimitWindowMs);
    if (!rl.ok) {
      return NextResponse.json(
        {ok: false as const, code: 'RATE_LIMITED'},
        {status: 429, headers: {'Retry-After': String(rl.retryAfterSec)}}
      );
    }

    const parsed = newsletterRequestSchema.safeParse({
      email: (body as {email?: unknown}).email,
      locale: (body as {locale?: unknown}).locale,
      honeypot:
        typeof (body as {honeypot?: unknown}).honeypot === 'string'
          ? (body as {honeypot: string}).honeypot
          : '',
      gdprConsent: (body as {gdprConsent?: unknown}).gdprConsent === true,
    });

    if (!parsed.success) {
      return NextResponse.json({ok: false as const, code: 'INVALID'}, {status: 400});
    }

    const data = parsed.data;

    await sendNewsletterFormEmails(data.email, ip, data.locale);

    return NextResponse.json({ok: true as const, message: NEWSLETTER_SUCCESS_MESSAGE}, {status: 200});
  } catch (error) {
    console.error('[newsletter]', error);
    return NextResponse.json({ok: false as const, code: 'SERVER_ERROR'}, {status: 500});
  }
}
