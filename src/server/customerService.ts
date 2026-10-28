/**
 * Server-only calls to the backend /customers endpoints, fetched in Server Components and passed
 * down as props. The access token cookie is forwarded by the http client.
 */

import 'server-only';
import { http } from './http';
import type { Customer, CustomerPage, CustomerSearch } from '@/constants/types';

/** Customers shown per page on the customers screen */
export const CUSTOMERS_PAGE_SIZE = 10;

const FIVE_MINUTES = 5 * 60;

/** Cache tag of the customer cities. Revalidate it to show a new city in the filter straight away. */
export const CUSTOMER_CITIES_TAG = 'customer-cities';

interface SearchCustomersParams extends CustomerSearch {
  /** 1-based */
  page: number;
  /** 1–100 */
  pageSize?: number;
}

export const customerService = {
  /**
   * One page of the guests who booked the signed-in agency's tours, most recently booked first,
   * with their booking count, total spend and last trip. Cancelled bookings don't count. Searching,
   * filtering and paging all happen in the API. Not cached: it changes with every booking.
   */
  async searchCustomers({
    page,
    pageSize = CUSTOMERS_PAGE_SIZE,
    search,
    city,
  }: SearchCustomersParams): Promise<CustomerPage> {
    // Unset filters are left out of the body (JSON.stringify drops undefined)
    const res = await http.post<{ data: { customers: Customer[]; total: number } }>(
      '/customers/search',
      {
        search: search || undefined,
        city: city || undefined,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    );
    const total = res?.data?.total ?? 0;
    return {
      customers: res?.data?.customers ?? [],
      page,
      total,
      pageCount: Math.ceil(total / pageSize),
    };
  },

  /**
   * The distinct cities of the agency's customers, A–Z, for the city filter. They only change
   * when a guest from a new city books, so the list is kept in the Next.js data cache for a few
   * minutes instead of being fetched on every search. The cache key includes the cookie header,
   * so each session gets its own entry.
   */
  async getCities(): Promise<string[]> {
    const res = await http.get<{ data: string[] }>('/customers/cities', {
      cache: 'force-cache',
      next: { revalidate: FIVE_MINUTES, tags: [CUSTOMER_CITIES_TAG] },
    });
    return res?.data ?? [];
  },
};
