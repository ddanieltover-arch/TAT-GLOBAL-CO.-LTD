import {NextResponse} from 'next/server';
import {
  QUOTE_SUCCESS_MESSAGE,
  quoteRateLimitMax,
  quoteRateLimitWindowMs,
} from '@/lib/api-config';
import {getClientIp, takeToken} from '@/lib/rate-limit';
import {quoteServerSchema} from '@/lib/schema';
import {buildQuoteCrmPayload, sendCrmWebhook} from '@/lib/crm-webhook';
import {sendQuoteFormEmails} from '@/lib/email';
import {storeQuoteSubmission, SubmissionStoreError} from '@/lib/submission-store';

function toBoolean(value: FormDataEntryValue | null) {
  return value === 'true' || value === 'on';
}

function quoteAcceptedResponse() {
  return NextResponse.json({message: QUOTE_SUCCESS_MESSAGE}, {status: 200});
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const hp = String(formData.get('honeypot') || '').trim();

    // Bots that fill hidden fields still get a normal success payload (no email sent).
    if (hp.length > 0) {
      return quoteAcceptedResponse();
    }

    const ip = getClientIp(request);
    const rl = takeToken(`quote:${ip}`, quoteRateLimitMax, quoteRateLimitWindowMs);
    if (!rl.ok) {
      return NextResponse.json(
        {
          message:
            'Too many quote requests from this connection. Please wait a few minutes and try again.',
        },
        {status: 429, headers: {'Retry-After': String(rl.retryAfterSec)}}
      );
    }

    const fileAttachment = formData.get('fileAttachment');
    const localeRaw = String(formData.get('locale') || '').trim();

    const payload = {
      fullName: String(formData.get('fullName') || ''),
      companyName: String(formData.get('companyName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      whatsapp: String(formData.get('whatsapp') || ''),
      country: String(formData.get('country') || ''),
      productInterested: String(formData.get('productInterested') || ''),
      quantityRequired: String(formData.get('quantityRequired') || ''),
      packagingPreference: String(formData.get('packagingPreference') || ''),
      deliveryDestination: String(formData.get('deliveryDestination') || ''),
      message: String(formData.get('message') || ''),
      preferredContact: String(formData.get('preferredContact') || '') || undefined,
      purchaseTimeline: String(formData.get('purchaseTimeline') || '') || undefined,
      gdprConsent: toBoolean(formData.get('gdprConsent')),
      locale: localeRaw === 'th' || localeRaw === 'en' ? localeRaw : undefined,
      honeypot: '',
      fileAttachment:
        fileAttachment instanceof File && fileAttachment.size > 0 ? fileAttachment : undefined,
    };

    const parsed = quoteServerSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({message: 'Invalid quote request.'}, {status: 400});
    }

    const data = parsed.data;
    let attachments:
      | {filename: string; content: Buffer; contentType?: string}[]
      | undefined;

    if (data.fileAttachment) {
      const buf = Buffer.from(await data.fileAttachment.arrayBuffer());
      attachments = [
        {
          filename: data.fileAttachment.name,
          content: buf,
          contentType: data.fileAttachment.type || undefined,
        },
      ];
    }

    const attachmentName = attachments?.[0]?.filename;

    try {
      await storeQuoteSubmission(data, {
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') ?? undefined,
      });
    } catch (storeError) {
      console.error('[quote] submission store failed:', storeError);
      if (storeError instanceof SubmissionStoreError) {
        return NextResponse.json(
          {message: 'Unable to save your inquiry right now. Please try again or email us directly.'},
          {status: 503},
        );
      }
    }

    await sendQuoteFormEmails(data, {attachmentName}, attachments);

    const fileMeta = data.fileAttachment
      ? {
          name: data.fileAttachment.name,
          size: data.fileAttachment.size,
          type: data.fileAttachment.type || 'application/octet-stream',
        }
      : undefined;

    void sendCrmWebhook(buildQuoteCrmPayload(data, fileMeta));

    return quoteAcceptedResponse();
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Unable to submit your inquiry right now.',
      },
      {status: 500}
    );
  }
}
