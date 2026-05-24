export function getTeamInboxEmail(): string {
  return process.env.QUOTE_TO_EMAIL || 'sales@tatglcoltd.com';
}

export function getContactTeamEmail(): string {
  return process.env.CONTACT_TO_EMAIL || getTeamInboxEmail();
}

export function getNewsletterTeamEmail(): string {
  return process.env.NEWSLETTER_TO_EMAIL || getTeamInboxEmail();
}

export function getDefaultFromEmail(): string {
  return process.env.QUOTE_FROM_EMAIL || 'onboarding@resend.dev';
}

export function getContactFromEmail(): string {
  return process.env.CONTACT_FROM_EMAIL || getDefaultFromEmail();
}

export function getNewsletterFromEmail(): string {
  return process.env.NEWSLETTER_FROM_EMAIL || getDefaultFromEmail();
}

export function getSalesReplyTo(): string {
  const raw =
    process.env.QUOTE_TO_EMAIL?.split(',')[0]?.trim() ||
    process.env.CONTACT_TO_EMAIL?.split(',')[0]?.trim() ||
    'sales@tatglcoltd.com';
  return raw.replace(/^mailto:/i, '');
}
