/**
 * Server-only calls for shared reference data, fetched in Server Components and passed down as props.
 */

import 'server-only';
import { http } from './http';
import { Country } from '@/constants/types';

const ONE_DAY = 60 * 60 * 24;

export const commonService = {
  async getCountries(): Promise<Country[]> {
    const res = await http.get<{ data: Country[] }>('/api/countries', {
      next: { revalidate: ONE_DAY },
    });
    return res?.data ?? [];
  },
};
