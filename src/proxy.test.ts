// @vitest-environment node
import { NextRequest } from 'next/server';
import { AUTH_COOKIES, ROUTES } from '@/constants/strings';
import { proxy } from './proxy';

const fetchMock = vi.fn();

const page = (path: string, cookies: Record<string, string> = {}) =>
  new NextRequest(new URL(path, 'http://localhost:3000'), {
    headers: {
      cookie: Object.entries(cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; '),
    },
  });

const refreshResponse = (ok: boolean) =>
  new Response('{}', {
    status: ok ? 200 : 401,
    headers: ok
      ? [
          ['Set-Cookie', `${AUTH_COOKIES.ACCESS_TOKEN}=new-access; Path=/; Max-Age=900; HttpOnly`],
          ['Set-Cookie', `${AUTH_COOKIES.REFRESH_TOKEN}=new-refresh; Path=/; HttpOnly`],
        ]
      : [],
  });

describe('proxy', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('lets public pages through without a session', async () => {
    const res = await proxy(page(ROUTES.LOGIN));
    expect(res.headers.get('location')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('lets a live session through without refreshing', async () => {
    const res = await proxy(page(ROUTES.DASHBOARD, { [AUTH_COOKIES.ACCESS_TOKEN]: 'access' }));
    expect(res.headers.get('location')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends users with no session to login', async () => {
    const res = await proxy(page(ROUTES.DASHBOARD));
    expect(res.headers.get('location')).toBe(`http://localhost:3000${ROUTES.LOGIN}`);
  });

  it('refreshes an expired access token and passes the new cookies to the page and browser', async () => {
    fetchMock.mockResolvedValue(refreshResponse(true));

    const res = await proxy(page(ROUTES.DASHBOARD, { [AUTH_COOKIES.REFRESH_TOKEN]: 'refresh-1' }));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/refresh-token'),
      expect.objectContaining({
        headers: expect.objectContaining({ Cookie: `${AUTH_COOKIES.REFRESH_TOKEN}=refresh-1` }),
      }),
    );
    expect(res.headers.get('location')).toBeNull();
    expect(res.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value).toBe('new-access');
    expect(res.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)).toMatchObject({
      value: 'new-refresh',
      httpOnly: true,
    });
    // Forwarded to the page render, so its backend calls use the new token
    expect(res.headers.get('x-middleware-request-cookie')).toContain('new-access');
  });

  it('sends users to login when the refresh token is rejected', async () => {
    fetchMock.mockResolvedValue(refreshResponse(false));

    const res = await proxy(page(ROUTES.DASHBOARD, { [AUTH_COOKIES.REFRESH_TOKEN]: 'refresh-2' }));

    expect(res.headers.get('location')).toBe(`http://localhost:3000${ROUTES.LOGIN}`);
  });

  it('makes one refresh call for parallel requests with the same token', async () => {
    fetchMock.mockResolvedValue(refreshResponse(true));
    const cookies = { [AUTH_COOKIES.REFRESH_TOKEN]: 'refresh-3' };

    const [first, second] = await Promise.all([
      proxy(page(ROUTES.DASHBOARD, cookies)),
      proxy(page('/bookings', cookies)),
    ]);

    // A second call would reuse the rotated token, and the backend would revoke the login
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(first.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value).toBe('new-access');
    expect(second.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value).toBe('new-access');
  });
});
