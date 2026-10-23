/**
 * Server-only calls to the backend /tours endpoints, fetched in Server Components and passed down
 * as props. The access token cookie is forwarded by the http client.
 */

import 'server-only';
import { http } from './http';
import type {
  CreateTourPayload,
  Tour,
  TourDetails,
  TourPage,
  TourSearch,
  UpdateTourPayload,
} from '@/constants/types';

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

  /**
   * One of the signed-in agency's tours, with its itinerary and gallery. Throws an ApiError with
   * status 404 when the tour doesn't exist or belongs to another agency. Not cached, so the edit
   * screen always opens on the latest saved values.
   */
  async getTour(id: number): Promise<TourDetails> {
    const res = await http.get<{ data: TourDetails }>(`/tours/${id}`);
    return res.data;
  },

  /**
   * Creates a tour owned by the signed-in agency, as a draft or published depending on
   * `payload.status`. Throws an ApiError with status 400 for an unknown or inactive category,
   * 403 for a non-agency user and 422 when the API rejects a field.
   */
  async createTour(payload: CreateTourPayload): Promise<TourDetails> {
    const res = await http.post<{ data: TourDetails }>('/tours/create-tour', payload);
    return res.data;
  },

  /**
   * Updates the given fields of one of the signed-in agency's tours; fields left out keep their
   * saved values. Throws an ApiError with status 404 when the tour doesn't exist or belongs to
   * another agency and 422 when the API rejects a field.
   */
  async updateTour(id: number, payload: UpdateTourPayload): Promise<TourDetails> {
    const res = await http.patch<{ data: TourDetails }>(`/tours/${id}`, payload);
    return res.data;
  },

  /**
   * Deletes one of the signed-in agency's tours with its itinerary and photos. Throws an ApiError
   * with status 404 when the tour doesn't exist or belongs to another agency.
   */
  async deleteTour(id: number): Promise<void> {
    await http.delete(`/tours/${id}`);
  },
};
