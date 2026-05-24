# Product catalog PDF

The downloadable brochure is generated from product data in the repo.

## Regenerate after product updates

```bash
npm run generate:catalog
```

This writes `TAT-Global-Catalog.pdf` in this folder. Commit the updated PDF when product specs change.

To use a designer-produced PDF instead, replace `TAT-Global-Catalog.pdf` directly (keep the same filename so footer links keep working).
