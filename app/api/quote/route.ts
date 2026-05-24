import {NextResponse} from 'next/server';
import {
  QUOTE_SUCCESS_MESSAGE,
  quoteRateLimitMax,
  quoteRateLimitWindowMs,
} from '@/lib/api-config';
import {getClientIp, takeToken} from '@/lib/rate-limit';
import {quoteServerSchema} from '@/lib/schema';
import {buildQuoteCrmPayload, sendCrmWebhook} from '@/lib/crm-webhook';
import {sendNotificationEmail} from '@/lib/send-notification-email';

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

    const emailBody = `
New quote inquiry from ${data.fullName}

Company: ${data.companyName}
Email: ${data.email}
Phone: ${data.phone}
WhatsApp: ${data.whatsapp}
Country: ${data.country}
Product Interested In: ${data.productInterested}
Quantity Required: ${data.quantityRequired}
Packaging Preference: ${data.packagingPreference}
Delivery Destination: ${data.deliveryDestination}
Preferred Contact Method: ${data.preferredContact || 'N/A'}
Expected Purchase Timeline: ${data.purchaseTimeline || 'N/A'}
Attachment: ${attachments ? attachments[0].filename : 'None'}

Message:
${data.message}
`.trim();

    const toEmail = process.env.QUOTE_TO_EMAIL || 'sales@tatglcoltd.com';
    const fromEmail = process.env.QUOTE_FROM_EMAIL || 'onboarding@resend.dev';

    await sendNotificationEmail({
      from: fromEmail,
      to: toEmail,
      subject: `Quote Request - ${data.companyName}`,
      text: emailBody,
      attachments,
      logLabel: 'QUOTE REQUEST',
    });

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
