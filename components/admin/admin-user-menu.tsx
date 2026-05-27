'use client';

import {useRouter} from 'next/navigation';
import {LogOut} from 'lucide-react';

export function AdminUserMenu() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch('/api/admin/sign-out', {method: 'POST'}).catch(() => undefined);
    router.replace('/sign-in');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-primary hover:text-primary"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
