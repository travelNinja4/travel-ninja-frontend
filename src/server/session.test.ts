import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { parseSetCookie, toCookieHeader } from './session';

describe('toCookieHeader', () => {
  it('forwards the access cookie as the backend set it, not percent-encoded', () => {
    // What the backend sends on login, and how the browser then holds it on our domain
    const { value } = parseSetCookie('access_token="Bearer abc.def"; HttpOnly; Path=/');
    const cookies = new RequestCookies(
      new Headers({ cookie: `access_token=${encodeURIComponent(value)}; theme=dark` }),
    );

    expect(cookies.toString()).toBe('access_token=%22Bearer%20abc.def%22; theme=dark');
    expect(toCookieHeader(cookies.getAll())).toBe('access_token="Bearer abc.def"; theme=dark');
  });
});
