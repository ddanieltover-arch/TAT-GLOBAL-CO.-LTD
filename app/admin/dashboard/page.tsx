'use client';

import {useEffect, useState} from 'react';
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  Eye,
  FileText,
  Mail,
  Pencil,
  RefreshCw,
  Save,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import {AdminUserMenu} from '@/components/admin/admin-user-menu';
import {cn} from '@/lib/cn';
import {PACKAGING_OPTIONS, PRODUCT_OPTIONS} from '@/lib/schema';
import {formatDate} from '@/lib/utils';

type Tab = 'quotes' | 'contacts' | 'newsletter';
type ItemType = 'quote' | 'contact' | 'newsletter';

function tabToType(tab: Tab): ItemType {
  if (tab === 'quotes') return 'quote';
  if (tab === 'contacts') return 'contact';
  return 'newsletter';
}

const STATUS_OPTIONS = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = 'primary',
}: {
  icon: typeof FileText;
  label: string;
  value: string | number;
  sub?: string;
  tone?: 'primary' | 'gold' | 'blue' | 'earth';
}) {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    gold: 'bg-gold/15 text-gold',
    blue: 'bg-blue-100 text-blue-700',
    earth: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
      <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg', tones[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-gray-900">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function StatusBadge({status, isActive}: {status?: string; isActive?: boolean}) {
  if (typeof isActive === 'boolean') {
    return (
      <span
        className={cn(
          'rounded-full px-2 py-0.5 text-xs font-semibold',
          isActive ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-800',
        )}
      >
        {isActive ? 'Active' : 'Unsubscribed'}
      </span>
    );
  }

  const map: Record<string, string> = {
    NEW: 'bg-primary/10 text-primary',
    READ: 'bg-blue-100 text-blue-700',
    REPLIED: 'bg-gray-100 text-gray-700',
    ARCHIVED: 'bg-amber-100 text-amber-800',
  };

  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', map[status ?? ''] ?? map.NEW)}>
      {status ?? 'NEW'}
    </span>
  );
}

async function fetchSubmissions(tab: Tab) {
  const type = tabToType(tab);
  const res = await fetch(`/api/admin/submissions?type=${type}&limit=50`, {cache: 'no-store'});
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `Unable to load ${type}.`);
  }
  return (data.items ?? []) as Record<string, unknown>[];
}

function DetailField({label, value, full}: {label: string; value: React.ReactNode; full?: boolean}) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <div className="mt-1 whitespace-pre-wrap rounded-lg border border-gray-100 bg-cream p-3 text-sm text-gray-900">
        {value || '-'}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [quotes, setQuotes] = useState<Record<string, unknown>[]>([]);
  const [contacts, setContacts] = useState<Record<string, unknown>[]>([]);
  const [newsletter, setNewsletter] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('quotes');
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [selectedType, setSelectedType] = useState<ItemType>('quote');
  const [selectedTab, setSelectedTab] = useState<Tab>('quotes');
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const fetchData = async () => {
    setLoading(true);
    setLoadError(null);
    setActionError(null);
    try {
      const [q, c, n] = await Promise.all([
        fetchSubmissions('quotes'),
        fetchSubmissions('contacts'),
        fetchSubmissions('newsletter'),
      ]);
      setQuotes(q);
      setContacts(c);
      setNewsletter(n);
    } catch (err) {
      setQuotes([]);
      setContacts([]);
      setNewsletter([]);
      setLoadError(err instanceof Error ? err.message : 'Unable to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const currentItems = tab === 'quotes' ? quotes : tab === 'contacts' ? contacts : newsletter;
  const newQuotes = quotes.filter((q) => q.status === 'NEW').length;
  const newContacts = contacts.filter((c) => c.status === 'NEW').length;
  const activeNewsletter = newsletter.filter((n) => n.isActive !== false).length;

  const openItem = (item: Record<string, unknown>, tabKey: Tab, editing = false) => {
    setSelected(item);
    setSelectedType(tabToType(tabKey));
    setSelectedTab(tabKey);
    setIsEditing(editing);
    setActionError(null);
    setEditValues({...item});
  };

  const updateStatus = async (id: string, tabKey: Tab, status: string) => {
    const type = tabToType(tabKey);
    setActionError(null);
    const res = await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id, type, status}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setActionError(data.error ?? 'Unable to update status.');
      return;
    }
    await fetchData();
  };

  const saveItem = async () => {
    if (!selected) return;
    setActionError(null);
    const res = await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: selected.id, type: selectedType, ...editValues}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setActionError(data.error ?? 'Unable to save.');
      return;
    }
    setSelected(null);
    setIsEditing(false);
    await fetchData();
  };

  const deleteItem = async (item: Record<string, unknown>, tabKey: Tab) => {
    const type = tabToType(tabKey);
    if (!window.confirm('Delete this record permanently?')) return;
    setActionError(null);
    const res = await fetch('/api/admin/submissions', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: item.id, type}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setActionError(data.error ?? 'Unable to delete.');
      return;
    }
    if (selected?.id === item.id) {
      setSelected(null);
      setIsEditing(false);
    }
    await fetchData();
  };

  const inputClass =
    'w-full rounded-lg border border-gray-100 bg-cream px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">TAT Global Co., Ltd</p>
            <h1 className="text-xl font-bold text-primary">Sales Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void fetchData()}
              className="flex items-center gap-1.5 rounded-lg border border-gray-100 px-3 py-1.5 text-sm text-gray-700 hover:text-primary"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              Refresh
            </button>
            <AdminUserMenu />
          </div>
        </div>
      </header>

      <main className="space-y-8 p-6">
        {(loadError || actionError) && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Admin data issue</p>
              <p className="mt-1">{loadError ?? actionError}</p>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={FileText} label="New quote requests" value={newQuotes} sub="Awaiting follow-up" />
          <StatCard icon={Mail} label="New contact messages" value={newContacts} sub="Awaiting follow-up" tone="blue" />
          <StatCard icon={Users} label="Newsletter subscribers" value={activeNewsletter} sub="Active sign-ups" tone="gold" />
          <StatCard icon={TrendingUp} label="Total leads loaded" value={quotes.length + contacts.length} tone="earth" />
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card">
          <div className="flex border-b border-gray-100">
            {(
              [
                ['quotes', 'Quote requests', newQuotes],
                ['contacts', 'Contact messages', newContacts],
                ['newsletter', 'Newsletter', 0],
              ] as const
            ).map(([key, label, badge]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  'px-5 py-3 text-sm font-semibold transition-colors',
                  tab === key ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-900',
                )}
              >
                {label}
                {badge > 0 && (
                  <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-white">{badge}</span>
                )}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <p className="py-12 text-center text-sm text-gray-500">Loading…</p>
            ) : loadError ? (
              <p className="py-12 text-center text-sm text-gray-500">
                In Supabase → SQL Editor, run <code className="text-xs">prisma/supabase-init.sql</code>, or run{' '}
                <code className="text-xs">npm run db:push</code> locally, then refresh.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-100/60">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Name / Email</th>
                    {tab === 'quotes' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Country</th>
                      </>
                    )}
                    {tab === 'contacts' && (
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Company</th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((item) => (
                    <tr key={String(item.id)} className="hover:bg-cream/80">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {tab === 'newsletter' ? String(item.email) : String(item.fullName)}
                        </p>
                        {tab !== 'newsletter' && (
                          <a href={`mailto:${item.email}`} className="text-xs text-primary hover:underline">
                            {String(item.email)}
                          </a>
                        )}
                      </td>
                      {tab === 'quotes' && (
                        <>
                          <td className="px-4 py-3 text-gray-600">{String(item.productInterested ?? '-')}</td>
                          <td className="px-4 py-3 text-gray-600">{String(item.country ?? '-')}</td>
                        </>
                      )}
                      {tab === 'contacts' && (
                        <td className="px-4 py-3 text-gray-600">{String(item.companyName ?? '-')}</td>
                      )}
                      <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                        {formatDate(String(item.createdAt), {month: 'short', day: 'numeric'})}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={String(item.status ?? '')}
                          isActive={tab === 'newsletter' ? Boolean(item.isActive) : undefined}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="View"
                            onClick={() => openItem(item, tab, false)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {tab !== 'newsletter' && item.status === 'NEW' && (
                            <button
                              type="button"
                              title="Mark read"
                              onClick={() => void updateStatus(String(item.id), tab, 'READ')}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {tab === 'newsletter' && item.isActive !== false && (
                            <button
                              type="button"
                              title="Unsubscribe"
                              onClick={() => void updateStatus(String(item.id), 'newsletter', 'ARCHIVED')}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Delete"
                            onClick={() => void deleteItem(item, tab)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-sm text-gray-500">
                        No records yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {isEditing ? 'Edit record' : 'Record details'}
                </h2>
                <p className="text-sm text-gray-500">{formatDate(String(selected.createdAt))}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setIsEditing(false);
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {isEditing && selectedType === 'quote' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['fullName', 'Full name'],
                    ['companyName', 'Company'],
                    ['email', 'Email'],
                    ['phone', 'Phone'],
                    ['whatsapp', 'WhatsApp'],
                    ['country', 'Country'],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">{label}</label>
                      <input
                        className={inputClass}
                        value={String(editValues[key] ?? '')}
                        onChange={(e) => setEditValues((c) => ({...c, [key]: e.target.value}))}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Product</label>
                    <select
                      className={inputClass}
                      value={String(editValues.productInterested ?? '')}
                      onChange={(e) => setEditValues((c) => ({...c, productInterested: e.target.value}))}
                    >
                      {PRODUCT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Packaging</label>
                    <select
                      className={inputClass}
                      value={String(editValues.packagingPreference ?? '')}
                      onChange={(e) => setEditValues((c) => ({...c, packagingPreference: e.target.value}))}
                    >
                      {PACKAGING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Message</label>
                    <textarea
                      rows={4}
                      className={inputClass}
                      value={String(editValues.message ?? '')}
                      onChange={(e) => setEditValues((c) => ({...c, message: e.target.value}))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Status</label>
                    <select
                      className={inputClass}
                      value={String(editValues.status ?? 'NEW')}
                      onChange={(e) => setEditValues((c) => ({...c, status: e.target.value}))}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : isEditing && selectedType === 'contact' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ['fullName', 'Full name'],
                    ['companyName', 'Company'],
                    ['email', 'Email'],
                  ].map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">{label}</label>
                      <input
                        className={inputClass}
                        value={String(editValues[key] ?? '')}
                        onChange={(e) => setEditValues((c) => ({...c, [key]: e.target.value}))}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Message</label>
                    <textarea
                      rows={5}
                      className={inputClass}
                      value={String(editValues.message ?? '')}
                      onChange={(e) => setEditValues((c) => ({...c, message: e.target.value}))}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Status</label>
                    <select
                      className={inputClass}
                      value={String(editValues.status ?? 'NEW')}
                      onChange={(e) => setEditValues((c) => ({...c, status: e.target.value}))}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : isEditing && selectedType === 'newsletter' ? (
                <div className="grid gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Email</label>
                    <input
                      className={inputClass}
                      value={String(editValues.email ?? '')}
                      onChange={(e) => setEditValues((c) => ({...c, email: e.target.value}))}
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(editValues.isActive)}
                      onChange={(e) => setEditValues((c) => ({...c, isActive: e.target.checked}))}
                    />
                    Active subscriber
                  </label>
                </div>
              ) : selectedType === 'quote' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailField label="Full name" value={String(selected.fullName ?? '')} />
                  <DetailField label="Company" value={String(selected.companyName ?? '')} />
                  <DetailField label="Email" value={String(selected.email ?? '')} />
                  <DetailField label="Phone" value={String(selected.phone ?? '')} />
                  <DetailField label="WhatsApp" value={String(selected.whatsapp ?? '')} />
                  <DetailField label="Country" value={String(selected.country ?? '')} />
                  <DetailField label="Product" value={String(selected.productInterested ?? '')} />
                  <DetailField label="Quantity" value={String(selected.quantityRequired ?? '')} />
                  <DetailField label="Packaging" value={String(selected.packagingPreference ?? '')} />
                  <DetailField label="Destination" value={String(selected.deliveryDestination ?? '')} />
                  <DetailField label="Preferred contact" value={String(selected.preferredContact ?? '')} />
                  <DetailField label="Timeline" value={String(selected.purchaseTimeline ?? '')} />
                  <DetailField label="Locale" value={String(selected.locale ?? '')} />
                  <DetailField label="Attachment" value={String(selected.fileAttachmentName ?? '')} />
                  <DetailField label="Message" value={String(selected.message ?? '')} full />
                  <DetailField label="Status" value={<StatusBadge status={String(selected.status)} />} />
                </div>
              ) : selectedType === 'contact' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailField label="Full name" value={String(selected.fullName ?? '')} />
                  <DetailField label="Company" value={String(selected.companyName ?? '')} />
                  <DetailField label="Email" value={String(selected.email ?? '')} />
                  <DetailField label="Message" value={String(selected.message ?? '')} full />
                  <DetailField label="Locale" value={String(selected.locale ?? '')} />
                  <DetailField label="Status" value={<StatusBadge status={String(selected.status)} />} />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailField label="Email" value={String(selected.email ?? '')} />
                  <DetailField label="Locale" value={String(selected.locale ?? '')} />
                  <DetailField
                    label="Status"
                    value={<StatusBadge isActive={Boolean(selected.isActive)} />}
                  />
                  <DetailField label="Source" value={String(selected.source ?? '')} />
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => void deleteItem(selected, selectedTab)}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => void saveItem()}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
