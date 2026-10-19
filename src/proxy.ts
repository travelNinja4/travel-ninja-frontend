// documentation https://nextjs.org/docs/app/api-reference/file-conventions/proxy
// Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (export `proxy`).

import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIES, ROUTES } from '@/constants/strings';
import { refreshSession } from '@/server/session';

// Every route under these prefixes is reachable without a session
// (e.g. /login/forgot-password, /login/reset-password/:token, /create-account/verify)
const PUBLIC_ROUTE_PREFIXES = [ROUTES.LOGIN, ROUTES.CREATE_ACCOUNT];

const isPublicRoute = (pathname: string) =>
  PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export async function proxy(request: NextRequest) {
  // The backend sets the session cookies on login, and server actions copy them onto our domain.
  // The access cookie expires with the token, so its presence means the session is live.
  if (isPublicRoute(request.nextUrl.pathname) || request.cookies.has(AUTH_COOKIES.ACCESS_TOKEN)) {
    return NextResponse.next();
  }

  // Access token expired but the refresh token may still be valid (remember me, or the same
  // browser session): refresh here, the one place page requests can save the new cookies
  const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;
  const refreshed =
    refreshToken && (await refreshSession(refreshToken, request.headers.get('user-agent')));

  if (!refreshed) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  // The page and its backend calls read the new cookies from the request; the browser keeps them
  // from the response
  refreshed.forEach(({ name, value }) => request.cookies.set(name, value));
  const response = NextResponse.next({ request: { headers: request.headers } });
  refreshed.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}

// Run on pages only: skip Next.js internals, API routes and static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
