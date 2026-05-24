import {getConfirmationCopy} from '@/lib/email/confirmations/copy';
import {getEmailSiteUrl} from '@/lib/email/brand';
import type {AppLocale} from '@/lib/translations';
import {
  renderCtaRow,
  renderEmailLayout,
  renderParagraphHtml,
} from '@/lib/email/layout';

export function buildNewsletterConfirmationText(email: string, locale: AppLocale): string {
  const c = getConfirmationCopy(locale).newsletter;
  return `${c.title}

${c.intro}

${c.body}

${getEmailSiteUrl()}
`.trim();
}

export function buildNewsletterConfirmationHtml(email: string, locale: AppLocale): string {
  const c = getConfirmationCopy(locale).newsletter;
  const siteUrl = getEmailSiteUrl();

  const bodyHtml = `
    ${renderParagraphHtml(c.intro)}
    ${renderParagraphHtml(c.body)}
    ${renderCtaRow({label: c.ctaProducts, href: `${siteUrl}/${locale}/products`})}
  `;

  return renderEmailLayout({
    badge: c.badge,
    title: c.title,
    preheader: c.preheader,
    bodyHtml,
    footerNote: c.footer,
    audience: 'customer',
    lang: locale,
  });
}
