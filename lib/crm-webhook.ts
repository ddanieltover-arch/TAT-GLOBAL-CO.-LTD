import type {ContactRequest, QuoteServerValues} from '@/lib/schema';
import {getSiteUrl} from '@/lib/site-url';

export type CrmLeadType = 'quote' | 'contact';

export type CrmWebhookPayload = {
  source: 'tat-global-website';
  siteUrl: string;
  type: CrmLeadType;
  submittedAt: string;
  lead: Record<string, unknown>;
};

const WEBHOOK_TIMEOUT_MS = 8_000;

function resolveWebhookUrl(type: CrmLeadType): string | null {
  const specific =
    type === 'quote'
      ? process.env.CRM_QUOTE_WEBHOOK_URL?.trim()
      : process.env.CRM_CONTACT_WEBHOOK_URL?.trim();
  const shared = process.env.CRM_WEBHOOK_URL?.trim();
  return specific || shared || null;
}

/**
 * POST structured lead JSON to CRM (Zapier, HubSpot, Make, etc.).
 * No-op when webhook URL env is unset. Never throws — logs failures only.
 */
export async function sendCrmWebhook(payload: CrmWebhookPayload): Promise<void> {
  const url = resolveWebhookUrl(payload.type);
  if (!url) {
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'TAT-Global-Website/1.0',
  };

  const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
    headers['X-Webhook-Secret'] = secret;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      console.error(
        `[crm-webhook:${payload.type}]`,
        response.status,
        response.statusText,
        body.slice(0, 500)
      );
    }
  } catch (error) {
    console.error(`[crm-webhook:${payload.type}]`, error);
  } finally {
    clearTimeout(timeout);
  }
}

export function buildQuoteCrmPayload(
  data: QuoteServerValues,
  file?: {name: string; size: number; type: string}
): CrmWebhookPayload {
  return {
    source: 'tat-global-website',
    siteUrl: getSiteUrl(),
    type: 'quote',
    submittedAt: new Date().toISOString(),
    lead: {
      fullName: data.fullName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      country: data.country,
      productInterested: data.productInterested,
      quantityRequired: data.quantityRequired,
      packagingPreference: data.packagingPreference,
      deliveryDestination: data.deliveryDestination,
      message: data.message,
      preferredContact: data.preferredContact ?? null,
      purchaseTimeline: data.purchaseTimeline ?? null,
      gdprConsent: data.gdprConsent,
      hasAttachment: Boolean(file),
      attachmentFilename: file?.name ?? null,
      attachmentSizeBytes: file?.size ?? null,
      attachmentContentType: file?.type ?? null,
    },
  };
}

export function buildContactCrmPayload(data: ContactRequest): CrmWebhookPayload {
  return {
    source: 'tat-global-website',
    siteUrl: getSiteUrl(),
    type: 'contact',
    submittedAt: new Date().toISOString(),
    lead: {
      fullName: data.fullName,
      companyName: data.companyName,
      email: data.email,
      message: data.message,
      gdprConsent: data.gdprConsent,
    },
  };
}
