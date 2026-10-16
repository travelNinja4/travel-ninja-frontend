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

export type RegisterPayload = {
  fullName: string;
  agencyName?: string;
  email: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
  password: string;
  termStatus: boolean;
  role: string;
};

/** Values of the create-account form, before they are mapped to a RegisterPayload */
export interface AccountData {
  fullName: string;
  agencyName?: string;
  email: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: {
    country: string;
    number: string;
  };
  password: string;
  termStatus: boolean;
}

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
