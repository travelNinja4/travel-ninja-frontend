/**
 * Server-only calls for shared reference data, fetched in Server Components and passed down as props.
 */

import 'server-only';
import { http } from './http';
import { Country, MetaOptionKey, MetaOptions, Region } from '@/constants/types';

const ONE_HOUR = 60 * 60;
const ONE_DAY = ONE_HOUR * 24;

/** Cache tag of the meta options. Revalidate it after changing categories so dropdowns pick it up. */
export const META_OPTIONS_TAG = 'meta-options';

export const commonService = {
  async getCountries(): Promise<Country[]> {
    const res = await http.get<{ data: Country[] }>('/api/countries', {
      next: { revalidate: ONE_DAY },
    });
    return res?.data ?? [];
  },

  /** Indian states and union territories for address fields. They rarely change, so cached for a day. */
  async getStates(): Promise<Region[]> {
    const res = await http.get<{ data: Region[] }>('/api/states', {
      next: { revalidate: ONE_DAY },
    });
    return res?.data ?? [];
  },

  /** Districts of one state, for the District field once a state is picked. Cached for a day. */
  async getDistricts(stateId: number): Promise<Region[]> {
    const res = await http.get<{ data: Region[] }>(`/api/states/${stateId}/districts`, {
      next: { revalidate: ONE_DAY },
    });
    return res?.data ?? [];
  },

  /**
   * Active lookup values for dropdowns (tour statuses, categories). They rarely change, so the
   * response is kept in the Next.js data cache: navigating between pages or filters reuses it
   * instead of calling the API again. The cache key includes the cookie header, so each session
   * gets its own entry.
   */
  async getMetaOptions(keys: MetaOptionKey[]): Promise<MetaOptions> {
    // Sorted so the same keys in any order share one cache entry
    const res = await http.post<{ data: Partial<MetaOptions> }>(
      '/meta/options',
      { keys: [...new Set(keys)].sort() },
      { cache: 'force-cache', next: { revalidate: ONE_HOUR, tags: [META_OPTIONS_TAG] } },
    );
    return {
      tour_status: res?.data?.tour_status ?? [],
      tour_category: res?.data?.tour_category ?? [],
    };
  },
};
