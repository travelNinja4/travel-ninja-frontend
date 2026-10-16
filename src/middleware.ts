// documentation https://nextjs.org/docs/app/building-your-application/routing/middleware
// Note: Next.js 16 renames this file convention to `proxy.ts` (export `proxy`). This project is on Next 15.

import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/constants/strings';

// Every route under these prefixes is reachable without a session
// (e.g. /login/verify, /login/forgot-password, /login/reset-password/:token, /create-account/verify)
const PUBLIC_ROUTE_PREFIXES = [ROUTES.LOGIN, ROUTES.CREATE_ACCOUNT];

const isPublicRoute = (pathname: string) =>
  PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

export function middleware(request: NextRequest) {
  // the backend sets the accessToken cookie, and server actions copy it onto our domain
  const token = request.cookies.get('accessToken')?.value;

  // If route is NOT public and token is missing => redirect to login
  if (!isPublicRoute(request.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

// Run on pages only: skip Next.js internals, API routes and static files
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
