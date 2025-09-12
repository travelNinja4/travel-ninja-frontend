import { apiClient } from './apiClient';

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const authService = {
  async register(data: RegisterPayload) {
    return apiClient.post('/auth/register', data);
  },

  async login(data: LoginPayload) {
    return apiClient.post('/auth/login', data);
  },

  async me() {
    return apiClient.get('/auth/me');
  },

  async logout() {
    return apiClient.post('/auth/logout', {});
  },
};
