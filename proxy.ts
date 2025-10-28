// documentation https://nextjs.org/docs/app/api-reference/file-conventions/proxy

import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // check the token is available in the cookies
  const token = request.cookies.get('accessToken')?.value;

  const publicRoutes = ['/login', '/create-account', '/forgot-password', '/reset-password'];

  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  // If route is NOT public and token is missing => redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Apply middleware to ALL routes except static files and API (optional filter)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/public).*)'],
};
