import { create } from "zustand"
import { AuthState } from "./types"

const initialState = {
  // default values here
}

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  // actions here
}))
