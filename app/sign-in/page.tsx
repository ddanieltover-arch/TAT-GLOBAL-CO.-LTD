import {AdminSignInForm} from '@/components/admin/admin-sign-in-form';
import {isSupabaseAuthConfigured} from '@/lib/auth';

export default function SignInPage() {
  if (!isSupabaseAuthConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
        <div className="max-w-md rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-card">
          <h1 className="text-xl font-bold text-primary">Admin sign-in is not configured</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Add <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then create admin users in
            Supabase Auth.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <AdminSignInForm />
    </main>
  );
}
