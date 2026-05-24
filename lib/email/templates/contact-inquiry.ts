import type {ContactRequest} from '@/lib/schema';
import {
  renderEmailLayout,
  renderFieldRow,
  renderFieldsTable,
  renderMessageBlock,
} from '@/lib/email/layout';

export function buildContactInquiryText(data: ContactRequest): string {
  return `
New contact page inquiry from ${data.fullName}

Company: ${data.companyName}
Email: ${data.email}

Message:
${data.message}
`.trim();
}

export function buildContactInquiryHtml(data: ContactRequest): string {
  const rows = renderFieldsTable(
    [
      renderFieldRow('Full name', data.fullName),
      renderFieldRow('Company', data.companyName),
      renderFieldRow('Email', data.email, {href: `mailto:${data.email}`}),
    ].join('')
  );

  const bodyHtml = `
    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3d3a35;">
      A new message was submitted through the <strong>Contact</strong> page on your website.
    </p>
    ${rows}
    ${renderMessageBlock('Message', data.message)}
  `;

  return renderEmailLayout({
    badge: 'Contact Inquiry',
    title: `Message from ${data.fullName}`,
    preheader: `${data.companyName} — ${data.email}`,
    bodyHtml,
    footerNote: 'Reply directly to this email to reach the sender.',
  });
}
