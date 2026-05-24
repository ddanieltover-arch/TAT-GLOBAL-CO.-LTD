---
name: tat-global-rice-website
description: "Build the complete premium B2B website for TAT GLOBAL CO., LTD — a Thailand-based bulk rice manufacturing and export company. Use this skill whenever the user wants to build, scaffold, design, update, or extend ANY part of the TAT Global website (tatglcoltd.com). Triggers include homepage, product pages, quote request system, language switcher, packaging/logistics, quality assurance, export markets, testimonials, footer, floating WhatsApp button, or any UI component. Also trigger for 'build the rice website', 'create the B2B rice site', 'add a new rice product', or 'update the quote form'. Covers the full Next.js + Tailwind + Framer Motion stack, multilingual support (EN/TH), quote modal, product catalog, and all 10+ homepage sections. Always use for any task related to tatglcoltd.com or TAT Global Co., Ltd."
---

# TAT GLOBAL CO., LTD — Premium B2B Rice Export Website

## Company Brief

| Field | Value |
|---|---|
| Company | TAT GLOBAL CO., LTD |
| Website | tatglcoltd.com |
| Email | sales@tatglcoltd.com |
| Industry | Bulk Rice Manufacturing & Distribution |
| Location | Thailand |
| Conversion Goal | "REQUEST A QUOTE" (no cart, no checkout, no prices) |

---

## Tech Stack

```
Framework:     Next.js 14 (App Router)
Styling:       Tailwind CSS v3
Animation:     Framer Motion
CMS:           Optional — structure for Sanity or Contentful
i18n:          next-intl (EN + TH)
Forms:         React Hook Form + Zod validation
Email:         Resend or Nodemailer
Maps:          react-simple-maps (export market globe)
Icons:         Lucide React
Fonts:         Playfair Display (headings) + DM Sans (body)
Images:        Next/Image with lazy loading
SEO:           next-seo or built-in Next.js metadata API
```

---

## Design System

### Colors (CSS Variables)
```css
--color-primary:     #1a4a2e;   /* Deep forest green */
--color-primary-dark:#0d2e1a;   /* Darker green */
--color-gold:        #c9a84c;   /* Gold accent */
--color-gold-light:  #e8c97a;   /* Light gold */
--color-white:       #ffffff;
--color-cream:       #f9f7f2;   /* Warm off-white bg */
--color-gray-100:    #f3f1ec;
--color-gray-400:    #9a9590;
--color-gray-700:    #3d3a35;
--color-gray-900:    #1a1814;
```

### Typography
```
Display:  Playfair Display — for hero headlines, section titles
Body:     DM Sans — for all body text, navigation, UI labels
Mono:     JetBrains Mono — for spec tables, technical data
```

### Spacing / Breakpoints
Follow standard Tailwind breakpoints: sm(640), md(768), lg(1024), xl(1280), 2xl(1536)

### Aesthetic Direction
- **Luxury agricultural-industrial**: Think premium commodity trading, not grocery store
- Gold rule lines between sections
- Subtle grain texture overlays (SVG noise filter or CSS background)
- Full-bleed hero with cinematic overlay gradient
- Card shadows: `0 4px 24px rgba(26,74,46,0.08)`
- Hover states: gold border-left accent or lift + shadow
- Scroll-triggered fade-in for all major sections (Framer Motion `whileInView`)

---

## Monorepo Structure

```
tatglcoltd/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    ← Homepage
│   │   ├── about/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx                ← Product listing
│   │   │   └── [slug]/page.tsx         ← Product detail
│   │   ├── quality/page.tsx
│   │   ├── packaging/page.tsx
│   │   ├── markets/page.tsx
│   │   ├── faq/page.tsx
│   │   └── contact/page.tsx
│   └── api/
│       ├── quote/route.ts              ← Quote form handler
│       └── newsletter/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── TopBar.tsx
│   │   ├── MobileNav.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── TrustBar.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProductCategories.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── QualitySection.tsx
│   │   ├── PackagingSection.tsx
│   │   ├── ExportMarkets.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTASection.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilter.tsx
│   │   └── ProductSearch.tsx
│   ├── quote/
│   │   ├── QuoteModal.tsx
│   │   └── QuoteForm.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── GoldDivider.tsx
│   │   └── ScrollReveal.tsx
│   └── floating/
│       ├── WhatsAppButton.tsx
│       └── StickyQuoteCTA.tsx
├── lib/
│   ├── products.ts                     ← Product data / CMS fetcher
│   ├── translations.ts
│   └── schema.ts                       ← Zod schemas
├── messages/
│   ├── en.json
│   └── th.json
├── public/
│   ├── images/
│   └── catalog/
│       └── TAT-Global-Catalog.pdf
└── middleware.ts                        ← i18n routing
```

---

## Homepage Sections (10 required)

### Section 1 — Hero
```tsx
// Full-bleed cinematic hero, min-height: 100vh
// Background: high-res rice field / grain texture image
// Dark green gradient overlay: from-primary-dark/80 to-primary/40
// Content centered or left-aligned

<Hero>
  <eyebrow>Thailand's Premier Bulk Rice Exporter</eyebrow>
  <h1>Premium Thai Rice Manufacturer & Global Bulk Supplier</h1>
  <p>Delivering world-class rice varieties to importers across 40+ countries. MOQ-flexible. Export-certified. Supply-chain reliable.</p>
  <CTAGroup>
    <Button variant="gold">Request a Quote</Button>
    <Button variant="outline-white">View Products</Button>
  </CTAGroup>
  <ScrollIndicator />
</Hero>
```

### Section 2 — Trust Bar (animated counters)
```tsx
// 6 stats in a horizontal strip, dark green bg, gold numbers
const stats = [
  { label: "Years Experience", value: 20, suffix: "+" },
  { label: "Export Countries", value: 40, suffix: "+" },
  { label: "MT Annual Capacity", value: 50000, suffix: "+" },
  { label: "Rice Varieties", value: 12, suffix: "" },
  { label: "Quality Certifications", value: 8, suffix: "" },
  { label: "Response Time", value: 24, suffix: "h" },
]
```

### Section 3 — About (alternating image/text layout)
- Manufacturing capacity overview
- Export certifications
- Thailand sourcing story
- CTA to full About page

### Section 4 — Product Categories (card grid)
See → `references/products.md` for all 7 product types with full specs

### Section 5 — Why Choose Us (icon grid)
```tsx
const reasons = [
  { icon: Leaf, title: "Thailand Origin", desc: "..." },
  { icon: Shield, title: "Quality Certified", desc: "..." },
  { icon: Package, title: "Flexible Packaging", desc: "..." },
  { icon: Globe, title: "Global Logistics", desc: "..." },
  { icon: Clock, title: "Reliable Supply", desc: "..." },
  { icon: Handshake, title: "Long-term Partnerships", desc: "..." },
]
```

### Section 6 — Quality Assurance (process timeline)
Steps: Sourcing → Milling → Grading → Inspection → Certification → Export

### Section 7 — Packaging & Logistics (visual specs)
- Bag sizes: 5kg, 10kg, 25kg, 50kg PP bags
- Jumbo bags: 1MT big bags
- Private label / custom printing available
- Container loading: 20ft (20MT), 40ft (27MT)

### Section 8 — Export Markets (world region grid or SVG map)
Regions: Southeast Asia, Middle East, Africa, Europe, North America, South Asia

### Section 9 — Testimonials (carousel, 3 cards)
B2B testimonials from importers / food distributors

### Section 10 — CTA Section
```tsx
// Full-width dark green section
<h2>Looking for a Reliable Thai Rice Supplier?</h2>
<p>Get competitive bulk pricing, flexible MOQ, and fast turnaround.</p>
<Button variant="gold" onClick={openQuoteModal}>Request a Quote</Button>
<Button variant="outline">Contact Sales Team</Button>
```

---

## Quote Request System

### Trigger Points
- Header "Request a Quote" button
- Every product card "Request Quote" button  
- Every product detail page sticky CTA
- Homepage CTA section
- Contact page

### Modal Architecture
```tsx
// QuoteModal.tsx — slide-up panel or centered modal with backdrop blur
// State managed via Zustand or React Context (QuoteModalContext)

interface QuoteFormData {
  // Required
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  productInterested: string;   // pre-filled if opened from product page
  quantityRequired: string;
  packagingPreference: string;
  deliveryDestination: string;
  message: string;
  
  // Optional
  fileAttachment?: File;
  preferredContact?: 'email' | 'whatsapp' | 'phone';
  purchaseTimeline?: string;
  
  // Compliance
  gdprConsent: boolean;
}
```

### Form Validation (Zod)
```ts
const quoteSchema = z.object({
  fullName: z.string().min(2),
  companyName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  country: z.string().min(2),
  productInterested: z.string().min(1),
  quantityRequired: z.string().min(1),
  message: z.string().min(10),
  gdprConsent: z.literal(true),
})
```

### API Route
```ts
// app/api/quote/route.ts
// POST → validate → send email via Resend → webhook to CRM → return 200
// Anti-spam: rate limiting + honeypot field + reCAPTCHA v3 (optional)
```

---

## Header Structure

```tsx
// TopBar (hidden on mobile)
<TopBar>
  <span>📧 sales@tatglcoltd.com</span>
  <span>🌍 Exporting to 40+ Countries</span>
  <LanguageSwitcher>EN | TH</LanguageSwitcher>
</TopBar>

// Main Nav
<nav>
  Home | About Us | Products | Quality | Packaging & Logistics | Export Markets | FAQ | Contact
  <Button>Request a Quote →</Button>
</nav>
```

Navigation is sticky with backdrop-blur on scroll. Mobile: hamburger menu with full-screen slide-down.

---

## Product Catalog

See `references/products.md` for full specs of all 7 rice varieties.

**Product Card** (grid layout, 3 columns desktop / 2 tablet / 1 mobile):
```tsx
<ProductCard>
  <Image />       {/* lazy loaded */}
  <Badge>In Stock</Badge>
  <h3>Jasmine Rice (Hom Mali)</h3>
  <p>Fragrant long-grain rice, 100% Thai origin...</p>
  <specs>Grain: Long | Moisture: ≤14% | Broken: 5%</specs>
  <packagingBadges>5kg | 25kg | 50kg | Bulk</packagingBadges>
  <actions>
    <Link href="/products/jasmine-rice">View Details →</Link>
    <Button onClick={() => openQuote('Jasmine Rice')}>Request Quote</Button>
  </actions>
</ProductCard>
```

**Product Detail Page** must include:
- Hero image gallery (3-5 images)
- Full description
- Technical spec table (grain length, broken %, moisture, whiteness, etc.)
- Packaging options
- MOQ info
- Storage & shipping info
- Sticky sidebar: "Request Quote" always visible
- Related products (3 cards)

**Filtering:** by variety, grain length, packaging type, availability

---

## i18n (Multilingual EN/TH)

```ts
// middleware.ts — next-intl middleware
// Locales: ['en', 'th'], defaultLocale: 'en'
// Routes: /en/products, /th/products

// messages/en.json structure:
{
  "nav": { "home": "Home", "products": "Products", ... },
  "hero": { "headline": "Premium Thai Rice Manufacturer...", ... },
  "quote": { "title": "Request a Quote", "submit": "Send Inquiry", ... },
  "products": { "jasmine": { "name": "Jasmine Rice", "desc": "..." }, ... }
}
```

Language switcher in TopBar: clicking `TH` redirects to `/th/[current-path]`

---

## SEO Configuration

```ts
// Per-page metadata in each page.tsx
export const metadata: Metadata = {
  title: "Thailand Rice Supplier | Bulk Rice Exporter | TAT Global",
  description: "TAT Global Co., Ltd — premium Thai jasmine rice manufacturer and bulk rice exporter. Supplying importers, distributors, and wholesalers in 40+ countries.",
  keywords: ["Thailand rice supplier", "bulk rice distributor", "Thai jasmine rice exporter", ...],
  openGraph: { ... },
  alternates: { canonical: "https://tatglcoltd.com", languages: { "th": "/th" } }
}

// JSON-LD structured data
{
  "@type": "Organization",
  "name": "TAT Global Co., Ltd",
  "url": "https://tatglcoltd.com",
  "contactPoint": { "email": "sales@tatglcoltd.com" }
}
```

---

## Floating / Persistent UX

```tsx
// WhatsApp floating button (bottom-right, always visible)
<FloatingWhatsApp phone="+66829600612" message="Hello, I'm interested in bulk rice..." />

// Sticky Quote CTA bar (appears after scrolling 300px, slides up from bottom on mobile)
<StickyQuoteCTA>
  <span>Ready to order? Talk to our export team.</span>
  <Button>Request Quote →</Button>
</StickyQuoteCTA>

// Cookie consent banner (GDPR compliant)
<CookieConsent />
```

---

## Performance Requirements

- Next/Image for ALL images with width/height + priority on hero
- Lazy load all below-fold images
- Dynamic imports for heavy components (QuoteModal, Map)
- No layout shift (CLS = 0)
- Target: Lighthouse > 90 on all metrics

---

## DO NOT INCLUDE

- ❌ Shopping cart / basket
- ❌ Checkout flow
- ❌ Product prices
- ❌ Customer purchase accounts
- ❌ Stock quantity numbers
- ❌ Retail / consumer UX patterns
- ❌ PayPal / Stripe / payment integrations

---

## Implementation Order (recommended)

1. Project scaffolding + design tokens + fonts
2. Layout: TopBar + Header + Footer
3. QuoteModal (global, works from anywhere)
4. Homepage (all 10 sections)
5. Product listing page + filters
6. Product detail page
7. About / Quality / Packaging / Markets pages
8. i18n (EN/TH)
9. API routes (quote handler, newsletter)
10. SEO metadata + structured data
11. Floating UX (WhatsApp, sticky CTA, cookie consent)
12. Performance audit + accessibility pass

---

## Reference Files

- `references/products.md` — All 7 rice product specs, descriptions, technical data
- `references/copy.md` — Full website copy in EN (headlines, body text, CTAs, testimonials)
- `references/translations.md` — Thai translations for all UI strings

Read these files when generating specific pages or components that need product data or copy.
