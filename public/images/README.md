# Brand images

Drop replacement photos here using the **same filenames** to update the live site.

## Folder structure

```
public/images/
├── logo.webp              ← company logo (header/footer)
├── logo-header.webp       ← compact header variant
├── logo.png               ← PNG master + JSON-LD
├── logo-email.png         ← small PNG embedded in transactional emails
├── about-banner.jpg       ← About page hero banner
├── quality-banner.jpg     ← Quality page hero banner
├── contact-banner.jpg     ← Contact page hero banner
├── hero.jpg               ← Legacy landscape hero (unused on homepage)
├── hero-desktop.jpg       ← Homepage hero (desktop ≥768px, interactive hotspots)
├── hero-mobile.jpg        ← Homepage hero (mobile ≤767px, interactive hotspots)
├── about.jpg
├── facility.jpg           ← gallery image 3 (milling & processing)
├── product-default.jpg
├── gallery/
│   ├── grains-closeup.jpg
│   ├── packaging-bags.jpg
│   └── export-ready.jpg
└── products/
    ├── jasmine-rice.jpg          ← category fallback
    ├── white-rice.jpg
    ├── long-grain-rice.jpg
    ├── broken-rice.jpg
    ├── glutinous-rice.jpg
    ├── parboiled-rice.jpg
    ├── premium-export-rice.jpg
    └── {slug}.webp               ← one per product (22 total)
```

| File | Used on |
|------|---------|
| `hero.jpg` | Homepage hero background (2400px wide recommended) |
| `about.jpg` | Homepage about section, product gallery |
| `facility.jpg` | About page banner, product gallery |
| `product-default.jpg` | Placeholder until a product photo is uploaded |
| `products/*.jpg` | Category fallbacks until each product has its own WebP |
| `products/{slug}.webp` | Dedicated product card & detail image |
| `gallery/grains-closeup.jpg` | Product detail gallery — grain close-up |
| `gallery/packaging-bags.jpg` | Product detail gallery — export bags |
| `gallery/export-ready.jpg` | Optional spare gallery asset |

## Product photos (22 items)

Each product can have **one WebP file** named after its URL slug:

```
public/images/products/jasmine-rice-thai-hom-mali.webp
public/images/products/white-rice-5-broken.webp
public/images/products/1121-sella-basmati-rice.webp
… etc.
```

Until a `{slug}.webp` exists, the site uses the matching category JPG above.

### Import a new product image

Send the image file, then run:

```bash
npm run import:product-image -- <slug> <path-to-png-or-jpg>
```

Example:

```bash
npm run import:product-image -- 1121-sella-basmati-rice "./1121 SELLA BASMATI RICE.png"
```

The script resizes (max 1200px), converts to WebP (~82% quality), and saves to `public/images/products/`.

### Restore category placeholders

If `public/images/products/*.jpg` are missing:

```bash
node scripts/restore-image-folders.mjs
```

## Guidelines

- **Format:** WebP for per-product photos; JPG for hero/about/facility/category fallbacks
- **Hero:** landscape, min. 1920×1080
- **Products:** square or 4:3, clean grain shots on neutral backgrounds
- **Target size:** &lt; 150 KB per product WebP after import
