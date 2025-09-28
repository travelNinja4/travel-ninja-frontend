/**
 * A centralized store for managing shared reference and configuration data used across the application.
 *
 */

import { create } from 'zustand';
import { CommonState } from './types';

const initialState = {
  countries: [],
};

export const useCommonStore = create<CommonState>((set) => ({
  ...initialState,
  setCountries: (countries) => set({ countries }),
}));
