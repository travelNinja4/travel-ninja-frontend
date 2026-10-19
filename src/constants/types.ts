/**
 * used to store global types in the project
 *
 */

export type OtpType = 'email' | 'mobile';

export type OtpProps = {
  otpCode: string;
  otpType?: OtpType;
};

export interface LoginResponse {
  data: {
    phoneNumber?: string;
  };
}

export type Country = {
  name: string;
  code: string;
  length: number;
};

/** Body of POST /auth/register. Only fullName, email, phoneNumber, password and termStatus are required by the API. */
export type RegisterPayload = {
  fullName: string;
  agencyName?: string;
  country?: string;
  email: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  /** Dial code and number, e.g. "+91-9876543210" */
  phoneNumber: string;
  password: string;
  termStatus: boolean;
  role: string;
};

export type Login = {
  email: string;
  password: string;
  role?: string;
};

export type forgotPassword = {
  email: string;
};

export type resetPassword = {
  newPassword: string;
  confirmPassword: string;
};

/**
 * Contact details of a user who still has to verify an OTP (after register or login).
 * Kept server-side in an httpOnly cookie, never in client state.
 */
export type PendingVerification = {
  email?: string;
  phoneNumber?: string;
};

/**
 * Result returned by every server action. Actions never throw to the client, because Next.js hides
 * thrown error messages in production.
 */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; errors: string[] };
