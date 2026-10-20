/**
 * Server-only calls to the backend /tours endpoints, fetched in Server Components and passed down
 * as props. The access token cookie is forwarded by the http client.
 */

import 'server-only';
import { http } from './http';
import type { Tour, TourPage, TourStatusFilter } from '@/constants/types';

/** Tours shown per page on the tours screen */
export const TOURS_PAGE_SIZE = 10;

interface GetToursParams {
  status?: TourStatusFilter;
  /** Offset for pagination (>= 0) */
  skip?: number;
  /** Page size (1–100) */
  limit?: number;
}

export const tourService = {
  /** Tours owned by the signed-in agency, newest `updatedAt` first. */
  async getTours({ status, skip, limit }: GetToursParams = {}): Promise<Tour[]> {
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    if (skip !== undefined) query.set('skip', String(skip));
    if (limit !== undefined) query.set('limit', String(limit));

    const qs = query.toString();
    const res = await http.get<{ data: Tour[] }>(`/tours${qs ? `?${qs}` : ''}`);
    return res?.data ?? [];
  },

  /**
   * One page of tours. The API sends no total, so this asks for one tour more than the page
   * holds: if it comes back, there is a next page.
   */
  async getToursPage({
    page,
    pageSize = TOURS_PAGE_SIZE,
    status,
  }: {
    page: number;
    pageSize?: number;
    status?: TourStatusFilter;
  }): Promise<TourPage> {
    const tours = await this.getTours({ status, skip: (page - 1) * pageSize, limit: pageSize + 1 });
    return { tours: tours.slice(0, pageSize), page, hasNextPage: tours.length > pageSize };
  },
};
