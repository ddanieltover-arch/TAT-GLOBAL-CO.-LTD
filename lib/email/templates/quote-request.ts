import type {QuoteServerValues} from '@/lib/schema';
import {
  renderEmailLayout,
  renderFieldRow,
  renderFieldsTable,
  renderMessageBlock,
} from '@/lib/email/layout';

export type QuoteEmailMeta = {
  attachmentName?: string;
};

export function buildQuoteRequestText(data: QuoteServerValues, meta?: QuoteEmailMeta): string {
  return `
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
Attachment: ${meta?.attachmentName || 'None'}

Message:
${data.message}
`.trim();
}

export function buildQuoteRequestHtml(data: QuoteServerValues, meta?: QuoteEmailMeta): string {
  const contactRows = renderFieldsTable(
    [
      renderFieldRow('Full name', data.fullName),
      renderFieldRow('Company', data.companyName),
      renderFieldRow('Email', data.email, {href: `mailto:${data.email}`}),
      renderFieldRow('Phone', data.phone, {href: `tel:${data.phone.replace(/\s/g, '')}`}),
      renderFieldRow('WhatsApp', data.whatsapp),
      renderFieldRow('Country', data.country),
    ].join('')
  );

  const orderRows = renderFieldsTable(
    [
      renderFieldRow('Product', data.productInterested),
      renderFieldRow('Quantity', data.quantityRequired),
      renderFieldRow('Packaging', data.packagingPreference),
      renderFieldRow('Delivery to', data.deliveryDestination),
      renderFieldRow('Preferred contact', data.preferredContact || '—'),
      renderFieldRow('Timeline', data.purchaseTimeline || '—'),
      renderFieldRow('Attachment', meta?.attachmentName || 'None'),
    ].join('')
  );

  const bodyHtml = `
    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3d3a35;">
      A new <strong>quote request</strong> was submitted. Review the details below and follow up within 24 hours.
    </p>
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9a9590;">Contact</p>
    ${contactRows}
    <p style="margin:24px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#9a9590;">Order details</p>
    ${orderRows}
    ${renderMessageBlock('Requirements & message', data.message)}
  `;

  return renderEmailLayout({
    badge: 'Quote Request',
    title: `Quote from ${data.companyName}`,
    preheader: `${data.productInterested} · ${data.quantityRequired} · ${data.country}`,
    bodyHtml,
    footerNote: 'Reply directly to this email to reach the buyer.',
  });
}
