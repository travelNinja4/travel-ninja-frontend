/**
 * Server-only calls to the backend /tours endpoints, fetched in Server Components and passed down
 * as props. The access token cookie is forwarded by the http client.
 */

import 'server-only';
import { http } from './http';
import type { Tour, TourPage, TourSearch } from '@/constants/types';

/** Tours shown per page on the tours screen */
export const TOURS_PAGE_SIZE = 12;

interface SearchToursParams extends TourSearch {
  /** 1-based */
  page: number;
  /** 1–100 */
  pageSize?: number;
}

export const tourService = {
  /**
   * One page of the signed-in agency's tours, newest `updatedAt` first. Searching, filtering and
   * paging all happen in the API, so only the tours on screen are sent. Not cached: tours change
   * as the agency edits them.
   */
  async searchTours({
    page,
    pageSize = TOURS_PAGE_SIZE,
    search,
    status,
    categoryId,
  }: SearchToursParams): Promise<TourPage> {
    // Unset filters are left out of the body (JSON.stringify drops undefined)
    const res = await http.post<{ data: { tours: Tour[]; total: number } }>('/tours/search', {
      search: search || undefined,
      status,
      categoryId,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    const total = res?.data?.total ?? 0;
    return {
      tours: res?.data?.tours ?? [],
      page,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  },
};
