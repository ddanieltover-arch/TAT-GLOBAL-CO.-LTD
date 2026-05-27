function hasUsableValue(value: string | undefined): value is string {
  return Boolean(
    value &&
      !value.includes('...') &&
      !value.includes('[') &&
      !value.toLowerCase().includes('placeholder') &&
      !value.toLowerCase().startsWith('your_') &&
      !value.toLowerCase().startsWith('your-'),
  );
}

export function isSupabaseAuthConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return Boolean(
    hasUsableValue(url) &&
      hasUsableValue(anonKey) &&
      /^https?:\/\//.test(url) &&
      anonKey.length > 20,
  );
}

export function getAdminEmails(): Set<string> {
  const defaults = ['sales@tatglcoltd.com'];
  const configured = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return new Set([...defaults, ...configured]);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && getAdminEmails().has(email.toLowerCase()));
}
