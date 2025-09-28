/**
 * The apiStatus store manages the global loading state of API requests, using a counter to track active calls and exposing an isLoading flag for showing a loader across the app.
 *
 */

import { create } from 'zustand';
import { ApiStatusState } from './types';

const initialState = {
  loadingCount: 0,
  isLoading: false,
};

export const useApiStatusStore = create<ApiStatusState>((set) => ({
  ...initialState,
  startLoading: () =>
    set((state) => {
      const newCount = state.loadingCount + 1;
      return { loadingCount: newCount, isLoading: newCount > 0 };
    }),
  stopLoading: () =>
    set((state) => {
      const newCount = Math.max(0, state.loadingCount - 1);
      return { loadingCount: newCount, isLoading: newCount > 0 };
    }),
}));
