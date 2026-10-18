/**
 * Server-only HTTP client for the backend API. Replaces the old axios apiClient + /api/proxy route.
 *
 * - The backend URL (API_BASE_URL) never reaches the browser.
 * - The browser's cookies are forwarded to the backend, so the backend's auth cookies keep working.
 * - `persistCookies: true` copies the backend's Set-Cookie headers onto our own domain. Next.js only allows
 *   setting cookies in Server Actions and Route Handlers, so use it only from there.
 * - A 401 on a non-auth endpoint triggers one refresh-token call and a retry.
 */

import 'server-only';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  body?: unknown;
  persistCookies?: boolean;
  /** Next.js fetch cache options, e.g. `{ revalidate: 86400 }` for static reference data. */
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
}

/**
 * Error thrown for any non-2xx backend response. `messages` is always a list of user-facing strings.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public messages: string[],
  ) {
    super(messages.join(', '));
    this.name = 'ApiError';
  }
}

// Extracts user-facing messages from the backend error body ({ detail }, { message } or [{ msg }])
const toMessages = (data: unknown, fallback: string): string[] => {
  const body = data as { detail?: unknown; message?: unknown } | undefined;
  const detail = body?.detail ?? body?.message ?? data;

  if (typeof detail === 'string' && detail) return [detail];
  if (Array.isArray(detail)) {
    const messages = detail.map((d) => (typeof d === 'string' ? d : d?.msg)).filter(Boolean);
    if (messages.length) return messages;
  }
  return [fallback];
};

const parseBody = async (res: Response) => {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

type CookieOptions = {
  path?: string;
  expires?: Date;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

type ParsedCookie = { name: string; value: string; options: CookieOptions };

// Parses a single Set-Cookie header into the shape cookies().set() expects. The Domain attribute is
// dropped on purpose so the cookie is stored for our own domain instead of the backend's.
const parseSetCookie = (header: string): ParsedCookie => {
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

const isAuthPath = (path: string) => path.startsWith('/auth/');

async function send(
  path: string,
  method: HttpMethod,
  cookieHeader: string,
  options: RequestOptions,
) {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not set');
  }

  return fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: options.cache ?? (options.next ? undefined : 'no-store'),
    next: options.next,
  });
}

async function request<T>(
  path: string,
  method: HttpMethod,
  options: RequestOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  let cookieHeader = cookieStore.toString();

  let res = await send(path, method, cookieHeader, options);

  // Access token expired: refresh once, then retry the original request with the new cookies
  if (res.status === 401 && !isAuthPath(path)) {
    const refreshRes = await send('/auth/refresh-token', 'POST', cookieHeader, { body: {} });

    if (refreshRes.ok) {
      const refreshed = refreshRes.headers.getSetCookie().map(parseSetCookie);
      const merged = new Map(cookieStore.getAll().map((c) => [c.name, c.value]));
      refreshed.forEach((c) => merged.set(c.name, c.value));
      cookieHeader = [...merged].map(([name, value]) => `${name}=${value}`).join('; ');

      if (options.persistCookies) {
        refreshed.forEach((c) => cookieStore.set(c.name, c.value, c.options));
      }
      res = await send(path, method, cookieHeader, options);
    }
  }

  if (options.persistCookies) {
    res.headers
      .getSetCookie()
      .map(parseSetCookie)
      .forEach((c) => cookieStore.set(c.name, c.value, c.options));
  }

  const data = await parseBody(res);

  if (!res.ok) {
    throw new ApiError(res.status, toMessages(data, res.statusText || 'Something went wrong'));
  }

  return data as T;
}

export const http = {
  get<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return request<T>(path, 'GET', options);
  },

  post<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'body'>) {
    return request<T>(path, 'POST', { ...options, body });
  },

  put<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'body'>) {
    return request<T>(path, 'PUT', { ...options, body });
  },

  patch<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'body'>) {
    return request<T>(path, 'PATCH', { ...options, body });
  },

  delete<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return request<T>(path, 'DELETE', options);
  },
};
