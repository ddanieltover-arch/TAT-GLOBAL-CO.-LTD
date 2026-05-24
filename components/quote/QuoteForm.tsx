'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {CheckCircle2, Loader2} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  PACKAGING_OPTIONS,
  PRODUCT_LABEL_BY_SLUG,
  PRODUCT_OPTIONS,
  PREFERRED_CONTACT_OPTIONS,
  PURCHASE_TIMELINE_OPTIONS,
  quoteClientSchema,
  type QuoteClientValues,
} from '@/lib/schema';
import {products} from '@/lib/products';
import CatalogDownload from '@/components/layout/CatalogDownload';
import PrivacyConsentLabel from '@/components/legal/PrivacyConsentLabel';
import Button from '@/components/ui/Button';
import {useQuoteModal} from './QuoteModalContext';

type SubmitState = 'idle' | 'submitting' | 'success';

const PACKAGING_KEYS = ['p25', 'p50', 'pJumbo', 'pPrivate', 'pOther'] as const;
const TIMELINE_KEYS = ['t30', 't13', 't36', 'tExplore'] as const;
const CONTACT_KEYS = ['email', 'whatsapp', 'phone'] as const;

export default function QuoteForm() {
  const locale = useLocale();
  const {prefilledProductSlug} = useQuoteModal();
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string>('');

  const t = useTranslations('quote');
  const tf = useTranslations('quote.fields');
  const tpo = useTranslations('quote.productOptions');
  const tPack = useTranslations('quote.packagingOptions');
  const tTime = useTranslations('quote.timelineOptions');
  const tContact = useTranslations('quote.contactMethods');
  const tPh = useTranslations('quote.placeholders');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm<QuoteClientValues>({
    resolver: zodResolver(quoteClientSchema),
    defaultValues: {
      preferredContact: 'Email',
    },
  });

  useEffect(() => {
    if (prefilledProductSlug) {
      const product = PRODUCT_LABEL_BY_SLUG[prefilledProductSlug];
      if (product) {
        setValue('productInterested', product);
      }
    }
  }, [prefilledProductSlug, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState('submitting');
    setSubmitError('');
    try {
      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('companyName', values.companyName);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('whatsapp', values.whatsapp);
      formData.append('country', values.country);
      formData.append('productInterested', values.productInterested);
      formData.append('quantityRequired', values.quantityRequired);
      formData.append('packagingPreference', values.packagingPreference);
      formData.append('deliveryDestination', values.deliveryDestination);
      formData.append('message', values.message);
      formData.append('preferredContact', values.preferredContact || '');
      formData.append('purchaseTimeline', values.purchaseTimeline || '');
      formData.append('gdprConsent', values.gdprConsent ? 'true' : 'false');
      formData.append('honeypot', values.honeypot || '');
      formData.append('locale', locale);

      const fileList = values.fileAttachment as FileList | undefined;
      const file = fileList?.[0];
      if (file) {
        formData.append('fileAttachment', file);
      }

      const response = await fetch('/api/quote', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json()) as {message?: string};
        throw new Error(payload.message || 'Failed to submit quote request.');
      }

      setSubmitState('success');
      reset();
    } catch (error) {
      setSubmitState('idle');
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
    }
  });

  if (submitState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <CheckCircle2 className="h-14 w-14 text-primary" />
        <h3 className="mt-4 font-display text-3xl text-primary-dark">{t('successTitle')}</h3>
        <p className="mt-3 max-w-xl text-gray-700">{t('successBody')}</p>
        <CatalogDownload className="mt-6" variant="inline" />
      </div>
    );
  }

  return (
    <form className="space-y-5 px-6 py-6" onSubmit={onSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField label={tf('fullName')} error={errors.fullName?.message}>
          <input className={fieldClass} {...register('fullName')} />
        </InputField>
        <InputField label={tf('companyName')} error={errors.companyName?.message}>
          <input className={fieldClass} {...register('companyName')} />
        </InputField>
        <InputField label={tf('email')} error={errors.email?.message}>
          <input type="email" className={fieldClass} {...register('email')} />
        </InputField>
        <InputField label={tf('phone')} error={errors.phone?.message}>
          <input className={fieldClass} {...register('phone')} />
        </InputField>
        <InputField label={tf('whatsapp')} error={errors.whatsapp?.message}>
          <input className={fieldClass} {...register('whatsapp')} />
        </InputField>
        <InputField label={tf('country')} error={errors.country?.message}>
          <input className={fieldClass} {...register('country')} />
        </InputField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField label={tf('product')} error={errors.productInterested?.message}>
          <select className={fieldClass} {...register('productInterested')}>
            <option value="">{t('selectProduct')}</option>
            {PRODUCT_OPTIONS.map((option, idx) => (
              <option key={option} value={option}>
                {idx < products.length ? products[idx].name : tpo('multiple')}
              </option>
            ))}
          </select>
        </InputField>
        <InputField label={tf('quantity')} error={errors.quantityRequired?.message}>
          <input
            className={fieldClass}
            placeholder={tPh('quantityExample')}
            {...register('quantityRequired')}
          />
        </InputField>
        <InputField label={tf('packaging')} error={errors.packagingPreference?.message}>
          <select className={fieldClass} {...register('packagingPreference')}>
            <option value="">{t('selectPackaging')}</option>
            {PACKAGING_OPTIONS.map((option, idx) => (
              <option key={option} value={option}>
                {tPack(PACKAGING_KEYS[idx])}
              </option>
            ))}
          </select>
        </InputField>
        <InputField label={tf('destination')} error={errors.deliveryDestination?.message}>
          <input
            className={fieldClass}
            placeholder={tPh('destinationExample')}
            {...register('deliveryDestination')}
          />
        </InputField>
        <InputField label={tf('file')} error={undefined}>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className={fieldClass}
            {...register('fileAttachment')}
          />
        </InputField>
      </div>

      <InputField label={tf('message')} error={errors.message?.message}>
        <textarea rows={4} className={`${fieldClass} resize-none`} {...register('message')} />
      </InputField>

      <div className="grid gap-5 sm:grid-cols-2">
        <InputField label={tf('contactMethod')} error={undefined}>
          <div className="flex flex-wrap gap-3">
            {PREFERRED_CONTACT_OPTIONS.map((option, idx) => (
              <label key={option} className="flex items-center gap-2 text-sm text-gray-700">
                <input type="radio" value={option} {...register('preferredContact')} />
                {tContact(CONTACT_KEYS[idx])}
              </label>
            ))}
          </div>
        </InputField>
        <InputField label={tf('timeline')} error={errors.purchaseTimeline?.message}>
          <select className={fieldClass} {...register('purchaseTimeline')}>
            <option value="">{t('selectTimeline')}</option>
            {PURCHASE_TIMELINE_OPTIONS.map((option, idx) => (
              <option key={option} value={option}>
                {tTime(TIMELINE_KEYS[idx])}
              </option>
            ))}
          </select>
        </InputField>
      </div>

      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register('honeypot')} />

      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input type="checkbox" className="mt-1" {...register('gdprConsent')} />
        <PrivacyConsentLabel namespace="quoteForm" messageKey="gdpr" />
      </label>
      {errors.gdprConsent?.message ? (
        <p className="text-sm text-red-600">{t('gdprHint')}</p>
      ) : null}

      {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

      <Button type="submit" size="md" fullWidth disabled={submitState === 'submitting'}>
        {submitState === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('sending')}
          </>
        ) : (
          t('submit')
        )}
      </Button>
    </form>
  );
}

function InputField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </label>
  );
}

const fieldClass =
  'w-full rounded-md border border-gray-100 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 transition focus:border-gold';
