'use client';

import {FormEvent, useState} from 'react';
import PrivacyConsentLabel from '@/components/legal/PrivacyConsentLabel';
import Button from '@/components/ui/Button';
import {useLocale, useTranslations} from 'next-intl';

type ApiResponse =
  | {ok: true; message?: string}
  | {ok: false; code: 'INVALID' | 'RATE_LIMITED' | 'SERVER_ERROR'};

export default function NewsletterSignup() {
  const locale = useLocale();
  const tf = useTranslations('footer');
  const [email, setEmail] = useState('');
  const [gdpr, setGdpr] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorKey, setErrorKey] = useState<'INVALID' | 'RATE_LIMITED' | 'SERVER_ERROR' | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorKey(null);

    const formEl = event.currentTarget;
    const trap = formEl.elements.namedItem('company_website_url') as HTMLInputElement | null;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: email.trim(),
          honeypot: trap?.value ?? '',
          gdprConsent: gdpr,
          locale,
        }),
      });

      const data = (await res.json()) as ApiResponse;

      if (res.ok && data.ok === true) {
        setStatus('success');
        setEmail('');
        setGdpr(false);
        return;
      }

      if ('code' in data && data.code === 'RATE_LIMITED') {
        setErrorKey('RATE_LIMITED');
        setStatus('error');
        return;
      }

      if ('code' in data && data.code === 'INVALID') {
        setErrorKey('INVALID');
        setStatus('error');
        return;
      }

      setErrorKey('SERVER_ERROR');
      setStatus('error');
    } catch {
      setErrorKey('SERVER_ERROR');
      setStatus('error');
    }
  }

  return (
    <form className="relative mt-4 flex flex-col gap-3" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="company_website_url">
        {tf('newsletterHoneyLabel')}
      </label>
      <input
        type="text"
        id="company_website_url"
        name="company_website_url"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
        className="sr-only"
        aria-hidden
      />

      <input
        type="email"
        name="newsletter_email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder={tf('newsletterPlaceholder')}
        autoComplete="email"
        className="rounded-md border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-gold focus:outline-none"
        aria-describedby="newsletter-footer-status"
      />

      <label className="flex items-start gap-2 text-xs text-white/85">
        <input
          type="checkbox"
          checked={gdpr}
          onChange={(e) => setGdpr(e.target.checked)}
          required
          className="mt-1"
        />
        <PrivacyConsentLabel
          namespace="footer"
          messageKey="newsletterGdpr"
          linkClassName="decoration-gold/60 hover:text-gold-light"
        />
      </label>

      <Button type="submit" size="md" disabled={status === 'loading'}>
        {status === 'loading' ? tf('newsletterSending') : tf('subscribe')}
      </Button>

      <p id="newsletter-footer-status" className="min-h-[1.25rem] text-xs" role="status">
        {status === 'success' ? (
          <span className="text-gold-light">{tf('newsletterSuccess')}</span>
        ) : null}
        {status === 'error' && errorKey === 'INVALID' ? (
          <span className="text-red-300">{tf('newsletterErrorInvalid')}</span>
        ) : null}
        {status === 'error' && errorKey === 'RATE_LIMITED' ? (
          <span className="text-red-300">{tf('newsletterErrorRateLimited')}</span>
        ) : null}
        {status === 'error' && errorKey === 'SERVER_ERROR' ? (
          <span className="text-red-300">{tf('newsletterErrorServer')}</span>
        ) : null}
      </p>
    </form>
  );
}
