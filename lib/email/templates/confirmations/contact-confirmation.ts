import {getConfirmationCopy} from '@/lib/email/confirmations/copy';
import {getEmailSiteUrl} from '@/lib/email/brand';
import type {AppLocale} from '@/lib/translations';
import type {ContactRequest} from '@/lib/schema';
import {
  renderCtaRow,
  renderEmailLayout,
  renderFieldRow,
  renderFieldsTable,
  renderMessageBlock,
  renderParagraphHtml,
  renderSectionHeading,
} from '@/lib/email/layout';

export function buildContactConfirmationText(data: ContactRequest, locale: AppLocale): string {
  const c = getConfirmationCopy(locale).contact;
  return `${c.title(data.fullName)}

${c.intro}

${c.summaryTitle}
Company: ${data.companyName}
${c.fieldMessage}:
${data.message}

${c.nextSteps.replace(/<[^>]+>/g, '')}

${getEmailSiteUrl()}
sales@tatglcoltd.com
`.trim();
}

export function buildContactConfirmationHtml(data: ContactRequest, locale: AppLocale): string {
  const c = getConfirmationCopy(locale).contact;
  const siteUrl = getEmailSiteUrl();

  const bodyHtml = `
    ${renderParagraphHtml(c.intro)}
    ${renderParagraphHtml(c.nextSteps)}
    ${renderSectionHeading(c.summaryTitle)}
    ${renderFieldsTable(
      [
        renderFieldRow('Company', data.companyName),
        renderFieldRow('Email', data.email, {href: `mailto:${data.email}`}),
      ].join('')
    )}
    ${renderMessageBlock(c.fieldMessage, data.message)}
    ${renderCtaRow(
      {label: c.ctaProducts, href: `${siteUrl}/${locale}/products`},
      {label: c.ctaContact, href: `${siteUrl}/${locale}/contact`}
    )}
  `;

  return renderEmailLayout({
    badge: c.badge,
    title: c.title(data.fullName),
    preheader: c.preheader,
    bodyHtml,
    footerNote: c.footer,
    audience: 'customer',
    lang: locale,
  });
}
