'use server';

/**
 * Server actions for the tours screens. Client components call these directly; they run on the
 * server, talk to the backend through src/server, and return an ActionResult instead of throwing.
 */

import { refresh } from 'next/cache';
import { ApiError } from '@/server/http';
import { tourService } from '@/server/tourService';
import { STRINGS, TOUR_FORM, TOURS } from '@/constants/strings';
import { ActionResult, CreateTourPayload, UpdateTourPayload } from '@/constants/types';

// Largest tour id the API accepts
const MAX_TOUR_ID = 2147483647;

// Actions can be called with anything, so check the id before it reaches the URL
const isTourId = (id: number) => Number.isInteger(id) && id >= 1 && id <= MAX_TOUR_ID;

const fail = (err: unknown): { success: false; errors: string[] } => {
  if (err instanceof ApiError) {
    return { success: false, errors: err.messages };
  }
  // eslint-disable-next-line no-console -- unexpected errors are logged on the server only
  console.error(err);
  return { success: false, errors: [STRINGS.SOMETHING_WENT_WRONG] };
};

/**
 * Creates a tour as a draft or published, depending on `payload.status`. The API validates the
 * body, so anything it rejects comes back as `errors`. Returns the new tour's id.
 */
export async function createTourAction(
  payload: CreateTourPayload,
): Promise<ActionResult<{ id: number }>> {
  try {
    const tour = await tourService.createTour(payload);
    return { success: true, data: { id: tour.id } };
  } catch (err) {
    return fail(err);
  }
}

/**
 * Updates only the fields in `payload`; the rest keep their saved values. Anything the API
 * rejects comes back as `errors`.
 */
export async function updateTourAction(
  id: number,
  payload: UpdateTourPayload,
): Promise<ActionResult> {
  if (!isTourId(id)) {
    return { success: false, errors: [TOUR_FORM.UPDATE_FAILED] };
  }

  try {
    await tourService.updateTour(id, payload);
    return { success: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

/**
 * Deletes the tour, then refreshes the current page in the same response, so the tours list
 * comes back without it (and with the next tour moved up from the following page).
 */
export async function deleteTourAction(id: number): Promise<ActionResult> {
  if (!isTourId(id)) {
    return { success: false, errors: [TOURS.DELETE_FAILED] };
  }

  try {
    await tourService.deleteTour(id);
    refresh();
    return { success: true, data: undefined };
  } catch (err) {
    // Already gone, e.g. deleted in another tab: refresh so the list stops showing it
    if (err instanceof ApiError && err.status === 404) refresh();
    return fail(err);
  }
}
