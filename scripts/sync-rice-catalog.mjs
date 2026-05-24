#!/usr/bin/env node
/**
 * Syncs 22 rice products from inline catalog data to lib/products.ts and messages/en.json, messages/th.json.
 * Run: node scripts/sync-rice-catalog.mjs
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/** @typedef {'jasmine'|'white'|'long-grain'|'broken'|'glutinous'|'parboiled'|'specialty'} ProductVariety */
/** @typedef {'long'|'short-medium'|'broken'|'mixed'} ProductGrain */
/** @typedef {'retail'|'25kg'|'50kg'|'jumbo'|'bulk'|'private-label'} ProductPackaging */

/**
 * @typedef {Object} LocaleBlock
 * @property {string} name
 * @property {string} shortDescription
 * @property {string} grainSpec
 * @property {string} moistureSpec
 * @property {string} brokenSpec
 * @property {string} fullDescription
 * @property {{attribute: string; value: string}[]} technicalSpecifications
 */

/**
 * @typedef {Object} RiceProduct
 * @property {string} slug
 * @property {boolean} featured
 * @property {ProductVariety} variety
 * @property {ProductGrain} grain
 * @property {string} [badge]
 * @property {string} [badgeTh]
 * @property {string[]} packaging
 * @property {ProductPackaging[]} packagingTypes
 * @property {string} moq
 * @property {string} [shipping]
 * @property {string} [storage]
 * @property {LocaleBlock} en
 * @property {LocaleBlock} th
 */

/** @type {RiceProduct[]} */
const RICE_PRODUCTS = [
  {
    slug: '1121-sella-basmati-rice',
    featured: false,
    variety: 'specialty',
    grain: 'long',
    packaging: ['25kg', '50kg', 'bulk'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: '1121 Sella Basmati Rice',
      shortDescription:
        'Long-grain marvel with elongated grains ideal for biryanis and pilafs. Distinct Basmati fragrance and non-sticky texture after cooking.',
      grainSpec: 'Grain Length: 8.2mm to 8.4mm',
      moistureSpec: 'Moisture: Optimal levels maintained',
      brokenSpec: 'Purity: Free from impurities, stones, and foreign matter',
      fullDescription:
        '1121 Sella Basmati Rice is a revered variant known for superior quality. Grains measure 8.2mm to 8.4mm for an extraordinary culinary experience, with captivating Basmati aroma and delicate, non-sticky texture post-cooking. TAT Global processes and curates each batch to preserve natural essence and nutritional richness, with rigorous quality control and export-ready inventory meeting international benchmarks.',
      technicalSpecifications: [
        {attribute: 'Variety', value: '1121 Sella Basmati Rice'},
        {attribute: 'Grain Length', value: '8.2mm to 8.4mm'},
        {attribute: 'Aroma', value: 'Distinct Basmati fragrance'},
        {attribute: 'Texture', value: 'Delicate, non-sticky post-cooking'},
        {attribute: 'Purity', value: 'Free from impurities, stones, and foreign matter'},
        {attribute: 'Moisture', value: 'Optimal levels maintained'},
      ],
    },
    th: {
      name: 'ข้าวบาสมาติ 1121 เซลลา',
      shortDescription:
        'ข้าวเจ้ายาวคุณภาพพรีเมียม เหมาะสำหรับบิรยานีและพิลาฟ มีกลิ่นหอมบาสมาติและเนื้อไม่เหนียวเมื่อหุงสุก',
      grainSpec: 'ความยาวเมล็ด: 8.2–8.4 มม.',
      moistureSpec: 'ความชื้น: ระดับที่เหมาะสม',
      brokenSpec: 'ความบริสุทธิ์: ปราศจากสิ่งเจือปน หิน และวัตถุแปลกปลอม',
      fullDescription:
        'ข้าวบาสมาติ 1121 เซลลา เป็นข้าวเกรดพรีเมียม เมล็ดยาว 8.2–8.4 มม. มีกลิ่นหอมบาสมาติชัดเจน เนื้อนุ่มไม่เหนียวเมื่อหุงสุก TAT Global คัดสรรและแปรรูปอย่างพิถีพิถันเพื่อรักษาคุณภาพและคุณค่าทางโภชนาการ พร้อมส่งออกตามมาตรฐานสากล',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: '1121 Sella Basmati Rice'},
        {attribute: 'ความยาวเมล็ด', value: '8.2–8.4 มม.'},
        {attribute: 'กลิ่นหอม', value: 'กลิ่นบาสมาติชัดเจน'},
        {attribute: 'เนื้อสัมผัส', value: 'นุ่ม ไม่เหนียวเมื่อหุงสุก'},
        {attribute: 'ความบริสุทธิ์', value: 'ปราศจากสิ่งเจือปน หิน และวัตถุแปลกปลอม'},
        {attribute: 'ความชื้น', value: 'ระดับที่เหมาะสม'},
      ],
    },
  },
  {
    slug: 'arborio-rice',
    featured: false,
    variety: 'specialty',
    grain: 'short-medium',
    packaging: ['25kg', '50kg'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: 'Arborio Rice',
      shortDescription:
        'Medium to short plump grains with pearly appearance. Moisture ≤14%, purity assured, uniform grain size. In stock ready to ship.',
      grainSpec: 'Grain Size: Medium to short, plump, rounded',
      moistureSpec: 'Moisture Content: ≤ 14%',
      brokenSpec: 'Foreign Matter: Nil',
      fullDescription:
        'Arborio Rice (Oryza sativa var. Arborio) features medium to short grains with a plump, rounded shape and distinct pearly appearance. Known for absorbing liquids while retaining a firm exterior and creamy interior when cooked — ideal for risotto and gourmet dishes. TAT Global supplies export-grade Arborio rice for restaurants, hotels, and food manufacturers.',
      technicalSpecifications: [
        {attribute: 'Variety', value: 'Arborio Rice (Oryza sativa var. Arborio)'},
        {attribute: 'Grain Size', value: 'Medium to short, plump, pearly'},
        {attribute: 'Texture', value: 'Firm exterior, creamy interior when cooked'},
        {attribute: 'Cooking Qualities', value: 'Ideal for risotto; releases starch'},
        {attribute: 'Moisture Content', value: '≤ 14%'},
        {attribute: 'Broken Grains', value: '< 5%'},
      ],
    },
    th: {
      name: 'ข้าวอาร์โบริโอ',
      shortDescription:
        'เมล็ดสั้นถึงกลาง รูปกลมมน มีประกายมุก ความชื้น ≤14% คุณภาพสม่ำเสมอ พร้อมส่ง',
      grainSpec: 'ขนาดเมล็ด: สั้นถึงกลาง กลมมน',
      moistureSpec: 'ความชื้น: ≤ 14%',
      brokenSpec: 'สิ่งแปลกปลอม: ไม่มี',
      fullDescription:
        'ข้าวอาร์โบริโอ เมล็ดสั้นถึงกลาง รูปกลมมน ดูดซับน้ำได้ดี เนื้อด้านนอกนุ่ม ด้านในนุ่มครีม เหมาะสำหรับริซอตโตและเมนูพรีเมียม TAT Global จัดหาเกรดส่งออกสำหรับร้านอาหารและโรงแปรรูป',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: 'Arborio Rice'},
        {attribute: 'ขนาดเมล็ด', value: 'สั้นถึงกลาง กลมมน'},
        {attribute: 'เนื้อสัมผัส', value: 'ด้านนอกแน่น ด้านในนุ่มครีม'},
        {attribute: 'การใช้งาน', value: 'เหมาะสำหรับริซอตโต'},
        {attribute: 'ความชื้น', value: '≤ 14%'},
        {attribute: 'ข้าวแตก', value: '< 5%'},
      ],
    },
  },
  {
    slug: 'irri-6-long-grain-rice',
    featured: false,
    variety: 'long-grain',
    grain: 'long',
    packaging: ['25kg', '50kg', 'bulk'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: 'IRRI-6 Long Grain Rice',
      shortDescription:
        'Premium IRRI-6 long grain rice — outstanding quality and versatile use from everyday meals to gourmet cuisine.',
      grainSpec: 'Grain Length: 6.0 mm (minimum average)',
      moistureSpec: 'Moisture Content: 14% max',
      brokenSpec: 'Broken Grains: 5% max',
      fullDescription:
        'IRRI-6 Long Grain Rice is renowned for long, slender grains that remain separate and fluffy after cooking — ideal for pilafs, biryanis, stir-fries, and side dishes. Mild taste and subtle aroma enhance flavors without overpowering. Rich in carbohydrates and essential nutrients. Each grain is carefully cleaned and polished; cultivated using sustainable practices.',
      technicalSpecifications: [
        {attribute: 'Variety', value: 'IRRI-6 Long Grain Rice'},
        {attribute: 'Grain Length', value: '6.0 mm (minimum average)'},
        {attribute: 'Moisture Content', value: '14% max'},
        {attribute: 'Broken Grains', value: '5% max'},
        {attribute: 'Foreign Matter', value: '0.1% max'},
        {attribute: 'Polishing Grade', value: 'Double polished'},
      ],
    },
    th: {
      name: 'ข้าวเจ้ายาว IRRI-6',
      shortDescription:
        'ข้าวเจ้ายาว IRRI-6 คุณภาพพรีเมียม ใช้ได้หลากหลายตั้งแต่อาหารประจำวันถึงเมนูพิเศษ',
      grainSpec: 'ความยาวเมล็ด: 6.0 มม. (เฉลี่ยขั้นต่ำ)',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ข้าวแตก: สูงสุด 5%',
      fullDescription:
        'ข้าวเจ้ายาว IRRI-6 เมล็ดยาวเรียบ หุงแล้วนุ่มฟู แยกเมล็ดดี เหมาะสำหรับพิลาฟ บิรยานี ผัด และเครื่องเคียง รสอ่อน กลิ่นหอมละมุน สะอาดและขัดสีอย่างพิถีพิถัน',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: 'IRRI-6 Long Grain Rice'},
        {attribute: 'ความยาวเมล็ด', value: '6.0 มม. (เฉลี่ยขั้นต่ำ)'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 5%'},
        {attribute: 'สิ่งแปลกปลอม', value: '0.1% สูงสุด'},
        {attribute: 'การขัดสี', value: 'ขัดสีสองครั้ง'},
      ],
    },
  },
  {
    slug: 'japonica-rice',
    featured: false,
    variety: 'specialty',
    grain: 'short-medium',
    packaging: ['25kg', '50kg'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: 'Japonica Rice',
      shortDescription:
        'Short to medium-grain rice with sticky, firm cooking texture. Opalescent white grains with glossy sheen. Moisture below 14%; broken grains less than 5%.',
      grainSpec: 'Grain Type: Short to medium-grain, slightly plump',
      moistureSpec: 'Moisture Content: Typically below 14%',
      brokenSpec: 'Broken Grains: Less than 5%',
      fullDescription:
        'Japonica Rice (Oryza sativa japonica) is revered for exceptional quality and Japanese heritage. Sticky consistency ideal for sushi, onigiri, and Japanese-inspired dishes; subtle sweetness enhances accompanying flavors. Milled and polished to opalescent white with glossy sheen. Compliant with ISO, HACCP, and international food safety standards.',
      technicalSpecifications: [
        {attribute: 'Variety', value: 'Japonica Rice (Oryza sativa japonica)'},
        {attribute: 'Grain Type', value: 'Short to medium-grain'},
        {attribute: 'Color', value: 'Opalescent white with glossy sheen'},
        {attribute: 'Cooking Texture', value: 'Sticky and firm'},
        {attribute: 'Moisture Content', value: 'Typically below 14%'},
        {attribute: 'Foreign Matter', value: 'Nil'},
      ],
    },
    th: {
      name: 'ข้าวญี่ปุ่น (จาโปนิกา)',
      shortDescription:
        'ข้าวเมล็ดสั้นถึงกลาง หุงแล้วเหนียวนุ่ม สีขาวขุ่นมันวาว ความชื้นต่ำกว่า 14% ข้าวแตกน้อยกว่า 5%',
      grainSpec: 'ชนิดเมล็ด: สั้นถึงกลาง',
      moistureSpec: 'ความชื้น: โดยทั่วไปต่ำกว่า 14%',
      brokenSpec: 'ข้าวแตก: น้อยกว่า 5%',
      fullDescription:
        'ข้าวจาโปนิกา คุณภาพระดับพรีเมียม เหมาะสำหรับซูชิ โอนิกิริ และอาหารญี่ปุ่น มีความหวานอ่อน ดูดซับรสชาติได้ดี สีขาวมันวาว ผ่านมาตรฐาน ISO และ HACCP',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: 'Japonica Rice'},
        {attribute: 'ชนิดเมล็ด', value: 'สั้นถึงกลาง'},
        {attribute: 'สี', value: 'ขาวขุ่นมันวาว'},
        {attribute: 'เนื้อเมื่อหุง', value: 'เหนียวนุ่ม'},
        {attribute: 'ความชื้น', value: 'ต่ำกว่า 14%'},
        {attribute: 'สิ่งแปลกปลอม', value: 'ไม่มี'},
      ],
    },
  },
  {
    slug: 'jasmine-rice-thai-hom-mali',
    featured: true,
    variety: 'jasmine',
    grain: 'long',
    badge: '⭐ Best Seller',
    badgeTh: '⭐ ขายดีที่สุด',
    packaging: ['1kg', '5kg', '10kg', '20kg', '25kg', '50kg'],
    packagingTypes: ['retail', '25kg', '50kg'],
    moq: '20 MT',
    shipping: 'FCL 20ft = 20 MT; FCL 40ft = 27 MT',
    storage: 'Cool, dry place away from direct sunlight',
    en: {
      name: 'Jasmine Rice (Thai Hom Mali)',
      shortDescription:
        'Fragrant Thai Hom Mali Jasmine Rice — aromatic excellence from Thailand. Premium long-grain rice from Thailand\'s finest growing regions.',
      grainSpec: 'Variety: Long Grain Rice',
      moistureSpec: 'Moisture: 14% Max',
      brokenSpec: 'Broken (5.2 mm): 4.5% Max',
      fullDescription:
        'Thai Hom Mali Jasmine Rice embodies fragrance and quality. Long-grained with nutty smell and delicate pandan aroma — a key Thai export from the north and central eastern regions. Hom Mali refers to pandan/screwpine aroma; the Jasmine trade name reflects the white grain. Finest class grown in Ubon Ratchathani, Buriram, Sisaket, Roi Et, Yasothon, and Surin. TAT Global mills to export grade with ISO, HACCP, and Thai Agricultural Standards (TAS) compliance.',
      technicalSpecifications: [
        {attribute: 'Purity', value: '92%'},
        {attribute: 'Whole Kernels', value: '60% Max'},
        {attribute: 'Broken (5.2 mm)', value: '4.5% Max'},
        {attribute: 'Moisture', value: '14% Max'},
        {attribute: 'Admixture', value: '2% Max'},
        {attribute: 'Country of Origin', value: 'Thailand'},
      ],
    },
    th: {
      name: 'ข้าวหอมมะลิ (ข้าวหอมมะลิไทย)',
      shortDescription:
        'ข้าวหอมมะลิไทย คุณภาพพรีเมียมจากแหล่งปลูกที่ดีที่สุดของประเทศไทย',
      grainSpec: 'ชนิด: ข้าวเจ้ายาว',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ข้าวแตก (5.2 มม.): สูงสุด 4.5%',
      fullDescription:
        'ข้าวหอมมะลิไทย มีกลิ่นหอมและคุณภาพระดับส่งออก เมล็ดยาว กลิ่นหอมใบเตย ปลูกในภาคตะวันออกเฉียงเหนือ เช่น อุบลราชธานี บุรีรัมย์ ศรีสะเกษ TAT Global สีตามมาตรฐานส่งออก ISO HACCP และ มกษ.',
      technicalSpecifications: [
        {attribute: 'ความบริสุทธิ์', value: '92%'},
        {attribute: 'เมล็ดเต็ม', value: 'สูงสุด 60%'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 4.5%'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'สิ่งเจือปน', value: 'สูงสุด 2%'},
        {attribute: 'แหล่งกำเนิด', value: 'ประเทศไทย'},
      ],
    },
  },
  {
    slug: 'parboiled-rice-5-broken',
    featured: false,
    variety: 'parboiled',
    grain: 'long',
    packaging: ['50kg'],
    packagingTypes: ['50kg', 'bulk'],
    moq: '20 MT',
    shipping: 'Delivery: 15–30 days after payment confirmation',
    en: {
      name: 'Parboiled Rice 5% Broken',
      shortDescription:
        'Five Percent Broken Parboiled Long and Medium Grain Rice — rich aroma, good taste, and high nutritious value.',
      grainSpec: 'Typical Grain Length: 6mm & beyond',
      moistureSpec: 'Moisture: 14% max',
      brokenSpec: 'Broken (2/3 basis): 5% Max',
      fullDescription:
        '5% Broken Parboiled Rice is treated using advanced technologies and global industrial standards. Known for rich aroma, good taste, and high nutritious value. Customized packaging available upon request. TAT Global supplies export-grade parboiled rice for international buyers.',
      technicalSpecifications: [
        {attribute: 'Grade', value: 'PARBOILED RICE IR-36/64'},
        {attribute: 'Broken', value: '5% Max (2/3 basis)'},
        {attribute: 'Moisture', value: '14% max'},
        {attribute: 'Whole Grain Kernels', value: '70% min'},
        {attribute: 'Length to breadth ratio', value: '2.5 & beyond'},
        {attribute: 'Foreign Matter / Damaged', value: '1% max'},
      ],
    },
    th: {
      name: 'ข้าวต้นสุก ข้าวแตก 5%',
      shortDescription:
        'ข้าวต้นสุกข้าวแตก 5% กลิ่นหอม รสดี คุณค่าทางโภชนาการสูง',
      grainSpec: 'ความยาวเมล็ดทั่วไป: 6 มม. ขึ้นไป',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ข้าวแตก: สูงสุด 5%',
      fullDescription:
        'ข้าวต้นสุกข้าวแตก 5% แปรรูปด้วยเทคโนโลยีทันสมัย มาตรฐานอุตสาหกรรมระดับโลก กลิ่นหอม รสชาติดี TAT Global จัดหาเกรดส่งออก บรรจุภัณฑ์ปรับแต่งได้ตามคำขอ',
      technicalSpecifications: [
        {attribute: 'เกรด', value: 'PARBOILED IR-36/64'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 5%'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'เมล็ดเต็ม', value: 'ขั้นต่ำ 70%'},
        {attribute: 'อัตราส่วนยาว/กว้าง', value: '2.5 ขึ้นไป'},
        {attribute: 'สิ่งเสียหาย/เจือปน', value: 'สูงสุด 1%'},
      ],
    },
  },
  {
    slug: 'quality-brown-rice',
    featured: false,
    variety: 'specialty',
    grain: 'long',
    packaging: ['1kg', '5kg', '25kg', '50kg'],
    packagingTypes: ['retail', '25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: 'Quality Brown Rice',
      shortDescription:
        'Premium Brown Rice — nutritious whole grain with nutty flavor and chewy texture. Packed with fiber, essential nutrients, and antioxidants.',
      grainSpec: 'Average Grain Length: 6.00 to 6.50 mm',
      moistureSpec: 'Moisture Content: Not exceeding 14%',
      brokenSpec: 'Broken Grains: Max 5%',
      fullDescription:
        'Brown Rice is a wholesome choice combining health and taste. Minimal processing retains the bran layer, germ, and nutrient-rich qualities. Medium to long grains with earthy hues, distinct chewy texture and nutty flavor — ideal for pilafs, stir-fries, and salads. High fiber, essential minerals, B vitamins, and antioxidants promote digestive health and overall well-being.',
      technicalSpecifications: [
        {attribute: 'Moisture Content', value: 'Not exceeding 14%'},
        {attribute: 'Total Ash', value: 'Max 2.0%'},
        {attribute: 'Broken Grains', value: 'Max 5%'},
        {attribute: 'Foreign Matter', value: 'Max 0.5%'},
        {attribute: 'Average Grain Length', value: '6.00 to 6.50 mm'},
        {attribute: 'Mill Degree', value: 'Well milled and polished'},
      ],
    },
    th: {
      name: 'ข้าวกล้องคุณภาพ',
      shortDescription:
        'ข้าวกล้องพรีเมียม ธัญพืชเต็มเมล็ด รสถั่ว เนื้อเคี้ยว มีใยอาหารและสารอาหารจำเป็น',
      grainSpec: 'ความยาวเมล็ดเฉลี่ย: 6.00–6.50 มม.',
      moistureSpec: 'ความชื้น: ไม่เกิน 14%',
      brokenSpec: 'ข้าวแตก: สูงสุด 5%',
      fullDescription:
        'ข้าวกล้องคุณภาพ แปรรูปน้อย คงเปลือกและจุเอมไร้ รสถั่ว เนื้อเคี้ยว เหมาะพิลาฟ ผัด และสลัด มีใยอาหาร แร่ธาตุ และวิตามินบี',
      technicalSpecifications: [
        {attribute: 'ความชื้น', value: 'ไม่เกิน 14%'},
        {attribute: 'เถ้าทั้งหมด', value: 'สูงสุด 2.0%'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 5%'},
        {attribute: 'สิ่งแปลกปลอม', value: 'สูงสุด 0.5%'},
        {attribute: 'ความยาวเมล็ด', value: '6.00–6.50 มม.'},
        {attribute: 'การสี', value: 'สีดี'},
      ],
    },
  },
  {
    slug: 'irri-9-long-grain-rice',
    featured: false,
    variety: 'long-grain',
    grain: 'long',
    packaging: ['25kg', '50kg', 'bulk'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: 'RRI 9 Long Grain Rice',
      shortDescription:
        'IRRI 9 Long Grain Rice — long, slender grains that remain separate and fluffy after cooking. Subtle aroma and delicate flavor.',
      grainSpec: 'Grain Length: 6.8 mm (minimum average)',
      moistureSpec: 'Moisture Content: 14% max',
      brokenSpec: 'Broken Grains: 5% max',
      fullDescription:
        'IRRI 9 Long Grain Rice is celebrated for long, slender grains ideal for biryani, pilaf, side dishes, and rice salads. Mild taste complements a wide range of ingredients and spices. Rich in carbohydrates, vitamins, and minerals. Meticulously cleaned and polished; cultivated using sustainable agricultural practices.',
      technicalSpecifications: [
        {attribute: 'Variety', value: 'IRRI 9 Long Grain Rice'},
        {attribute: 'Grain Length', value: '6.8 mm (minimum average)'},
        {attribute: 'Moisture Content', value: '14% max'},
        {attribute: 'Broken Grains', value: '5% max'},
        {attribute: 'Foreign Matter', value: '0.5% max'},
        {attribute: 'Polishing Grade', value: 'Double polished'},
      ],
    },
    th: {
      name: 'ข้าวเจ้ายาว IRRI 9',
      shortDescription:
        'ข้าวเจ้ายาว IRRI 9 เมล็ดยาวเรียว หุงแล้วฟูแยกเมล็ด กลิ่นอ่อน รสละมุน',
      grainSpec: 'ความยาวเมล็ด: 6.8 มม. (เฉลี่ยขั้นต่ำ)',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ข้าวแตก: สูงสุด 5%',
      fullDescription:
        'ข้าวเจ้ายาว IRRI 9 เหมาะบิรยานี พิลาฟ เครื่องเคียง และสลัดข้าว รสอ่อน สะอาดและขัดสีอย่างพิถีพิถัน',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: 'IRRI 9 Long Grain Rice'},
        {attribute: 'ความยาวเมล็ด', value: '6.8 มม.'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 5%'},
        {attribute: 'สิ่งแปลกปลอม', value: '0.5% สูงสุด'},
        {attribute: 'การขัดสี', value: 'ขัดสีสองครั้ง'},
      ],
    },
  },
  {
    slug: 'thai-brown-jasmine-rice',
    featured: false,
    variety: 'jasmine',
    grain: 'long',
    packaging: ['5kg', '10kg', '25kg', '50kg'],
    packagingTypes: ['retail', '25kg', '50kg'],
    moq: '20 MT',
    en: {
      name: 'Thai Brown Jasmine Rice',
      shortDescription:
        'Whole-grain aromatic jasmine rice retaining the outer bran layer for added nutrition, nuttier flavor, and chewier texture.',
      grainSpec: 'Variety: Long Grain Rice | Shape: Long | Colour: Brown',
      moistureSpec: 'Crop Year: Current',
      brokenSpec: 'Kind: Aromatic Rice | Cultivation: Organic',
      fullDescription:
        'Brown Jasmine Rice retains its outer bran layer for a nuttier flavor and chewier texture compared to white jasmine rice. Higher fiber, vitamins, and minerals — an excellent whole-grain choice. Requires slightly more water and longer cooking time; the added nutritional benefits and unique flavor profile are well worth the effort.',
      technicalSpecifications: [
        {attribute: 'Variety', value: 'Long Grain Rice'},
        {attribute: 'Shape', value: 'Long'},
        {attribute: 'Colour', value: 'Brown'},
        {attribute: 'Kind', value: 'Aromatic Rice'},
        {attribute: 'Cultivation Type', value: 'Organic'},
        {attribute: 'Crop Year', value: 'Current'},
      ],
    },
    th: {
      name: 'ข้าวกล้องหอมมะลิไทย',
      shortDescription:
        'ข้าวหอมมะลิกล้องเต็ม คงเปลือกนอก คุณค่าทางโภชนาการสูง รสถั่ว เนื้อเคี้ยว',
      grainSpec: 'ชนิด: ข้าวเจ้ายาว | รูปร่าง: ยาว | สี: น้ำตาล',
      moistureSpec: 'ปีผลผลิต: ปีปัจจุบัน',
      brokenSpec: 'ชนิด: ข้าวหอม | การปลูก: ออร์แกนิก',
      fullDescription:
        'ข้าวกล้องหอมมะลิ คงเปลือกนอก รสถั่ว เนื้อเคี้ยว มีใยอาหารและวิตามินสูงกว่าข้าวขาว ใช้น้ำและเวลาหุงมากกว่าเล็กน้อย',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: 'ข้าวเจ้ายาว'},
        {attribute: 'รูปร่าง', value: 'ยาว'},
        {attribute: 'สี', value: 'น้ำตาล'},
        {attribute: 'ชนิด', value: 'ข้าวหอม'},
        {attribute: 'การปลูก', value: 'ออร์แกนิก'},
        {attribute: 'ปีผลผลิต', value: 'ปีปัจจุบัน'},
      ],
    },
  },
  {
    slug: 'thai-glutinous-rice',
    featured: true,
    variety: 'glutinous',
    grain: 'short-medium',
    packaging: ['1kg', '5kg', '25kg', '50kg'],
    packagingTypes: ['retail', '25kg', '50kg', 'bulk'],
    moq: '10 MT',
    en: {
      name: 'Thai Glutinous Rice',
      shortDescription:
        'Traditional sticky rice (khao niao) — short to medium grains, intensely sticky when cooked. Naturally sweet flavor with subtle aroma.',
      grainSpec: 'Grain Size: Short to medium, plump, round',
      moistureSpec: 'Moisture Content: Not exceeding 14%',
      brokenSpec: 'Brokens: 12.00% max (10% broken grade)',
      fullDescription:
        'Glutinous rice is gluten-free despite its name — known for sticky, chewy texture when cooked. Used in mango sticky rice, Thai curries, rice dumplings, and desserts. Rich in carbohydrates with manganese, fiber, and essential vitamins. TAT Global supplies export-grade Thai glutinous rice in bulk and retail packaging.',
      technicalSpecifications: [
        {attribute: 'Variety', value: 'Glutinous Rice (Oryza sativa var. glutinosa)'},
        {attribute: 'Texture', value: 'Sticky, chewy when cooked'},
        {attribute: 'Whole kernels', value: '55.00% min'},
        {attribute: 'Brokens', value: '12.00% max'},
        {attribute: 'Moisture', value: '14.00% max'},
        {attribute: 'Milling degree', value: 'Well Milled'},
      ],
    },
    th: {
      name: 'ข้าวเหนียวไทย',
      shortDescription:
        'ข้าวเหนียวดั้งเดิม (ข้าวเหนียว) เมล็ดสั้นถึงกลาง หุงแล้วเหนียวมาก รสหวานอ่อน',
      grainSpec: 'ขนาดเมล็ด: สั้นถึงกลาง กลมมน',
      moistureSpec: 'ความชื้น: ไม่เกิน 14%',
      brokenSpec: 'ข้าวแตก: สูงสุด 12% (เกรด 10%)',
      fullDescription:
        'ข้าวเหนียวไทย ไม่มีกลูเตน เนื้อเหนียวเคี้ยว เหมาะข้าวเหนียวมะม่วง แกงไทย และขนม TAT Global จัดหาเกรดส่งออก',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: 'ข้าวเหนียว'},
        {attribute: 'เนื้อสัมผัส', value: 'เหนียวเมื่อหุง'},
        {attribute: 'เมล็ดเต็ม', value: 'ขั้นต่ำ 55%'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 12%'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'การสี', value: 'สีดี'},
      ],
    },
  },
  {
    slug: 'thai-glutinous-rice-25-broken',
    featured: false,
    variety: 'glutinous',
    grain: 'short-medium',
    packaging: ['25kg', '50kg', 'bulk'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: 'Thai Glutinous Rice 25% Broken',
      shortDescription:
        'Glutinous rice with 25% broken grains — sticky texture maintained; suitable for commercial and industrial use.',
      grainSpec: 'Whole kernels: 40.00% min',
      moistureSpec: 'Moisture: 14.00% max',
      brokenSpec: 'Brokens & Small Brokens: 28.00% max',
      fullDescription:
        'Thai Glutinous Rice 25% Broken grade with detailed export specifications for sticky rice applications. Maintains inherent sticky texture for commercial food manufacturing and industrial use.',
      technicalSpecifications: [
        {attribute: 'Whole kernels', value: '40.00% min'},
        {attribute: 'Brokens & Small Brokens', value: '28.00% max'},
        {attribute: 'Red/undermilled kernels', value: '6.00% max'},
        {attribute: 'Yellow kernels', value: '4.00% max'},
        {attribute: 'Moisture', value: '14.00% max'},
        {attribute: 'Milling degree', value: 'Ordinarily Milled'},
      ],
    },
    th: {
      name: 'ข้าวเหนียวไทย ข้าวแตก 25%',
      shortDescription:
        'ข้าวเหนียวข้าวแตก 25% คงเนื้อเหนียว เหมาะใช้เชิงพาณิชย์และอุตสาหกรรม',
      grainSpec: 'เมล็ดเต็ม: ขั้นต่ำ 40%',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ข้าวแตกรวม: สูงสุด 28%',
      fullDescription:
        'ข้าวเหนียวไทยเกรดข้าวแตก 25% สเปคส่งออกครบถ้วน คงเนื้อเหนียวสำหรับอุตสาหกรรมอาหาร',
      technicalSpecifications: [
        {attribute: 'เมล็ดเต็ม', value: 'ขั้นต่ำ 40%'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 28%'},
        {attribute: 'เมล็ดแดง/สีไม่ดี', value: 'สูงสุด 6%'},
        {attribute: 'เมล็ดเหลือง', value: 'สูงสุด 4%'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'การสี', value: 'สีธรรมดา'},
      ],
    },
  },
  {
    slug: 'thai-hom-patum-rice',
    featured: false,
    variety: 'jasmine',
    grain: 'long',
    packaging: ['5kg', '10kg', '25kg', '50kg'],
    packagingTypes: ['retail', '25kg', '50kg'],
    moq: '20 MT',
    en: {
      name: 'Thai Hom Patum Rice',
      shortDescription:
        'Pathum Thani fragrant rice (RD31) — certified fragrant rice with soft texture when freshly cooked; texture firms as it cools.',
      grainSpec: 'Variety: Long Grain Rice',
      moistureSpec: 'Moisture: 14% Max',
      brokenSpec: 'Broken (5.2 mm): 4.5% Max',
      fullDescription:
        'Thai Hom Patum (Pathumthani Fragrant Rice) is developed at Thailand\'s Pathum Thani rice institute. With appearance, soft texture, and fragrance similar to Thai jasmine rice, it is considered a second sort of Thai Hom Mali. Export-grade milling with Extra Well Milled degree.',
      technicalSpecifications: [
        {attribute: 'Purity', value: '80%'},
        {attribute: 'Whole Kernels', value: '60% Max'},
        {attribute: 'Broken (5.2 mm)', value: '4.5% Max'},
        {attribute: 'Moisture', value: '14% Max'},
        {attribute: 'Milling Degree', value: 'Extra Well Milled'},
        {attribute: 'Country of Origin', value: 'Thailand'},
      ],
    },
    th: {
      name: 'ข้าวหอมปทุม',
      shortDescription:
        'ข้าวหอมปทุมธานี (RD31) เนื้อนุ่มเมื่อหุงใหม่ ข้ามีกลิ่นหอม',
      grainSpec: 'ชนิด: ข้าวเจ้ายาว',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ข้าวแตก: สูงสุด 4.5%',
      fullDescription:
        'ข้าวหอมปทุม พัฒนาจากสถาบันข้าวปทุมธานี ลักษณะและกลิ่นใกล้เคียงข้าวหอมมะลิ ถือเป็นข้าวหอมชั้นสองของไทย',
      technicalSpecifications: [
        {attribute: 'ความบริสุทธิ์', value: '80%'},
        {attribute: 'เมล็ดเต็ม', value: 'สูงสุด 60%'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 4.5%'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'การสี', value: 'พิเศษมาก'},
        {attribute: 'แหล่งกำเนิด', value: 'ประเทศไทย'},
      ],
    },
  },
  {
    slug: 'thai-jasmine-black-cargo-rice',
    featured: false,
    variety: 'specialty',
    grain: 'long',
    packaging: ['5kg', '10kg', '25kg', '50kg'],
    packagingTypes: ['retail', '25kg', '50kg'],
    moq: '10 MT',
    en: {
      name: 'Thai Jasmine Black Cargo Rice',
      shortDescription:
        'Black cargo rice with good taste and unique fragrance. Only husk removed to retain nutrients, vitamins, and minerals.',
      grainSpec: 'Color: Black | Kind: Whole-grain cargo',
      moistureSpec: 'Processing: Husk removed only',
      brokenSpec: 'Retains bran nutrients',
      fullDescription:
        'Thai Jasmine Black Cargo Rice is black in color with good taste and unique fragrance. Only its husk has been removed to retain nutrients, vitamins, and minerals including vitamin B1, B2, B complex, iron, magnesium, phosphorus, calcium, niacin, and fiber.',
      technicalSpecifications: [
        {attribute: 'Color', value: 'Black'},
        {attribute: 'Processing', value: 'Husk removed only'},
        {attribute: 'Vitamin B1, B2, B complex', value: 'Retained'},
        {attribute: 'Minerals', value: 'Iron, Magnesium, Phosphorus, Calcium'},
        {attribute: 'Fiber', value: 'Retained in bran'},
        {attribute: 'Origin', value: 'Thailand'},
      ],
    },
    th: {
      name: 'ข้าวคาร์โก้ดำหอมมะลิไทย',
      shortDescription:
        'ข้าวคาร์โก้ดำ รสดี กลิ่นหอมเฉพาะตัว คงสารอาหารโดยขัดเฉพาะเปลือก',
      grainSpec: 'สี: ดำ | ชนิด: ข้าวคาร์โก้เต็มเมล็ด',
      moistureSpec: 'การแปรรูป: ขัดเฉพาะเปลือก',
      brokenSpec: 'คงสารอาหารในรำข้าว',
      fullDescription:
        'ข้าวคาร์โก้ดำหอมมะลิไทย สีดำ รสดี กลิ่นหอม ขัดเฉพาะเปลือก คงวิตามินบี แร่ธาตุ และใยอาหาร',
      technicalSpecifications: [
        {attribute: 'สี', value: 'ดำ'},
        {attribute: 'การแปรรูป', value: 'ขัดเฉพาะเปลือก'},
        {attribute: 'วิตามินบี', value: 'คงไว้'},
        {attribute: 'แร่ธาตุ', value: 'เหล็ก แมกนีเซียม ฟอสฟอรัส แคลเซียม'},
        {attribute: 'ใยอาหาร', value: 'คงในรำข้าว'},
        {attribute: 'แหล่งกำเนิด', value: 'ประเทศไทย'},
      ],
    },
  },
  {
    slug: 'thai-jasmine-red-cargo-rice',
    featured: false,
    variety: 'specialty',
    grain: 'long',
    packaging: ['5kg', '10kg', '25kg', '50kg'],
    packagingTypes: ['retail', '25kg', '50kg'],
    moq: '10 MT',
    en: {
      name: 'Thai Jasmine Red Cargo Rice',
      shortDescription:
        'Non-glutinous long-grain red cargo rice. Only rice grain shells removed, retaining vitamins, nutrients, and minerals in the bran and kernel.',
      grainSpec: 'Variety: Long Grain Rice | Color: Red',
      moistureSpec: 'Moisture: 14% Max',
      brokenSpec: 'Admixture: 2% Max',
      fullDescription:
        'Thai Red Cargo Rice is a worthy source of riboflavin (vitamin B2), thiamin (vitamin B1), iron, fiber, and calcium. More aromatic and nutty when cooked; takes longer to cook than white rice but not as long as brown rice. High-quality Red Cargo Rice exported from Thailand.',
      technicalSpecifications: [
        {attribute: 'Texture', value: 'Soft'},
        {attribute: 'Kind', value: 'Brown Rice'},
        {attribute: 'Variety', value: 'Long Grain Rice'},
        {attribute: 'Color', value: 'Red'},
        {attribute: 'Moisture', value: '14% Max'},
        {attribute: 'Crop Year', value: 'Current'},
      ],
    },
    th: {
      name: 'ข้าวคาร์โก้แดงหอมมะลิไทย',
      shortDescription:
        'ข้าวคาร์โก้แดงเจ้ายาว ขัดเฉพาะเปลือก คงวิตามินและแร่ธาตุในรำข้าว',
      grainSpec: 'ชนิด: ข้าวเจ้ายาว | สี: แดง',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'สิ่งเจือปน: สูงสุด 2%',
      fullDescription:
        'ข้าวคาร์โก้แดงไทย มีวิตามินบี ธาตุเหล็ก ใยอาหาร และแคลเซียม กลิ่นหอมถั่ว ใช้เวลาหุงนานกว่าข้าวขาว',
      technicalSpecifications: [
        {attribute: 'เนื้อสัมผัส', value: 'นุ่ม'},
        {attribute: 'ชนิด', value: 'ข้าวกล้อง'},
        {attribute: 'สายพันธุ์', value: 'ข้าวเจ้ายาว'},
        {attribute: 'สี', value: 'แดง'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'ปีผลผลิต', value: 'ปีปัจจุบัน'},
      ],
    },
  },
  {
    slug: 'thai-long-grain-rice',
    featured: true,
    variety: 'long-grain',
    grain: 'long',
    packaging: ['1kg', '5kg', '10kg', '20kg', '25kg', '50kg'],
    packagingTypes: ['retail', '25kg', '50kg'],
    moq: '20 MT',
    storage: 'Cool, dry place away from direct sunlight',
    en: {
      name: 'Thai Long Grain Rice',
      shortDescription:
        'Premium Thai long-grain white rice — delicate aroma, superior taste, elongated grains that cook fluffy. Versatile for traditional Thai and international cuisine.',
      grainSpec: 'Variety: Long-Grain Rice | Broken Ratio: 25%',
      moistureSpec: 'Max. Moisture: 14%',
      brokenSpec: 'Admixture: 11%',
      fullDescription:
        'Thai Long Grain Rice (Oryza sativa) features extra-long, slender grains milled and polished to perfection. Translucent white grains with moisture below 14%, broken grains below 5%, and no foreign matter. Renowned for delicate aroma, superior taste, and grains that cook perfectly fluffy. Packed with essential nutrients, vitamins, and minerals.',
      technicalSpecifications: [
        {attribute: 'Kind', value: 'White Rice'},
        {attribute: 'Variety', value: 'Long-Grain Rice'},
        {attribute: 'Color', value: 'White'},
        {attribute: 'Broken Ratio', value: '25%'},
        {attribute: 'Max. Moisture', value: '14%'},
        {attribute: 'Style', value: 'Dried'},
      ],
    },
    th: {
      name: 'ข้าวเจ้ายาวไทย',
      shortDescription:
        'ข้าวเจ้ายาวขาวไทยพรีเมียม กลิ่นหอมอ่อน รสดี เมล็ดยาว หุงแล้วฟู',
      grainSpec: 'ชนิด: ข้าวเจ้ายาว | ข้าวแตก: 25%',
      moistureSpec: 'ความชื้นสูงสุด: 14%',
      brokenSpec: 'สิ่งเจือปน: 11%',
      fullDescription:
        'ข้าวเจ้ายาวไทย เมล็ดยาวเรียว สีขาวใส กลิ่นหอมอ่อน หุงแล้วฟู ใช้ได้ทั้งอาหารไทยและนานาชาติ',
      technicalSpecifications: [
        {attribute: 'ชนิด', value: 'ข้าวขาว'},
        {attribute: 'สายพันธุ์', value: 'ข้าวเจ้ายาว'},
        {attribute: 'สี', value: 'ขาว'},
        {attribute: 'ข้าวแตก', value: '25%'},
        {attribute: 'ความชื้น', value: '14%'},
        {attribute: 'ลักษณะ', value: 'แห้ง'},
      ],
    },
  },
  {
    slug: 'thai-parboiled-rice',
    featured: true,
    variety: 'parboiled',
    grain: 'long',
    packaging: ['1kg', '5kg', '10kg', '25kg', '50kg'],
    packagingTypes: ['retail', '25kg', '50kg'],
    moq: '20 MT',
    storage: 'Shelf life up to 2 years under recommended storage',
    en: {
      name: 'Thai Parboiled Rice',
      shortDescription:
        'Premium Thai parboiled rice — steam-parboiled medium to long grains with translucent golden color. Retains nutrients; cooks firm and separate.',
      grainSpec: 'Grain Type: Medium to long grains',
      moistureSpec: 'Moisture Content: Below 14%',
      brokenSpec: 'Broken Grains: Less than 5%',
      fullDescription:
        'Premium Thai Parboiled Rice undergoes special parboiling that preserves nutrients, resulting in firmer, less sticky grains with a golden hue. Nutty, slightly earthy taste; retains more vitamins and minerals; lower glycemic index. Ideal for pilafs, salads, casseroles, and global cuisines. ISO, HACCP, and TAS certified.',
      technicalSpecifications: [
        {attribute: 'Variety', value: 'Thai Parboiled Rice'},
        {attribute: 'Processing', value: 'Parboiled to retain nutrients'},
        {attribute: 'Color', value: 'Translucent golden'},
        {attribute: 'Moisture Content', value: 'Below 14%'},
        {attribute: 'Broken Grains', value: 'Less than 5%'},
        {attribute: 'Foreign Matter', value: 'Nil'},
      ],
    },
    th: {
      name: 'ข้าวต้นสุกไทย',
      shortDescription:
        'ข้าวต้นสุกไทยพรีเมียม เมล็ดกลางถึงยาว สีทองใส คงสารอาหาร หุงแล้วแน่นแยกเมล็ด',
      grainSpec: 'ชนิดเมล็ด: กลางถึงยาว',
      moistureSpec: 'ความชื้น: ต่ำกว่า 14%',
      brokenSpec: 'ข้าวแตก: น้อยกว่า 5%',
      fullDescription:
        'ข้าวต้นสุกไทย แปรรูปต้นสุก คงวิตามินและแร่ธาตุ สีทอง รสถั่วอ่อน เหมาะพิลาฟ สลัด และอาหารนานาชาติ',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: 'ข้าวต้นสุกไทย'},
        {attribute: 'การแปรรูป', value: 'ต้นสุก'},
        {attribute: 'สี', value: 'ทองใส'},
        {attribute: 'ความชื้น', value: 'ต่ำกว่า 14%'},
        {attribute: 'ข้าวแตก', value: 'น้อยกว่า 5%'},
        {attribute: 'สิ่งแปลกปลอม', value: 'ไม่มี'},
      ],
    },
  },
  {
    slug: 'thai-riceberry-rice',
    featured: false,
    variety: 'specialty',
    grain: 'long',
    packaging: ['1kg', '5kg', '10kg', '25kg'],
    packagingTypes: ['retail', '25kg'],
    moq: '10 MT',
    en: {
      name: 'Thai Riceberry Rice',
      shortDescription:
        'Purple whole-grain Thai specialty rice — rich in antioxidants, vitamins, and minerals. Origin: Thailand.',
      grainSpec: 'Origin: Thailand | Type: Purple whole-grain',
      moistureSpec: 'Bran retained for nutrients',
      brokenSpec: 'Cross: Thai Hom Mali × local black rice',
      fullDescription:
        'Thai Riceberry Rice is a Thai purple rice variety developed from a cross between Thai Hom Mali (jasmine) and local black rice. Deep purple-burgundy bran when raw; nutty aroma and soft, slightly chewy texture when cooked. Retains bran for higher fiber, antioxidants (anthocyanins), and micronutrients compared to white rice.',
      technicalSpecifications: [
        {attribute: 'Origin', value: 'Thailand'},
        {attribute: 'Type', value: 'Purple whole-grain specialty'},
        {attribute: 'Parentage', value: 'Hom Mali × black rice'},
        {attribute: 'Bran Color', value: 'Purple-burgundy'},
        {attribute: 'Antioxidants', value: 'Anthocyanins (bran retained)'},
        {attribute: 'Texture', value: 'Soft, slightly chewy when cooked'},
      ],
    },
    th: {
      name: 'ข้าวไรซ์เบอร์รี่ไทย',
      shortDescription:
        'ข้าวเบอร์รี่สีม่วงไทย อุดมสารต้านอนุมูลอิสระ วิตามิน และแร่ธาตุ',
      grainSpec: 'แหล่งกำเนิด: ประเทศไทย',
      moistureSpec: 'คงรำข้าวเพื่อสารอาหาร',
      brokenSpec: 'ผสม: หอมมะลิ × ข้าวดำท้องถิ่น',
      fullDescription:
        'ข้าวไรซ์เบอร์รี่ พัฒนาจากข้าวหอมมะลิผสมข้าวดำ รำสีม่วงเข้ม กลิ่นถั่ว เนื้อนุ่มเคี้ยว มีแอนโทไซยานินและใยอาหารสูง',
      technicalSpecifications: [
        {attribute: 'แหล่งกำเนิด', value: 'ประเทศไทย'},
        {attribute: 'ชนิด', value: 'ข้าวเบอร์รี่เต็มเมล็ด'},
        {attribute: 'สายพันธุ์', value: 'หอมมะลิ × ข้าวดำ'},
        {attribute: 'สีรำ', value: 'ม่วงเข้ม'},
        {attribute: 'สารต้านอนุมูลอิสระ', value: 'แอนโทไซยานิน'},
        {attribute: 'เนื้อสัมผัส', value: 'นุ่ม เคี้ยวเล็กน้อย'},
      ],
    },
  },
  {
    slug: 'thai-white-rice-10-broken',
    featured: false,
    variety: 'white',
    grain: 'long',
    packaging: ['25kg', '50kg', 'bulk'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: 'Thai White Rice 10% Broken',
      shortDescription:
        'Long Grain White Rice (10% Broken) — known for quality, non-stickiness, and taste. Available in different packaging quantities.',
      grainSpec: 'Broken on 2/3rd Basis: 10% Max',
      moistureSpec: 'Moisture: 14% Max',
      brokenSpec: 'Milling Degree: Well Milled 100% sortexed clean',
      fullDescription:
        'Long Grain White Rice 10% broken — premium quality at competitive pricing for global buyers. Export-grade milling with well-milled, 100% sortexed clean specification.',
      technicalSpecifications: [
        {attribute: 'Broken on 2/3rd Basis', value: '10% Max'},
        {attribute: 'Moisture', value: '14% Max'},
        {attribute: 'Damaged/Discolored', value: '2% Max'},
        {attribute: 'Red/Red Streak', value: '0.25% Max'},
        {attribute: 'Whiteness', value: '40deg kett Minimum'},
        {attribute: 'Color', value: 'White'},
      ],
    },
    th: {
      name: 'ข้าวขาวไทย ข้าวแตก 10%',
      shortDescription:
        'ข้าวเจ้ายาวขาวข้าวแตก 10% คุณภาพดี ไม่เหนียว รสชาติดี',
      grainSpec: 'ข้าวแตก (2/3): สูงสุด 10%',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'การสี: สีดี 100% sortexed',
      fullDescription:
        'ข้าวเจ้ายาวขาวข้าวแตก 10% เกรดส่งออก คุณภาพสม่ำเสมอ ราคาแข่งขันได้',
      technicalSpecifications: [
        {attribute: 'ข้าวแตก', value: 'สูงสุด 10%'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'เมล็ดเสียหาย', value: 'สูงสุด 2%'},
        {attribute: 'เมล็ดแดง', value: '0.25% สูงสุด'},
        {attribute: 'ความขาว', value: 'Kett 40 ขั้นต่ำ'},
        {attribute: 'สี', value: 'ขาว'},
      ],
    },
  },
  {
    slug: 'thai-white-rice-100-broken',
    featured: false,
    variety: 'broken',
    grain: 'broken',
    packaging: ['25kg', '50kg', 'bulk'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: 'Thai White rice 100% broken',
      shortDescription:
        '100% broken white rice grade — suitable for industrial use, animal feed, rice flour, and food manufacturing.',
      grainSpec: 'Variety: White Broken',
      moistureSpec: 'Moisture: 14% max',
      brokenSpec: 'Broken: 100% Max',
      fullDescription:
        'Thai White Rice 100% broken — premium broken rice grade for industrial and food processing applications. Consistent quality for rice flour, animal feed, brewing, and food manufacturing.',
      technicalSpecifications: [
        {attribute: 'Variety', value: 'White Broken'},
        {attribute: 'Broken', value: '100% Max'},
        {attribute: 'Colour', value: 'White/Yellow'},
        {attribute: 'Moisture', value: '14% max'},
        {attribute: 'Foreign matters', value: '0.1% Max'},
        {attribute: 'Country of Origin', value: 'Thailand'},
      ],
    },
    th: {
      name: 'Thai White rice 100% broken',
      shortDescription:
        'ข้าวขาวข้าวแตก 100% เหมาะอุตสาหกรรม อาหารสัตว์ แป้งข้าว และโรงงานอาหาร',
      grainSpec: 'สายพันธุ์: ข้าวแตกขาว',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ข้าวแตก: 100% สูงสุด',
      fullDescription:
        'ข้าวขาวข้าวแตก 100% เกรดอุตสาหกรรม คุณภาพสม่ำเสมอ สำหรับแป้งข้าว อาหารสัตว์ และการแปรรูป',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: 'ข้าวแตกขาว'},
        {attribute: 'ข้าวแตก', value: '100% สูงสุด'},
        {attribute: 'สี', value: 'ขาว/เหลือง'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'สิ่งแปลกปลอม', value: '0.1% สูงสุด'},
        {attribute: 'แหล่งกำเนิด', value: 'ประเทศไทย'},
      ],
    },
  },
  {
    slug: 'thai-white-rice-100-sortexed',
    featured: true,
    variety: 'white',
    grain: 'long',
    badge: '🏆 Top Export',
    badgeTh: '🏆 ส่งออกยอดนิยม',
    packaging: ['25kg', '50kg', 'bulk'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    shipping: 'FCL 20ft = 21–22 MT; FCL 40ft = 26–27 MT',
    en: {
      name: 'Thai White Rice 100% Sortexed',
      shortDescription:
        'Premium sortexed white rice — long, slender, fluffy grains. Sortex technology removes broken grains, stones, and husks for uniform quality.',
      grainSpec: 'Long grain class 1: 70.00% min',
      moistureSpec: 'Moisture: 14.00% max',
      brokenSpec: 'Brokens: 4.00% max',
      fullDescription:
        'Thai White Rice 100% sortexed is a premium variety meticulously sorted for exceptional quality. Sourced from Thailand\'s fertile fields — pure white grains that are long, slender, and fluffy. Sortexing removes impurities; only the finest, most uniform grains remain. Extra Well Milled degree.',
      technicalSpecifications: [
        {attribute: 'Long grain class 1', value: '70.00% min'},
        {attribute: 'Whole kernels', value: '60.00% min'},
        {attribute: 'Brokens', value: '4.00% max'},
        {attribute: 'Moisture', value: '14.00% max'},
        {attribute: 'Milling degree', value: 'Extra Well Milled'},
        {attribute: 'Foreign matter', value: '0.10% max'},
      ],
    },
    th: {
      name: 'ข้าวขาวไทย 100% Sortexed',
      shortDescription:
        'ข้าวขาว sortexed พรีเมียม เมล็ดยาวเรียว ฟู คัดเกรดด้วยเทคโนโลยี sortex',
      grainSpec: 'ข้าวยาวชั้น 1: ขั้นต่ำ 70%',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ข้าวแตก: สูงสุด 4%',
      fullDescription:
        'ข้าวขาวไทย 100% sortexed คัดสรรพิถีพิถัน เมล็ดยาวขาวบริสุทธิ์ คัดด้วย sortex ลบข้าวแตกและสิ่งเจือปน สีพิเศษมาก',
      technicalSpecifications: [
        {attribute: 'ข้าวยาวชั้น 1', value: 'ขั้นต่ำ 70%'},
        {attribute: 'เมล็ดเต็ม', value: 'ขั้นต่ำ 60%'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 4%'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'การสี', value: 'พิเศษมาก'},
        {attribute: 'สิ่งแปลกปลอม', value: '0.10% สูงสุด'},
      ],
    },
  },
  {
    slug: 'thai-white-rice-25-broken',
    featured: false,
    variety: 'white',
    grain: 'long',
    packaging: ['25kg', '50kg', 'bulk'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    en: {
      name: 'Thai White Rice 25% Broken',
      shortDescription:
        'Long Grain White Rice (25% Broken) — best quality for global buyers. Economical pricing with fragrance and rich minerals.',
      grainSpec: 'Broken on 2/3rd Basis: 25% Max',
      moistureSpec: 'Moisture: 14% max',
      brokenSpec: 'Whole Kernel Length: 5.8–6.2mm',
      fullDescription:
        'Long Grain White Rice 25% Broken — widely used in food manufacturing for fragrance, vitamin content, and rich minerals. Well milled, 100% sortexed clean specification.',
      technicalSpecifications: [
        {attribute: 'Broken on 2/3rd Basis', value: '25% Max'},
        {attribute: 'Whole Kernel Length', value: '5.8–6.2mm'},
        {attribute: 'Moisture', value: '14% max'},
        {attribute: 'Milling Degree', value: 'Well Milled 100% sortexed clean'},
        {attribute: 'Color', value: 'White'},
        {attribute: 'Crop Year', value: 'Current'},
      ],
    },
    th: {
      name: 'ข้าวขาวไทย ข้าวแตก 25%',
      shortDescription:
        'ข้าวเจ้ายาวขาวข้าวแตก 25% คุณภาพดี ราคาแข่งขัน มีกลิ่นหอมและแร่ธาตุ',
      grainSpec: 'ข้าวแตก: สูงสุด 25%',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ความยาวเมล็ดเต็ม: 5.8–6.2 มม.',
      fullDescription:
        'ข้าวเจ้ายาวขาวข้าวแตก 25% ใช้ในอุตสาหกรรมอาหาร มีกลิ่นหอม วิตามิน และแร่ธาตุ สีดี sortexed',
      technicalSpecifications: [
        {attribute: 'ข้าวแตก', value: 'สูงสุด 25%'},
        {attribute: 'ความยาวเมล็ดเต็ม', value: '5.8–6.2 มม.'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'การสี', value: 'สีดี 100% sortexed'},
        {attribute: 'สี', value: 'ขาว'},
        {attribute: 'ปีผลผลิต', value: 'ปีปัจจุบัน'},
      ],
    },
  },
  {
    slug: 'white-rice-5-broken',
    featured: true,
    variety: 'white',
    grain: 'long',
    packaging: ['25kg', '50kg', 'bulk'],
    packagingTypes: ['25kg', '50kg', 'bulk'],
    moq: '20 MT',
    shipping: 'FCL 20ft = 21–22 MT; FCL 40ft = 26–27 MT',
    en: {
      name: 'White Rice 5% Broken',
      shortDescription:
        'Thai White Rice 5% Broken — superior quality long-grain white rice at competitive pricing.',
      grainSpec: 'Variety: Long Grain Rice',
      moistureSpec: 'Moisture: 14% max',
      brokenSpec: 'Broken: 5% Max',
      fullDescription:
        'Premium 5 Percent White Rice for global export buyers. Long-grain white rice with soft texture, well milled and polished. Current crop year from Thailand.',
      technicalSpecifications: [
        {attribute: 'Variety', value: 'Long Grain Rice'},
        {attribute: 'Broken', value: '5% Max'},
        {attribute: 'Colour', value: 'White'},
        {attribute: 'Moisture', value: '14% max'},
        {attribute: 'Milling Degree', value: 'Well Milled & Polished'},
        {attribute: 'Country of Origin', value: 'Thailand'},
      ],
    },
    th: {
      name: 'ข้าวขาว ข้าวแตก 5%',
      shortDescription:
        'ข้าวขาวไทยข้าวแตก 5% คุณภาพสูง ราคาแข่งขัน',
      grainSpec: 'สายพันธุ์: ข้าวเจ้ายาว',
      moistureSpec: 'ความชื้น: สูงสุด 14%',
      brokenSpec: 'ข้าวแตก: สูงสุด 5%',
      fullDescription:
        'ข้าวขาวข้าวแตก 5% เกรดส่งออก เนื้อนุ่ม สีดีและขัดมันวาว ปีผลผลิตปัจจุบันจากประเทศไทย',
      technicalSpecifications: [
        {attribute: 'สายพันธุ์', value: 'ข้าวเจ้ายาว'},
        {attribute: 'ข้าวแตก', value: 'สูงสุด 5%'},
        {attribute: 'สี', value: 'ขาว'},
        {attribute: 'ความชื้น', value: 'สูงสุด 14%'},
        {attribute: 'การสี', value: 'สีดีและขัดมัน'},
        {attribute: 'แหล่งกำเนิด', value: 'ประเทศไทย'},
      ],
    },
  },
];

function slugToCatalogKey(slug) {
  return slug.replace(/-/g, '_');
}

function buildCatalogEntry(product, locale) {
  const loc = locale === 'en' ? product.en : product.th;
  /** @type {Record<string, unknown>} */
  const entry = {
    name: loc.name,
    shortDescription: loc.shortDescription,
    availability: locale === 'en' ? 'In Stock' : 'พร้อมส่ง',
    grainSpec: loc.grainSpec,
    moistureSpec: loc.moistureSpec,
    brokenSpec: loc.brokenSpec,
    fullDescription: loc.fullDescription,
    moq: product.moq,
    technicalSpecifications: loc.technicalSpecifications,
  };
  const badge = locale === 'en' ? product.badge : product.badgeTh ?? product.badge;
  if (badge) entry.badge = badge;
  if (product.shipping) entry.shipping = product.shipping;
  if (product.storage) entry.storage = product.storage;
  return entry;
}

function buildProductsTs(products) {
  const lines = products.map((p) => {
    const badge = p.badge ? `\n    badge: ${JSON.stringify(p.badge)},` : '';
    const shipping = p.shipping ? `\n    shipping: ${JSON.stringify(p.shipping)},` : '';
    const storage = p.storage ? `\n    storage: ${JSON.stringify(p.storage)},` : '';
    const featured = p.featured ? `\n    featured: true,` : '';
    const specs = p.en.technicalSpecifications
      .map((s) => `      {attribute: ${JSON.stringify(s.attribute)}, value: ${JSON.stringify(s.value)}}`)
      .join(',\n');
    return `  {
    slug: ${JSON.stringify(p.slug)},${featured}${badge}
    name: ${JSON.stringify(p.en.name)},
    status: "In Stock",
    shortDescription: ${JSON.stringify(p.en.shortDescription)},
    grainSpec: ${JSON.stringify(p.en.grainSpec)},
    moistureSpec: ${JSON.stringify(p.en.moistureSpec)},
    brokenSpec: ${JSON.stringify(p.en.brokenSpec)},
    packaging: ${JSON.stringify(p.packaging)},
    variety: ${JSON.stringify(p.variety)},
    grain: ${JSON.stringify(p.grain)},
    packagingTypes: ${JSON.stringify(p.packagingTypes)},
    fullDescription: ${JSON.stringify(p.en.fullDescription)},
    technicalSpecifications: [
${specs}
    ],
    moq: ${JSON.stringify(p.moq)},${shipping}${storage}
  }`;
  });

  const featuredSlugs = products.filter((p) => p.featured).map((p) => JSON.stringify(p.slug));

  return `// Auto-generated by scripts/sync-rice-catalog.mjs — do not edit manually
export type ProductVariety =
  | "jasmine"
  | "white"
  | "long-grain"
  | "broken"
  | "glutinous"
  | "parboiled"
  | "specialty";

export type ProductGrain = "long" | "short-medium" | "broken" | "mixed";

export type ProductPackaging = "retail" | "25kg" | "50kg" | "jumbo" | "bulk" | "private-label";

export type Product = {
  slug: string;
  name: string;
  badge?: string;
  featured?: boolean;
  status: string;
  shortDescription: string;
  grainSpec: string;
  moistureSpec: string;
  brokenSpec: string;
  packaging: string[];
  variety: ProductVariety;
  grain: ProductGrain;
  packagingTypes: ProductPackaging[];
  fullDescription: string;
  technicalSpecifications: {attribute: string; value: string}[];
  moq: string;
  shipping?: string;
  storage?: string;
};

export const products: Product[] = [
${lines.join(',\n')}
];

export const featuredProductSlugs: string[] = [${featuredSlugs.join(', ')}];

export const varietyFilters: {value: ProductVariety; label: string}[] = [
  {value: "jasmine", label: "Jasmine"},
  {value: "white", label: "White"},
  {value: "long-grain", label: "Long Grain"},
  {value: "broken", label: "Broken"},
  {value: "glutinous", label: "Glutinous"},
  {value: "parboiled", label: "Parboiled"},
  {value: "specialty", label: "Specialty"},
];

export const grainFilters: {value: ProductGrain; label: string}[] = [
  {value: "long", label: "Long Grain"},
  {value: "short-medium", label: "Short/Medium"},
  {value: "broken", label: "Broken"},
  {value: "mixed", label: "Mixed"},
];

export const packagingFilters: {value: ProductPackaging; label: string}[] = [
  {value: "retail", label: "Retail"},
  {value: "25kg", label: "25kg Bags"},
  {value: "50kg", label: "50kg Bags"},
  {value: "jumbo", label: "1MT Jumbo"},
  {value: "bulk", label: "Bulk"},
  {value: "private-label", label: "Private Label"},
];
`;
}

function main() {
  if (RICE_PRODUCTS.length !== 22) {
    console.error(`Expected 22 products, found ${RICE_PRODUCTS.length}`);
    process.exit(1);
  }

  fs.writeFileSync(path.join(ROOT, 'lib', 'products.ts'), buildProductsTs(RICE_PRODUCTS), 'utf8');

  for (const locale of ['en', 'th']) {
    const filePath = path.join(ROOT, 'messages', `${locale}.json`);
    const messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    /** @type {Record<string, unknown>} */
    const catalog = {};
    for (const p of RICE_PRODUCTS) {
      catalog[slugToCatalogKey(p.slug)] = buildCatalogEntry(p, locale);
    }
    messages.products.catalog = catalog;
    fs.writeFileSync(filePath, `${JSON.stringify(messages, null, 2)}\n`, 'utf8');
  }

  console.log(`Synced ${RICE_PRODUCTS.length} products`);
}

main();
