# Environment configuration

Copy the template and fill in secrets **before** going live:

```bash
cp .env.example .env.local
```

Then run:

```bash
npm run check:env
```

Restart the dev server after any `.env.local` change (`npm run dev`).

---

## Required for production (live email)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Sends quote, contact, and newsletter mail via [Resend](https://resend.com) |
| `QUOTE_FROM_EMAIL` | Verified sender, e.g. `TAT Global <notifications@tatglcoltd.com>` |

Without `RESEND_API_KEY`, form submissions are **accepted** but only **logged to the server console** — no email is delivered.

---

## Required at build time (WhatsApp + SEO)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Floating WhatsApp button + contact page link. Example: `+66829600612` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph. Example: `https://tatglcoltd.com` |

`NEXT_PUBLIC_*` variables are embedded at **`npm run build`**. On Vercel/Netlify, set them in the host dashboard **before** deploying.

If `NEXT_PUBLIC_WHATSAPP_PHONE` is unset, the site falls back to **+66 82 960 0612** (`66829600612`).

---

## Recommended

| Variable | Default if unset |
|----------|-------------------|
| `QUOTE_TO_EMAIL` | `sales@tatglcoltd.com` |
| `CONTACT_TO_EMAIL` | same as `QUOTE_TO_EMAIL` |
| `NEWSLETTER_TO_EMAIL` | same as quote inbox |

---

## Optional

| Variable | Purpose |
|----------|---------|
| `CRM_WEBHOOK_URL` | POST lead JSON to Zapier / Make / HubSpot after email |
| `CRM_WEBHOOK_SECRET` | Bearer token for webhook auth |
| `SMTP_*` | Local dev fallback without Resend (not for production) |

---

## Vercel checklist

1. Project → **Settings** → **Environment Variables**
2. Add for **Production** (and Preview if needed):

```
RESEND_API_KEY=re_xxxxxxxx
QUOTE_FROM_EMAIL=TAT Global <notifications@tatglcoltd.com>
QUOTE_TO_EMAIL=sales@tatglcoltd.com
NEXT_PUBLIC_WHATSAPP_PHONE=+66829600612
NEXT_PUBLIC_SITE_URL=https://tatglcoltd.com
```

3. **Redeploy** after changing any `NEXT_PUBLIC_*` variable (rebuild required).

4. In Resend: verify domain `tatglcoltd.com` and use a `@tatglcoltd.com` from address.

---

## Verify locally

1. Set `.env.local` with your Resend test key and from address.
2. `npm run check:env` → should print `PASS`.
3. Submit the contact form → email arrives at `QUOTE_TO_EMAIL`.
4. WhatsApp button opens `wa.me/66829600612`.
