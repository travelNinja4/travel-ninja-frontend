import { create } from 'zustand';
import { AccountData, AuthState } from './types';

const initialState = {
  accountData: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  setAccountData: (data: AccountData) => set({ accountData: data }),
  clearAccountData: () => set({ accountData: null }),
}));
