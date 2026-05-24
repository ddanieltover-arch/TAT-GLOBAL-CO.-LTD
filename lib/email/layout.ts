import {emailBrand, getEmailSiteUrl} from '@/lib/email/brand';
import {getEmailLogoSrc} from '@/lib/email/logo-inline';
import {escapeHtml} from '@/lib/email/escape-html';

export type EmailLayoutOptions = {
  /** Short label shown in the header badge, e.g. "Quote Request" */
  badge: string;
  /** Main heading inside the email body */
  title: string;
  /** Preview text for inbox snippets */
  preheader: string;
  /** Inner HTML for the white content card */
  bodyHtml: string;
  /** Optional footer note (plain sentence) */
  footerNote?: string;
  /** Customer confirmations use a friendlier footer */
  audience?: 'team' | 'customer';
  /** HTML lang attribute */
  lang?: string;
};

function formatSubmittedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Bangkok',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * Table-based, inline-styled layout for broad email client support.
 */
export function renderEmailLayout(opts: EmailLayoutOptions, submittedAt = new Date().toISOString()): string {
  const siteUrl = getEmailSiteUrl();
  const logoSrc = getEmailLogoSrc();
  const badge = escapeHtml(opts.badge);
  const title = escapeHtml(opts.title);
  const preheader = escapeHtml(opts.preheader);
  const footerNote = opts.footerNote ? escapeHtml(opts.footerNote) : '';
  const when = escapeHtml(formatSubmittedAt(submittedAt));
  const lang = escapeHtml(opts.lang || 'en');
  const isCustomer = opts.audience === 'customer';
  const footerLead = isCustomer
    ? footerNote || 'TAT GLOBAL CO., LTD — Bangkok, Thailand'
    : `Received ${when} (Bangkok)${footerNote ? `<br /><span style="color:${emailBrand.goldLight};">${footerNote}</span>` : ''}`;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${title}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${emailBrand.cream};font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${emailBrand.cream};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, ${emailBrand.primaryDark} 0%, ${emailBrand.primary} 100%);border-radius:12px 12px 0 0;padding:28px 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-bottom:16px;">
                    <img src="${logoSrc}" width="56" height="56" alt="TAT Global" style="display:block;border:0;border-radius:50%;background:${emailBrand.white};" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${emailBrand.goldLight};background:rgba(255,255,255,0.12);padding:6px 12px;border-radius:999px;border:1px solid ${emailBrand.gold};">${badge}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;">
                    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;line-height:1.25;color:${emailBrand.white};">${title}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;">
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.85);">TAT GLOBAL CO., LTD &mdash; Premium Thai Rice Exports</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Gold accent -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, ${emailBrand.gold} 0%, ${emailBrand.goldLight} 50%, ${emailBrand.gold} 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <!-- Body card -->
          <tr>
            <td style="background-color:${emailBrand.white};padding:32px;border-left:1px solid ${emailBrand.border};border-right:1px solid ${emailBrand.border};">
              ${opts.bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:${emailBrand.primaryDark};border-radius:0 0 12px 12px;padding:24px 32px;border:1px solid ${emailBrand.primaryDark};">
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:rgba(255,255,255,0.75);">
                ${footerLead}
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
                <a href="${siteUrl}" style="color:${emailBrand.goldLight};text-decoration:none;font-weight:600;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:sales@tatglcoltd.com" style="color:${emailBrand.goldLight};text-decoration:none;">sales@tatglcoltd.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderFieldRow(label: string, value: string, options?: {href?: string}): string {
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value || '—');
  const valueCell = options?.href
    ? `<a href="${escapeHtml(options.href)}" style="color:${emailBrand.primary};text-decoration:none;font-weight:600;">${safeValue}</a>`
    : `<span style="color:${emailBrand.text};">${safeValue}</span>`;

  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${emailBrand.border};vertical-align:top;width:38%;">
        <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${emailBrand.textMuted};">${safeLabel}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${emailBrand.border};vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;">
        ${valueCell}
      </td>
    </tr>`;
}

export function renderMessageBlock(label: string, message: string): string {
  const safeLabel = escapeHtml(label);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
      <tr>
        <td style="padding-bottom:8px;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${emailBrand.textMuted};">${safeLabel}</span>
        </td>
      </tr>
      <tr>
        <td style="background-color:${emailBrand.cream};border-left:4px solid ${emailBrand.gold};border-radius:0 8px 8px 0;padding:16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${emailBrand.text};">
          ${safeMessage}
        </td>
      </tr>
    </table>`;
}

export function renderFieldsTable(rowsHtml: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${rowsHtml}
    </table>`;
}

export function renderCtaRow(primary: {label: string; href: string}, secondary?: {label: string; href: string}): string {
  const primaryBtn = `
    <a href="${escapeHtml(primary.href)}" style="display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:${emailBrand.primaryDark};text-decoration:none;background:linear-gradient(180deg, ${emailBrand.goldLight} 0%, ${emailBrand.gold} 100%);padding:14px 28px;border-radius:8px;border:1px solid ${emailBrand.gold};">
      ${escapeHtml(primary.label)}
    </a>`;

  const secondaryBtn = secondary
    ? `
    <a href="${escapeHtml(secondary.href)}" style="display:inline-block;margin-left:12px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:${emailBrand.primary};text-decoration:none;padding:14px 20px;border-radius:8px;border:1px solid ${emailBrand.border};">
      ${escapeHtml(secondary.label)}
    </a>`
    : '';

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
      <tr>
        <td align="center">
          ${primaryBtn}${secondaryBtn}
        </td>
      </tr>
    </table>`;
}

export function renderParagraphHtml(html: string): string {
  return `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${emailBrand.text};">${html}</p>`;
}

export function renderSectionHeading(text: string): string {
  return `<p style="margin:24px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${emailBrand.textMuted};">${escapeHtml(text)}</p>`;
}
