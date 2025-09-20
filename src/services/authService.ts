import { apiClient } from './apiClient';

export type RegisterPayload = {
  fullName: string;
  agencyName?: string;
  email: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
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

export const authService = {
  async register(data: RegisterPayload) {
    return apiClient.post('/auth/register', data);
  },

  async sendOtp(data: SendOtp) {
    return apiClient.post('/auth/send-otp', data);
  },

  async verifyOtp(data: VerifyOtp) {
    return apiClient.post('/auth/verify-otp', data);
  },

  async login(data: LoginPayload) {
    return apiClient.post('/auth/login', data);
  },

  async logout() {
    return apiClient.post('/auth/logout', {});
  },
};
