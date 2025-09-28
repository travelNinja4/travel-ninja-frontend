export interface CommonState {
  countries: { name: string; code: string; length: number }[];
  setCountries: (countries: { name: string; code: string; length: number }[]) => void;
}
