# Lighthouse & accessibility audit

Target (from `SKILL.md`): **> 90** on Performance, Accessibility, Best Practices, and SEO.

## Run locally (production build)

```powershell
# Match canonical URL to the server you audit (required for SEO score on localhost)
$env:NEXT_PUBLIC_SITE_URL = "http://localhost:3031"
npm run build
npx next start -p 3031
# In another terminal:
npx lighthouse http://localhost:3031/en --preset=desktop --only-categories=performance,accessibility,best-practices,seo --output=html --output-path=lighthouse-report.html
```

Or: `npm run audit:lighthouse` (builds with production URL from env if set).

On **production**, set `NEXT_PUBLIC_SITE_URL=https://tatglcoltd.com` so canonicals, sitemap, and JSON-LD match the live domain.

## Implemented (step 12)

- Single document landmark: `#main-content` in locale layout (no nested `<main>`)
- Skip link, focus-visible rings, dialog focus trap + Escape (quote modal, mobile nav)
- WCAG 2.5.5 touch targets (`min-h-11` buttons, nav links, carousel dots)
- Valid list markup in quality timeline
- Form fields: `aria-invalid`, `aria-describedby`, `role="alert"` on errors
- Dynamic import: quote modal, homepage below-fold sections
- Hero image: `priority`, `fetchPriority="high"`, AVIF/WebP via `next/image`
- App icons (`app/icon.svg`, `app/apple-icon.svg`) — fixes favicon 404
- Cookie banner links to privacy policy

## Performance notes

- **Hero image** (`public/images/hero.jpg`) should be **&lt; 250 KB** after export (current source may be ~900 KB). Next.js serves optimized formats, but a smaller source improves LCP on cold starts.
- Lighthouse on `localhost` often scores Performance lower than Vercel/production CDN.
- Re-run after replacing brand photography and before launch.

## Latest local production run (reference)

Desktop (`http://localhost:3031/en`, `NEXT_PUBLIC_SITE_URL` set to match):

| Category        | Score |
|-----------------|-------|
| Performance     | **97** |
| Accessibility   | **100** |
| Best Practices  | **100** |
| SEO             | **100** |

Mobile (Lighthouse throttled 4G): Performance ~55–60, Accessibility **100**. Animated home + Framer Motion increases mobile TBT/LCP; scores typically improve on Vercel/CDN. Further gains: keep `hero.jpg` under ~200 KB (`npm run optimize:images`).

## Commands

```bash
npm run optimize:images   # Re-compress public/images JPGs (requires sharp)
```
