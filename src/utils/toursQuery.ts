/**
 * The tours screen keeps its page and status filter in the URL
 * (`/tours?page=2&status=draft`), so they survive a refresh, work with the
 * back button and can be shared. These read and build those URLs.
 */

import { ROUTES } from '@/constants/strings';
import type { TourStatusFilter } from '@/constants/types';

export interface ToursQuery {
  /** 1-based */
  page: number;
  status?: TourStatusFilter;
}

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** Reads the page and status from a page's searchParams. Invalid values fall back to page 1 and all statuses. */
export function parseToursQuery(searchParams: SearchParams): ToursQuery {
  const page = Number(first(searchParams.page));
  const status = first(searchParams.status);

  return {
    page: Number.isInteger(page) && page > 1 ? page : 1,
    status: status === 'draft' || status === 'published' ? status : undefined,
  };
}

/** `{ page: 2, status: 'draft' }` -> `"/tours?page=2&status=draft"`. Page 1 and all statuses are left out. */
export function toursHref({ page = 1, status }: Partial<ToursQuery>): string {
  const query = new URLSearchParams();
  if (page > 1) query.set('page', String(page));
  if (status) query.set('status', status);

  const qs = query.toString();
  return qs ? `${ROUTES.TOURS}?${qs}` : ROUTES.TOURS;
}
