/**
 * used to store global types in the project
 *
 */

export type OtpProps = {
  otpCode: string;
  otpType?: 'email' | 'mobile';
};

export interface LoginResponse {
  data: {
    phoneNumber?: string;
  };
}
