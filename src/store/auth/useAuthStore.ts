import { create } from 'zustand';
import { AccountData, AuthState } from './types';

const initialState = {
  accountData: null,
  resetPasswordToken: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  setAccountData: (data: AccountData) => set({ accountData: data }),
  clearAccountData: () => set({ accountData: null }),
  setResetPasswordToken: (token: string | null) => set({ resetPasswordToken: token }),
  clearResetPasswordToken: () => set({ resetPasswordToken: null }),
}));
