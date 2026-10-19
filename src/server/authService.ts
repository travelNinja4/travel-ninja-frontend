/**
 * Server-only calls to the backend /auth endpoints. Called from server actions (src/actions) and
 * Server Components, never from the browser.
 */

import 'server-only';
import { http } from './http';
import { forgotPassword, Login, RegisterPayload, resetPassword } from '@/constants/types';

// Calls that create or change the session persist the backend's Set-Cookie headers on our domain
const withCookies = { persistCookies: true };

export const authService = {
  register(data: RegisterPayload) {
    return http.post('/auth/register', data, withCookies);
  },

  sendOtp(data: { email?: string; phoneNumber?: string }) {
    return http.post('/auth/send-otp', data);
  },

  verifyOtp(data: { email?: string; phoneNumber?: string; otpCode: string }) {
    return http.post('/auth/verify-otp', data, withCookies);
  },

  forgotPassword(data: forgotPassword) {
    return http.post('/auth/forgot-password', data);
  },

  validateResetPassword(token: string) {
    return http.get(`/auth/validate/${encodeURIComponent(token)}`);
  },

  resetPassword(data: resetPassword & { token: string }) {
    return http.post('/auth/reset-password', data);
  },

  login(data: Login) {
    return http.post('/auth/login', data, withCookies);
  },

  logout() {
    return http.post('/auth/logout', {}, withCookies);
  },
};
