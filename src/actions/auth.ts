'use server';

/**
 * Server actions for the auth flows. Client components call these directly; they run on the server,
 * talk to the backend through src/server, and return an ActionResult instead of throwing.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiError } from '@/server/http';
import { authService } from '@/server/authService';
import {
  clearPendingVerification,
  getPendingVerification,
  setPendingVerification,
} from '@/server/pendingVerification';
import { ROUTES, STRINGS } from '@/constants/strings';
import {
  ActionResult,
  forgotPassword,
  Login,
  OtpType,
  RegisterPayload,
  resetPassword,
} from '@/constants/types';

const ok = (): ActionResult => ({ success: true, data: undefined });

const fail = (err: unknown): { success: false; errors: string[] } => {
  if (err instanceof ApiError) {
    return { success: false, errors: err.messages };
  }
  // eslint-disable-next-line no-console -- unexpected errors are logged on the server only
  console.error(err);
  return { success: false, errors: [STRINGS.SOMETHING_WENT_WRONG] };
};

const sessionExpired = (): { success: false; errors: string[] } => ({
  success: false,
  errors: [STRINGS.VERIFICATION_SESSION_EXPIRED],
});

export async function registerAction(data: RegisterPayload): Promise<ActionResult> {
  try {
    await authService.register(data);
    await setPendingVerification({ email: data.email, phoneNumber: data.phoneNumber });
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function sendOtpAction(otpType: OtpType): Promise<ActionResult> {
  const pending = await getPendingVerification();
  if (!pending) return sessionExpired();

  try {
    await authService.sendOtp(
      otpType === 'email' ? { email: pending.email } : { phoneNumber: pending.phoneNumber },
    );
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function verifyOtpAction(otpType: OtpType, otpCode: string): Promise<ActionResult> {
  const pending = await getPendingVerification();
  if (!pending) return sessionExpired();

  try {
    await authService.verifyOtp(
      otpType === 'email'
        ? { email: pending.email, otpCode }
        : { phoneNumber: pending.phoneNumber, otpCode },
    );
    // Mobile is the last step of registration
    if (otpType === 'mobile') {
      await clearPendingVerification();
    }
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function loginAction(data: Login): Promise<ActionResult> {
  try {
    const res = await authService.login(data);
    await setPendingVerification({ phoneNumber: res?.data?.phoneNumber });
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function verifyLoginAction(otpCode: string): Promise<ActionResult> {
  try {
    await authService.verifyLogin({ otp: otpCode });
    await clearPendingVerification();
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function forgotPasswordAction(data: forgotPassword): Promise<ActionResult> {
  try {
    await authService.forgotPassword(data);
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function resetPasswordAction(
  token: string,
  data: resetPassword,
): Promise<ActionResult> {
  try {
    await authService.resetPassword({ token, ...data });
    return ok();
  } catch (err) {
    return fail(err);
  }
}

export async function logoutAction() {
  try {
    await authService.logout();
  } catch (err) {
    // The local session is cleared below even if the backend call fails
    // eslint-disable-next-line no-console -- logged on the server only
    console.error(err);
  }
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  redirect(ROUTES.LOGIN);
}
