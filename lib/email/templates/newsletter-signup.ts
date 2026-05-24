import {
  renderEmailLayout,
  renderFieldRow,
  renderFieldsTable,
} from '@/lib/email/layout';

export function buildNewsletterSignupText(email: string, ip: string): string {
  return `New newsletter subscription

Email: ${email}
Time: ${new Date().toISOString()}
IP: ${ip}
`.trim();
}

export function buildNewsletterSignupHtml(email: string, ip: string): string {
  const rows = renderFieldsTable(
    [
      renderFieldRow('Subscriber email', email, {href: `mailto:${email}`}),
      renderFieldRow('IP address', ip),
    ].join('')
  );

  const bodyHtml = `
    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3d3a35;">
      Someone subscribed to your website newsletter. Add them to your mailing list or CRM.
    </p>
    ${rows}
  `;

  return renderEmailLayout({
    badge: 'Newsletter',
    title: 'New subscriber',
    preheader: email,
    bodyHtml,
  });
}
