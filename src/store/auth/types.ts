export interface AuthState {
  accountData: AccountData | null;
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
  pincode: string;
  phoneNumber: string;
  password: string;
  termStatus: boolean;
}
