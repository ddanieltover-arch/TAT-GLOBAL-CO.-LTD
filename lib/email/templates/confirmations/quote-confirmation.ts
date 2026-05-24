import {getConfirmationCopy} from '@/lib/email/confirmations/copy';
import {getEmailSiteUrl} from '@/lib/email/brand';
import type {AppLocale} from '@/lib/translations';
import type {QuoteServerValues} from '@/lib/schema';
import {
  renderCtaRow,
  renderEmailLayout,
  renderFieldRow,
  renderFieldsTable,
  renderParagraphHtml,
  renderSectionHeading,
} from '@/lib/email/layout';

export function buildQuoteConfirmationText(data: QuoteServerValues, locale: AppLocale): string {
  const c = getConfirmationCopy(locale).quote;
  const f = c.fields;
  return `${c.title(data.fullName)}

${c.intro}

${c.summaryTitle}
${f.company}: ${data.companyName}
${f.product}: ${data.productInterested}
${f.quantity}: ${data.quantityRequired}
${f.packaging}: ${data.packagingPreference}
${f.destination}: ${data.deliveryDestination}

${c.nextSteps.replace(/<[^>]+>/g, '')}

${getEmailSiteUrl()}
sales@tatglcoltd.com
`.trim();
}

export function buildQuoteConfirmationHtml(data: QuoteServerValues, locale: AppLocale): string {
  const c = getConfirmationCopy(locale).quote;
  const f = c.fields;
  const siteUrl = getEmailSiteUrl();

  const bodyHtml = `
    ${renderParagraphHtml(c.intro)}
    ${renderParagraphHtml(c.nextSteps)}
    ${renderSectionHeading(c.summaryTitle)}
    ${renderFieldsTable(
      [
        renderFieldRow(f.company, data.companyName),
        renderFieldRow(f.product, data.productInterested),
        renderFieldRow(f.quantity, data.quantityRequired),
        renderFieldRow(f.packaging, data.packagingPreference),
        renderFieldRow(f.destination, data.deliveryDestination),
      ].join('')
    )}
    ${renderCtaRow({label: c.ctaProducts, href: `${siteUrl}/${locale}/products`})}
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
