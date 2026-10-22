/**
 * Server-only HTTP client for the backend API. Replaces the old axios apiClient + /api/proxy route.
 *
 * - The backend URL (API_BASE_URL) never reaches the browser.
 * - The browser's cookies are forwarded to the backend, so the backend's auth cookies keep working.
 * - `persistCookies: true` copies the backend's Set-Cookie headers onto our own domain. Next.js only allows
 *   setting cookies in Server Actions and Route Handlers, so use it only from there.
 * - Expired sessions are refreshed by the proxy before the request reaches here, not by this client:
 *   the backend rotates refresh tokens, and a refresh during a page render couldn't save the new ones.
 */

import 'server-only';
import { cookies } from 'next/headers';
import { parseSetCookie, toCookieHeader } from './session';

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
  const res = await send(path, method, toCookieHeader(cookieStore.getAll()), options);

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
