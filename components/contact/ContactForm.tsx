'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {CheckCircle2, Loader2} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {cloneElement, useState, type ReactElement} from 'react';
import {useForm} from 'react-hook-form';
import PrivacyConsentLabel from '@/components/legal/PrivacyConsentLabel';
import Button from '@/components/ui/Button';
import {contactRequestSchema, type ContactRequest} from '@/lib/schema';

type SubmitState = 'idle' | 'submitting' | 'success';

const fieldClass =
  'w-full rounded-md border border-gray-100 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20';

export default function ContactForm() {
  const t = useTranslations('contactPage');
  const tCta = useTranslations('cta');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<ContactRequest>({
    resolver: zodResolver(contactRequestSchema),
    defaultValues: {
      honeypot: '',
      gdprConsent: undefined,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState('submitting');
    setSubmitError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as {message?: string};

      if (!response.ok) {
        throw new Error(payload.message || t('submitError'));
      }

      setSubmitState('success');
      reset();
    } catch (error) {
      setSubmitState('idle');
      setSubmitError(error instanceof Error ? error.message : t('submitError'));
    }
  });

  if (submitState === 'success') {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden />
        <h3 className="mt-4 font-display text-2xl text-gray-900">{t('successTitle')}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form className="mt-5 space-y-3" onSubmit={onSubmit} noValidate>
      <Field id="contact-fullName" label={t('fields.fullName')} error={errors.fullName?.message}>
        <input
          className={fieldClass}
          autoComplete="name"
          placeholder={t('namePlaceholder')}
          {...register('fullName')}
        />
      </Field>

      <Field id="contact-company" label={t('fields.companyName')} error={errors.companyName?.message}>
        <input
          className={fieldClass}
          autoComplete="organization"
          placeholder={t('companyPlaceholder')}
          {...register('companyName')}
        />
      </Field>

      <Field id="contact-email" label={t('fields.email')} error={errors.email?.message}>
        <input
          type="email"
          className={fieldClass}
          autoComplete="email"
          placeholder={t('emailPlaceholder')}
          {...register('email')}
        />
      </Field>

      <Field id="contact-message" label={t('fields.message')} error={errors.message?.message}>
        <textarea
          rows={5}
          className={`${fieldClass} resize-none`}
          placeholder={t('messagePlaceholder')}
          {...register('message')}
        />
      </Field>

      <input
        type="text"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        {...register('honeypot')}
      />

      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input type="checkbox" className="mt-1" {...register('gdprConsent')} />
        <PrivacyConsentLabel namespace="contactPage" messageKey="gdpr" />
      </label>
      {errors.gdprConsent ? (
        <p className="text-sm text-red-600" role="alert">
          {t('gdprHint')}
        </p>
      ) : null}

      {submitError ? (
        <p className="text-sm text-red-600" role="alert">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" size="md" fullWidth disabled={submitState === 'submitting'}>
        {submitState === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {t('sending')}
          </>
        ) : (
          tCta('sendInquiry')
        )}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactElement;
}) {
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : undefined;

  return (
    <div className="block">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {cloneElement(children, {
        id,
        'aria-invalid': Boolean(error),
        ...(describedBy ? {'aria-describedby': describedBy} : {}),
      })}
      {error ? (
        <p id={errorId} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
