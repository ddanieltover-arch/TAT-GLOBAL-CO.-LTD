import {
  buildContactConfirmationHtml,
  buildContactConfirmationText,
} from '@/lib/email/templates/confirmations/contact-confirmation';
import {
  buildNewsletterConfirmationHtml,
  buildNewsletterConfirmationText,
} from '@/lib/email/templates/confirmations/newsletter-confirmation';
import {
  buildQuoteConfirmationHtml,
  buildQuoteConfirmationText,
} from '@/lib/email/templates/confirmations/quote-confirmation';
import {buildContactInquiryHtml, buildContactInquiryText} from '@/lib/email/templates/contact-inquiry';
import {buildNewsletterSignupHtml, buildNewsletterSignupText} from '@/lib/email/templates/newsletter-signup';
import {buildQuoteRequestHtml, buildQuoteRequestText} from '@/lib/email/templates/quote-request';
import type {QuoteEmailMeta} from '@/lib/email/templates/quote-request';
import {
  getContactFromEmail,
  getContactTeamEmail,
  getDefaultFromEmail,
  getNewsletterFromEmail,
  getNewsletterTeamEmail,
  getSalesReplyTo,
  getTeamInboxEmail,
} from '@/lib/email/from-address';
import {parseEmailLocale} from '@/lib/email/locale';
import {getConfirmationCopy} from '@/lib/email/confirmations/copy';
import type {EmailAttachment} from '@/lib/send-notification-email';
import {sendNotificationEmail} from '@/lib/send-notification-email';
import type {ContactRequest, QuoteServerValues} from '@/lib/schema';

export async function sendContactFormEmails(data: ContactRequest & {locale?: string}) {
  const locale = parseEmailLocale(data.locale);
  const teamFrom = getContactFromEmail();
  const customerFrom = getContactFromEmail();
  const teamTo = getContactTeamEmail();
  const salesReply = getSalesReplyTo();
  const copy = getConfirmationCopy(locale).contact;

  await Promise.all([
    sendNotificationEmail({
      from: teamFrom,
      to: teamTo,
      subject: `Contact inquiry — ${data.companyName}`,
      text: buildContactInquiryText(data),
      html: buildContactInquiryHtml(data),
      replyTo: data.email,
      logLabel: 'CONTACT INQUIRY',
    }),
    sendNotificationEmail({
      from: customerFrom,
      to: data.email,
      subject: copy.subject,
      text: buildContactConfirmationText(data, locale),
      html: buildContactConfirmationHtml(data, locale),
      replyTo: salesReply,
      logLabel: 'CONTACT CONFIRMATION',
    }),
  ]);
}

export async function sendQuoteFormEmails(
  data: QuoteServerValues & {locale?: string},
  meta?: QuoteEmailMeta,
  attachments?: EmailAttachment[]
) {
  const locale = parseEmailLocale(data.locale);
  const teamFrom = getDefaultFromEmail();
  const teamTo = getTeamInboxEmail();
  const salesReply = getSalesReplyTo();
  const copy = getConfirmationCopy(locale).quote;

  await Promise.all([
    sendNotificationEmail({
      from: teamFrom,
      to: teamTo,
      subject: `Quote Request - ${data.companyName}`,
      text: buildQuoteRequestText(data, meta),
      html: buildQuoteRequestHtml(data, meta),
      attachments,
      replyTo: data.email,
      logLabel: 'QUOTE REQUEST',
    }),
    sendNotificationEmail({
      from: teamFrom,
      to: data.email,
      subject: copy.subject,
      text: buildQuoteConfirmationText(data, locale),
      html: buildQuoteConfirmationHtml(data, locale),
      replyTo: salesReply,
      logLabel: 'QUOTE CONFIRMATION',
    }),
  ]);
}

export async function sendNewsletterFormEmails(email: string, ip: string, localeInput?: string) {
  const locale = parseEmailLocale(localeInput);
  const teamFrom = getNewsletterFromEmail();
  const teamTo = getNewsletterTeamEmail();
  const salesReply = getSalesReplyTo();
  const copy = getConfirmationCopy(locale).newsletter;

  await Promise.all([
    sendNotificationEmail({
      from: teamFrom,
      to: teamTo,
      subject: `Newsletter signup — ${email}`,
      text: buildNewsletterSignupText(email, ip),
      html: buildNewsletterSignupHtml(email, ip),
      replyTo: email,
      logLabel: 'NEWSLETTER SIGNUP',
    }),
    sendNotificationEmail({
      from: teamFrom,
      to: email,
      subject: copy.subject,
      text: buildNewsletterConfirmationText(email, locale),
      html: buildNewsletterConfirmationHtml(email, locale),
      replyTo: salesReply,
      logLabel: 'NEWSLETTER CONFIRMATION',
    }),
  ]);
}
