/**
 * Storybook stand-in for src/actions/auth.ts. The real server actions import
 * `server-only` modules that throw in the browser, so main.ts aliases
 * `@/actions/auth` to this file. Each action is a `fn()` spy that logs to the
 * Actions panel and resolves successfully; stories can override the result
 * with e.g. `loginAction.mockResolvedValue({ success: false, errors: [...] })`.
 */
import { fn } from 'storybook/test';
import type { ActionResult } from '@/constants/types';

const ok = (): Promise<ActionResult> => Promise.resolve({ success: true, data: undefined });

export const registerAction = fn(ok).mockName('registerAction');
export const sendOtpAction = fn(ok).mockName('sendOtpAction');
export const verifyOtpAction = fn(ok).mockName('verifyOtpAction');
export const loginAction = fn(ok).mockName('loginAction');
export const verifyLoginAction = fn(ok).mockName('verifyLoginAction');
export const forgotPasswordAction = fn(ok).mockName('forgotPasswordAction');
export const resetPasswordAction = fn(ok).mockName('resetPasswordAction');
export const logoutAction = fn(async () => {}).mockName('logoutAction');
