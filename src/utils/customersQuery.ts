/**
 * The customers screen keeps its page and filters in the URL
 * (`/customers?page=2&city=Chennai&q=sneha`), so they survive a refresh,
 * work with the back button and can be shared. These read and build those URLs.
 */

import { ROUTES } from '@/constants/strings';
import type { CustomerSearch } from '@/constants/types';

export interface CustomersQuery extends CustomerSearch {
  /** 1-based */
  page: number;
}

type SearchParams = Record<string, string | string[] | undefined>;

/** Longer search terms and cities are cut to this length */
const MAX_TEXT_LENGTH = 100;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const text = (value: string | string[] | undefined) =>
  first(value)?.trim().slice(0, MAX_TEXT_LENGTH) || undefined;

const positiveInt = (value: string | undefined) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
};

/** Reads the page and filters from a page's searchParams. Invalid values fall back to page 1 and no filter. */
export function parseCustomersQuery(searchParams: SearchParams): CustomersQuery {
  return {
    page: positiveInt(first(searchParams.page)) ?? 1,
    search: text(searchParams.q),
    city: text(searchParams.city),
  };
}

/** `{ page: 2, city: 'Chennai' }` -> `"/customers?page=2&city=Chennai"`. Page 1 and unset filters are left out. */
export function customersHref({ page = 1, search, city }: Partial<CustomersQuery>): string {
  const query = new URLSearchParams();
  if (page > 1) query.set('page', String(page));
  if (city) query.set('city', city);
  if (search) query.set('q', search);

  const qs = query.toString();
  return qs ? `${ROUTES.CUSTOMERS}?${qs}` : ROUTES.CUSTOMERS;
}
