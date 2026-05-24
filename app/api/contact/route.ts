import {NextResponse} from 'next/server';
import {
  CONTACT_SUCCESS_MESSAGE,
  contactRateLimitMax,
  contactRateLimitWindowMs,
} from '@/lib/api-config';
import {getClientIp, takeToken} from '@/lib/rate-limit';
import {contactRequestSchema} from '@/lib/schema';
import {buildContactCrmPayload, sendCrmWebhook} from '@/lib/crm-webhook';
import {sendContactFormEmails} from '@/lib/email';

function contactAcceptedResponse() {
  return NextResponse.json({message: CONTACT_SUCCESS_MESSAGE}, {status: 200});
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({message: 'Invalid contact request.'}, {status: 400});
    }

    if (
      typeof body === 'object' &&
      body !== null &&
      typeof (body as {honeypot?: unknown}).honeypot === 'string' &&
      String((body as {honeypot: string}).honeypot).trim().length > 0
    ) {
      return contactAcceptedResponse();
    }

    const ip = getClientIp(request);
    const rl = takeToken(`contact:${ip}`, contactRateLimitMax, contactRateLimitWindowMs);
    if (!rl.ok) {
      return NextResponse.json(
        {
          message:
            'Too many messages from this connection. Please wait a few minutes and try again.',
        },
        {status: 429, headers: {'Retry-After': String(rl.retryAfterSec)}}
      );
    }

    const parsed = contactRequestSchema.safeParse({
      fullName: (body as {fullName?: unknown}).fullName,
      companyName: (body as {companyName?: unknown}).companyName,
      email: (body as {email?: unknown}).email,
      message: (body as {message?: unknown}).message,
      gdprConsent: (body as {gdprConsent?: unknown}).gdprConsent === true,
      locale: (body as {locale?: unknown}).locale,
      honeypot:
        typeof (body as {honeypot?: unknown}).honeypot === 'string'
          ? (body as {honeypot: string}).honeypot
          : '',
    });

    if (!parsed.success) {
      return NextResponse.json({message: 'Invalid contact request.'}, {status: 400});
    }

    const data = parsed.data;

    await sendContactFormEmails(data);

    void sendCrmWebhook(buildContactCrmPayload(data));

    return contactAcceptedResponse();
  } catch (error) {
    console.error('[contact]', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Unable to send your message right now.',
      },
      {status: 500}
    );
  }
}
