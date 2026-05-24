import type {AppLocale} from '@/lib/translations';

type ContactCopy = {
  subject: string;
  badge: string;
  title: (name: string) => string;
  preheader: string;
  intro: string;
  summaryTitle: string;
  nextSteps: string;
  footer: string;
  ctaProducts: string;
  ctaContact: string;
  fieldMessage: string;
};

type QuoteCopy = {
  subject: string;
  badge: string;
  title: (name: string) => string;
  preheader: string;
  intro: string;
  summaryTitle: string;
  nextSteps: string;
  footer: string;
  ctaProducts: string;
  fields: {
    product: string;
    quantity: string;
    packaging: string;
    destination: string;
    company: string;
  };
};

type NewsletterCopy = {
  subject: string;
  badge: string;
  title: string;
  preheader: string;
  intro: string;
  body: string;
  footer: string;
  ctaProducts: string;
};

const copy: Record<AppLocale, {contact: ContactCopy; quote: QuoteCopy; newsletter: NewsletterCopy}> = {
  en: {
    contact: {
      subject: 'We received your message — TAT Global',
      badge: 'Confirmation',
      title: (name) => `Thank you, ${name}`,
      preheader: 'Our export team will respond within 24 business hours.',
      intro:
        'We have received your message and a member of our export sales team will get back to you shortly.',
      summaryTitle: 'Your message summary',
      nextSteps:
        'We typically respond within <strong>24 business hours</strong>. For urgent bulk orders, you can also reach us on WhatsApp or email sales@tatglcoltd.com.',
      footer: 'This is an automated confirmation — please do not reply with sensitive data.',
      ctaProducts: 'Browse products',
      ctaContact: 'Contact sales',
      fieldMessage: 'Your message',
    },
    quote: {
      subject: 'Your quote request is confirmed — TAT Global',
      badge: 'Quote received',
      title: (name) => `Thank you, ${name}`,
      preheader: 'Our export team is reviewing your requirements.',
      intro:
        'We have received your bulk rice quote request. Our export specialists are reviewing your requirements and will prepare a competitive offer.',
      summaryTitle: 'Request summary',
      nextSteps:
        'Expect a response within <strong>24 hours</strong> on business days. If you attached specifications, our team will review them with your inquiry.',
      footer: 'Questions? Reply to this email and our team will assist you.',
      ctaProducts: 'View product catalog',
      fields: {
        product: 'Product',
        quantity: 'Quantity',
        packaging: 'Packaging',
        destination: 'Delivery destination',
        company: 'Company',
      },
    },
    newsletter: {
      subject: 'You are subscribed — TAT Global',
      badge: 'Welcome',
      title: 'Thank you for subscribing',
      preheader: 'Premium Thai rice news and export updates.',
      intro: 'You are now on our mailing list.',
      body:
        'You will receive occasional updates on Thai rice grades, export markets, and new products from TAT Global. We respect your inbox — you can unsubscribe anytime by replying to this email.',
      footer: 'Premium Thai Rice — Manufactured and Exported from Thailand to the World.',
      ctaProducts: 'Explore our products',
    },
  },
  th: {
    contact: {
      subject: 'เราได้รับข้อความของคุณแล้ว — TAT Global',
      badge: 'ยืนยันแล้ว',
      title: (name) => `ขอบคุณคุณ${name}`,
      preheader: 'ทีมส่งออกจะติดต่อกลับภายใน 24 ชั่วโมงทำการ',
      intro: 'เราได้รับข้อความของคุณแล้ว และทีมขายส่งออกจะติดต่อกลับโดยเร็ว',
      summaryTitle: 'สรุปข้อความของคุณ',
      nextSteps:
        'โดยทั่วไปเราตอบกลับภายใน <strong>24 ชั่วโมงทำการ</strong> หากเป็นออเดอร์ด่วน สามารถติดต่อทาง WhatsApp หรือ sales@tatglcoltd.com',
      footer: 'อีเมลยืนยันอัตโนมัติ — กรุณาอย่าตอบกลับด้วยข้อมูลที่ละเอียดอ่อน',
      ctaProducts: 'ดูสินค้า',
      ctaContact: 'ติดต่อฝ่ายขาย',
      fieldMessage: 'ข้อความของคุณ',
    },
    quote: {
      subject: 'ยืนยันคำขอใบเสนอราคาแล้ว — TAT Global',
      badge: 'ได้รับคำขอแล้ว',
      title: (name) => `ขอบคุณคุณ${name}`,
      preheader: 'ทีมส่งออกกำลังตรวจสอบความต้องการของคุณ',
      intro:
        'เราได้รับคำขอใบเสนอราคาข้าวแบบขายส่งแล้ว ทีมผู้เชี่ยวชาญส่งออกกำลังตรวจสอบและจัดเตรียมข้อเสนอที่แข่งขันได้',
      summaryTitle: 'สรุปคำขอ',
      nextSteps:
        'คาดว่าจะตอบกลับภายใน <strong>24 ชั่วโมง</strong> ในวันทำการ หากแนบเอกสารสเปก ทีมจะตรวจสอบพร้อมคำขอของคุณ',
      footer: 'มีคำถาม? ตอบกลับอีเมลนี้ ทีมงานพร้อมช่วยเหลือ',
      ctaProducts: 'ดูแคตตาล็อกสินค้า',
      fields: {
        product: 'สินค้า',
        quantity: 'ปริมาณ',
        packaging: 'บรรจุภัณฑ์',
        destination: 'ปลายทางจัดส่ง',
        company: 'บริษัท',
      },
    },
    newsletter: {
      subject: 'สมัครรับข่าวสารแล้ว — TAT Global',
      badge: 'ยินดีต้อนรับ',
      title: 'ขอบคุณที่สมัครรับข่าวสาร',
      preheader: 'ข่าวข้าวไทยพรีเมียมและการส่งออก',
      intro: 'คุณอยู่ในรายชื่อรับข่าวสารของเราแล้ว',
      body:
        'คุณจะได้รับข่าวสารเป็นครั้งคราวเกี่ยวกับเกรดข้าวไทย ตลาดส่งออก และสินค้าใหม่จาก TAT Global เราเคารพกล่องจดหมายของคุณ — ยกเลิกได้ทุกเมื่อโดยตอบกลับอีเมลนี้',
      footer: 'ข้าวไทยพรีเมียม — ผลิตและส่งออกจากประเทศไทยสู่ทั่วโลก',
      ctaProducts: 'สำรวจสินค้า',
    },
  },
};

export function getConfirmationCopy(locale: AppLocale) {
  return copy[locale];
}
