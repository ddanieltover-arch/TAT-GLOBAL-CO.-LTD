import createMiddleware from 'next-intl/middleware';
import {type NextRequest} from 'next/server';
import {routing} from './i18n/routing';
import {updateSupabaseSession} from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

function isOutsideLocaleRouting(pathname: string) {
  return (
    pathname === '/sign-in' ||
    pathname.startsWith('/sign-in/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/')
  );
}

export default async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (pathname.startsWith('/api/admin') || isOutsideLocaleRouting(pathname)) {
    return updateSupabaseSession(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/api/admin/:path*'],
};
