-- TAT GLOBAL — admin lead tables (run once in Supabase → SQL Editor → Run)
-- Matches prisma/schema.prisma. Safe to re-run: uses IF NOT EXISTS where possible.

DO $$ BEGIN
  CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "quote_requests" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "whatsapp" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "productInterested" TEXT NOT NULL,
  "quantityRequired" TEXT NOT NULL,
  "packagingPreference" TEXT NOT NULL,
  "deliveryDestination" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "preferredContact" TEXT,
  "purchaseTimeline" TEXT,
  "gdprConsent" BOOLEAN NOT NULL DEFAULT true,
  "locale" TEXT,
  "fileAttachmentName" TEXT,
  "fileAttachmentType" TEXT,
  "fileAttachmentSize" INTEGER,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quote_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "contact_submissions" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "companyName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "gdprConsent" BOOLEAN NOT NULL DEFAULT true,
  "locale" TEXT,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "locale" TEXT,
  "gdprConsent" BOOLEAN NOT NULL DEFAULT true,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "source" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_subscribers_email_key"
  ON "newsletter_subscribers"("email");

CREATE INDEX IF NOT EXISTS "quote_requests_status_idx" ON "quote_requests"("status");
CREATE INDEX IF NOT EXISTS "quote_requests_email_idx" ON "quote_requests"("email");
CREATE INDEX IF NOT EXISTS "quote_requests_createdAt_idx" ON "quote_requests"("createdAt");

CREATE INDEX IF NOT EXISTS "contact_submissions_status_idx" ON "contact_submissions"("status");
CREATE INDEX IF NOT EXISTS "contact_submissions_email_idx" ON "contact_submissions"("email");
CREATE INDEX IF NOT EXISTS "contact_submissions_createdAt_idx" ON "contact_submissions"("createdAt");

CREATE INDEX IF NOT EXISTS "newsletter_subscribers_isActive_idx" ON "newsletter_subscribers"("isActive");
CREATE INDEX IF NOT EXISTS "newsletter_subscribers_createdAt_idx" ON "newsletter_subscribers"("createdAt");
