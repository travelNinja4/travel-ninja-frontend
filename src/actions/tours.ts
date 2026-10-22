'use server';

/**
 * Server actions for the tours screens. Client components call these directly; they run on the
 * server, talk to the backend through src/server, and return an ActionResult instead of throwing.
 */

import { refresh } from 'next/cache';
import { ApiError } from '@/server/http';
import { tourService } from '@/server/tourService';
import { STRINGS, TOURS } from '@/constants/strings';
import { ActionResult } from '@/constants/types';

// Largest tour id the API accepts
const MAX_TOUR_ID = 2147483647;

/**
 * Deletes the tour, then refreshes the current page in the same response, so the tours list
 * comes back without it (and with the next tour moved up from the following page).
 */
export async function deleteTourAction(id: number): Promise<ActionResult> {
  // Actions can be called with anything, so check the id before it reaches the URL
  if (!Number.isInteger(id) || id < 1 || id > MAX_TOUR_ID) {
    return { success: false, errors: [TOURS.DELETE_FAILED] };
  }

  try {
    await tourService.deleteTour(id);
    refresh();
    return { success: true, data: undefined };
  } catch (err) {
    if (err instanceof ApiError) {
      // Already gone, e.g. deleted in another tab: refresh so the list stops showing it
      if (err.status === 404) refresh();
      return { success: false, errors: err.messages };
    }
    // eslint-disable-next-line no-console -- unexpected errors are logged on the server only
    console.error(err);
    return { success: false, errors: [STRINGS.SOMETHING_WENT_WRONG] };
  }
}
