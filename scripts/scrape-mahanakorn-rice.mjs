const urls = [
  "https://mahanakornco.com/product/1121-sella-basmati-rice/",
  "https://mahanakornco.com/product/arborio-rice/",
  "https://mahanakornco.com/product/irri-6-long-grain-riceirri-6-long-grain-rice/",
  "https://mahanakornco.com/product/japonica-rice/",
  "https://mahanakornco.com/product/jasmine-rice-thai-hom-mali/",
  "https://mahanakornco.com/product/parboiled-rice-5-broken/",
  "https://mahanakornco.com/product/quality-brown-rice/",
  "https://mahanakornco.com/product/rri-9-long-grain-ricerri-9-long-grain-rice/",
  "https://mahanakornco.com/product/thai-brown-jasmine-rice/",
  "https://mahanakornco.com/product/thai-glutinous-rice/",
  "https://mahanakornco.com/product/thai-glutinous-rice-25-broken/",
  "https://mahanakornco.com/product/thai-hom-patum-rice/",
  "https://mahanakornco.com/product/thai-jasmine-black-cargo-rice/",
  "https://mahanakornco.com/product/thai-jasmine-red-cargo-rice/",
  "https://mahanakornco.com/product/thai-long-grain-rice/",
  "https://mahanakornco.com/product/thai-parboiled-rice/",
  "https://mahanakornco.com/product/thai-riceberry-rice/",
  "https://mahanakornco.com/product/thai-white-rice-10-broken/",
  "https://mahanakornco.com/product/thai-white-rice-100-broken/",
  "https://mahanakornco.com/product/thai-white-rice-100-sortexed/",
  "https://mahanakornco.com/product/thai-white-rice-25-broken/",
  "https://mahanakornco.com/product/white-rice-5-broken/",
];

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#038;/g, "&");
}

function stripHtml(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

function extractSection(html, pattern) {
  const match = html.match(pattern);
  return match ? stripHtml(match[1]) : "";
}

async function scrape(url) {
  const res = await fetch(url);
  const html = await res.text();

  const name =
    extractSection(html, /<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
    extractSection(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);

  const shortDescription = extractSection(
    html,
    /class="woocommerce-product-details__short-description"[^>]*>([\s\S]*?)<\/(?:div|motion\.motion)>/i,
  );

  const fullDescription =
    extractSection(html, /id="tab-description"[^>]*>([\s\S]*?)<\/motion\.motion>/i) ||
    extractSection(html, /id="tab-description"[^>]*>([\s\S]*?)<\/div>/i) ||
    shortDescription;

  const slug = url.replace(/\/$/, "").split("/").pop();

  return {
    slug,
    name,
    shortDescription,
    fullDescription,
    sourceUrl: url,
  };
}

const products = [];
for (const url of urls) {
  const product = await scrape(url);
  products.push(product);
  console.error(`Scraped: ${product.name}`);
}

console.log(JSON.stringify(products, null, 2));
