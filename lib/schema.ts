import {z} from "zod";
import {locales} from "./translations";
import {products} from "./products";

const localeField = z.enum(locales).optional();

export const MULTIPLE_PRODUCTS_OPTION = "Multiple Products" as const;

export const PRODUCT_OPTIONS = [
  ...products.map((product) => product.name),
  MULTIPLE_PRODUCTS_OPTION,
] as const;

export const PACKAGING_OPTIONS = [
  "25kg bags",
  "50kg bags",
  "1MT Jumbo",
  "Private Label",
  "Other",
] as const;

export const PURCHASE_TIMELINE_OPTIONS = [
  "Within 30 days",
  "1–3 months",
  "3–6 months",
  "Just exploring",
] as const;

export const PREFERRED_CONTACT_OPTIONS = ["Email", "WhatsApp", "Phone"] as const;

const quoteBaseSchema = z.object({
  fullName: z.string().trim().min(2),
  companyName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  whatsapp: z.string().trim().min(7),
  country: z.string().trim().min(2),
  productInterested: z.enum(
    PRODUCT_OPTIONS as unknown as [string, ...string[]],
  ),
  quantityRequired: z.string().trim().min(1),
  packagingPreference: z.enum(PACKAGING_OPTIONS),
  deliveryDestination: z.string().trim().min(2),
  message: z.string().trim().min(10),
  preferredContact: z.enum(PREFERRED_CONTACT_OPTIONS).optional(),
  purchaseTimeline: z.enum(PURCHASE_TIMELINE_OPTIONS).optional(),
  gdprConsent: z.literal(true),
  honeypot: z.string().trim().max(0).optional(),
  locale: localeField,
});

export const quoteClientSchema = quoteBaseSchema.extend({
  fileAttachment: z.any().optional(),
});

export const quoteServerSchema = quoteBaseSchema.extend({
  fileAttachment: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (file) =>
        !file ||
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type),
      "Only PDF or DOC files are allowed",
    ),
});

export type QuoteClientValues = z.infer<typeof quoteClientSchema>;
export type QuoteServerValues = z.infer<typeof quoteServerSchema>;

export const newsletterRequestSchema = z.object({
  email: z.string().trim().email().max(254),
  honeypot: z.string().trim().max(0).optional(),
  gdprConsent: z.literal(true),
  locale: localeField,
});

export type NewsletterRequest = z.infer<typeof newsletterRequestSchema>;

export const contactRequestSchema = z.object({
  fullName: z.string().trim().min(2),
  companyName: z.string().trim().min(2),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  gdprConsent: z.literal(true),
  honeypot: z.string().trim().max(0).optional(),
  locale: localeField,
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;

export const PRODUCT_LABEL_BY_SLUG: Record<string, (typeof PRODUCT_OPTIONS)[number]> =
  Object.fromEntries(products.map((product) => [product.slug, product.name])) as Record<
    string,
    (typeof PRODUCT_OPTIONS)[number]
  >;
