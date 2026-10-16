/**
 * Stores the email / phone number waiting for OTP verification in a short-lived httpOnly cookie, so the
 * OTP pages and server actions can read it without keeping account data (or the password) in the browser.
 */

import 'server-only';
import { cookies } from 'next/headers';
import { PendingVerification } from '@/constants/types';

const COOKIE_NAME = 'pendingVerification';
const FIFTEEN_MINUTES = 60 * 15;

export async function getPendingVerification(): Promise<PendingVerification | null> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return null;

  try {
    return JSON.parse(value) as PendingVerification;
  } catch {
    return null;
  }
}

// Only callable from server actions / route handlers (Next.js restriction on setting cookies)
export async function setPendingVerification(data: PendingVerification) {
  (await cookies()).set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: FIFTEEN_MINUTES,
  });
}

export async function clearPendingVerification() {
  (await cookies()).delete(COOKIE_NAME);
}
