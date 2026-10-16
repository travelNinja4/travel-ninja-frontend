import { LoginResponse } from '@/constants/types';
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

export type Login = {
  email: string;
  password: string;
  role?: string;
};

export type Country = {
  name: string;
  code: string;
  length: number;
};

export type forgotPassword = {
  email: string;
};

export type resetPassword = {
  newPassword: string;
  confirmPassword: string;
};

export type verifyLogin = {
  phoneNumber?: string;
  otp: string;
};

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

  forgotPassword(data: forgotPassword) {
    return apiClient.post('/auth/forgot-password', data);
  },

  validateResetPassword(token: string) {
    return apiClient.get(`/auth/validate/${token}`);
  },

  resetPassword(data: resetPassword) {
    return apiClient.post('/auth/reset-password', data);
  },

  login(data: Login): Promise<LoginResponse> {
    return apiClient.post('/auth/login', data);
  },

  verifyLogin(data: verifyLogin) {
    return apiClient.post('/auth/verify-login', data);
  },

  logout() {
    return apiClient.post('/auth/logout', {});
  },
};
