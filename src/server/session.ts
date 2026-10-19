/**
 * Session cookie helpers shared by the HTTP client (server actions) and the proxy (page requests).
 *
 * The backend rotates the refresh token on every refresh and treats a second use of an old token as
 * theft, revoking the whole login. So a refresh must only happen where the new cookies can be saved
 * (the proxy), and concurrent refreshes with the same token must share one backend call.
 */

import { AUTH_COOKIES } from '@/constants/strings';

type CookieOptions = {
  path?: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

export type ParsedCookie = { name: string; value: string; options: CookieOptions };

// Parses a single Set-Cookie header into the shape cookies().set() expects. The Domain attribute is
// dropped on purpose so the cookie is stored for our own domain instead of the backend's.
export const parseSetCookie = (header: string): ParsedCookie => {
  const [pair, ...attributes] = header.split(';');
  const separator = pair.indexOf('=');
  const name = pair.slice(0, separator).trim();
  const value = decodeURIComponent(pair.slice(separator + 1).trim());
  const options: CookieOptions = {};

  attributes.forEach((attribute) => {
    const [rawKey, ...rest] = attribute.split('=');
    const key = rawKey.trim().toLowerCase();
    const attrValue = rest.join('=').trim();

    if (key === 'path') options.path = attrValue;
    if (key === 'expires') options.expires = new Date(attrValue);
    if (key === 'max-age') options.maxAge = Number(attrValue);
    if (key === 'httponly') options.httpOnly = true;
    if (key === 'secure') options.secure = true;
    if (key === 'samesite') options.sameSite = attrValue.toLowerCase() as CookieOptions['sameSite'];
  });

  return { name, value, options };
};

// Long enough for requests the browser sent with the old token (parallel navigations, prefetches) to
// get the new cookies instead of reusing it
const SHARED_RESULT_MS = 10_000;

const refreshes = new Map<string, Promise<ParsedCookie[] | null>>();

async function requestRefresh(refreshToken: string, userAgent: string | null) {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${AUTH_COOKIES.REFRESH_TOKEN}=${refreshToken}`,
        ...(userAgent && { 'User-Agent': userAgent }),
      },
      body: '{}',
      cache: 'no-store',
    });
    return res.ok ? res.headers.getSetCookie().map(parseSetCookie) : null;
  } catch {
    return null;
  }
}

/**
 * Trades the refresh token for new access + refresh cookies (same remember-me mode as the login).
 * Returns null when the login is over: token missing, expired, revoked or reused.
 */
export function refreshSession(refreshToken: string, userAgent: string | null) {
  let refresh = refreshes.get(refreshToken);
  if (!refresh) {
    refresh = requestRefresh(refreshToken, userAgent);
    refreshes.set(refreshToken, refresh);
    setTimeout(() => refreshes.delete(refreshToken), SHARED_RESULT_MS);
  }
  return refresh;
}
