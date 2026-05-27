/**
 * Transactional outbound email for quote inquiries and newsletter signups.
 *
 * **Production:** Configure [Resend](https://resend.com) with `RESEND_API_KEY` plus
 * `QUOTE_FROM_EMAIL` / `QUOTE_TO_EMAIL` (and optional newsletter overrides).
 * Quote and contact routes also POST to `CRM_WEBHOOK_URL` when set (see `lib/crm-webhook.ts`).
 *
 * **Fallback:** SMTP env vars remain supported for local or legacy setups without Resend.
 * If neither Resend nor SMTP is configured, the payload is logged to the server console.
 */
import {EMAIL_LOGO_CID, getEmailLogoInlineAttachment} from '@/lib/email/logo-inline';
import {isResendConfigured, hasSmtpFallback} from '@/lib/env';
import {Resend} from 'resend';
import nodemailer from 'nodemailer';

function mergeAttachments(
  html: string | undefined,
  attachments: EmailAttachment[] | undefined,
): EmailAttachment[] | undefined {
  if (!html?.includes(`cid:${EMAIL_LOGO_CID}`)) {
    return attachments;
  }

  const logo = getEmailLogoInlineAttachment();
  if (!logo) {
    return attachments;
  }

  const list = attachments ? [...attachments] : [];
  if (!list.some((item) => item.contentId === EMAIL_LOGO_CID)) {
    list.unshift(logo);
  }
  return list;
}

function mapAttachmentsForResend(attachments: EmailAttachment[] | undefined) {
  if (!attachments?.length) {
    return undefined;
  }

  return attachments.map((a) => ({
    filename: a.filename,
    content: a.content,
    contentType: a.contentType,
    contentId: a.contentId,
  }));
}

function mapAttachmentsForSmtp(attachments: EmailAttachment[] | undefined) {
  if (!attachments?.length) {
    return undefined;
  }

  return attachments.map((a) => ({
    filename: a.filename,
    content: a.content,
    contentType: a.contentType,
    cid: a.contentId,
  }));
}

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
  /** Inline image reference for HTML (`cid:your-id`). */
  contentId?: string;
};

export type SendNotificationEmailOptions = {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
  /** Branded HTML body (Resend + SMTP). Plain `text` is always sent as fallback. */
  html?: string;
  replyTo?: string | string[];
  attachments?: EmailAttachment[];
  /** Console log prefix when no provider is configured */
  logLabel: string;
};

export async function sendNotificationEmail(opts: SendNotificationEmailOptions) {
  const toList = Array.isArray(opts.to) ? opts.to : [opts.to];
  const attachments = mergeAttachments(opts.html, opts.attachments);

  if (isResendConfigured()) {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: opts.from,
      to: toList,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      replyTo: opts.replyTo,
      attachments: mapAttachmentsForResend(attachments),
    });
    return;
  }

  if (hasSmtpFallback()) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const replyProp = opts.replyTo
      ? {replyTo: Array.isArray(opts.replyTo) ? opts.replyTo.join(', ') : opts.replyTo}
      : {};

    await transporter.sendMail({
      from: opts.from,
      to: toList.join(', '),
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      ...replyProp,
      attachments: mapAttachmentsForSmtp(attachments),
    });
    return;
  }

  console.log(`[${opts.logLabel}]`, opts.text);
}
