import { apiClient } from './apiClient';

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

export type SendOtp = {
  email?: string;
  phoneNumber?: string;
};

export type VerifyOtp = {
  email?: string;
  phoneNumber?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export interface Country {
  name: string;
  code: string;
  length: number;
}

export const authService = {
  register(data: RegisterPayload) {
    return apiClient.post('/auth/register', data);
  },

  getCountryCode(): Promise<Country[]> {
    return apiClient.get<Country[]>('/api/countries').then((res: any) => res?.data);
  },

  sendOtp(data: SendOtp) {
    return apiClient.post('/auth/send-otp', data);
  },

  verifyOtp(data: VerifyOtp) {
    return apiClient.post('/auth/verify-otp', data);
  },

  login(data: LoginPayload) {
    return apiClient.post('/auth/login', data);
  },

  logout() {
    return apiClient.post('/auth/logout', {});
  },
};
