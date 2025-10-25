export interface AuthState {
  accountData: AccountData | null;
  resetPasswordToken: string | null;
  setResetPasswordToken: (token: string) => void;
  clearResetPasswordToken: () => void;
  setAccountData: (data: AccountData) => void;
  clearAccountData: () => void;
}

export interface AccountData {
  fullName: string;
  agencyName?: string;
  email: string;
  website?: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: {
    country: string;
    number: string;
  };
  password: string;
  termStatus: boolean;
}
