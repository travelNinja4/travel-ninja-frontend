/**
 * The tours screen keeps its page and filters in the URL
 * (`/tours?page=2&status=draft&category=6&q=goa`), so they survive a refresh,
 * work with the back button and can be shared. These read and build those URLs.
 */

import { ROUTES, TOUR_STATUS_LABEL } from '@/constants/strings';
import type { TourSearch, TourStatusFilter } from '@/constants/types';

export interface ToursQuery extends TourSearch {
  /** 1-based */
  page: number;
}

type SearchParams = Record<string, string | string[] | undefined>;

/** Longer search terms are cut to this length */
const MAX_SEARCH_LENGTH = 100;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const positiveInt = (value: string | undefined) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
};

/** Reads the page and filters from a page's searchParams. Invalid values fall back to page 1 and no filter. */
export function parseToursQuery(searchParams: SearchParams): ToursQuery {
  const status = first(searchParams.status);
  const search = first(searchParams.q)?.trim().slice(0, MAX_SEARCH_LENGTH);

  return {
    page: positiveInt(first(searchParams.page)) ?? 1,
    search: search || undefined,
    status:
      status && Object.hasOwn(TOUR_STATUS_LABEL, status) ? (status as TourStatusFilter) : undefined,
    categoryId: positiveInt(first(searchParams.category)),
  };
}

/** `{ page: 2, status: 'draft' }` -> `"/tours?page=2&status=draft"`. Page 1 and unset filters are left out. */
export function toursHref({ page = 1, search, status, categoryId }: Partial<ToursQuery>): string {
  const query = new URLSearchParams();
  if (page > 1) query.set('page', String(page));
  if (status) query.set('status', status);
  if (categoryId) query.set('category', String(categoryId));
  if (search) query.set('q', search);

  const qs = query.toString();
  return qs ? `${ROUTES.TOURS}?${qs}` : ROUTES.TOURS;
}
