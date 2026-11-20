'use server';

/**
 * Server actions for shared reference data that client components need after the page has
 * loaded, e.g. a state's districts once the user picks the state. They return an ActionResult
 * instead of throwing.
 */

import { ApiError } from '@/server/http';
import { commonService } from '@/server/commonService';
import { STRINGS } from '@/constants/strings';
import { ActionResult, Region } from '@/constants/types';

/** Districts of the state with id `stateId`; anything the API rejects comes back as `errors`. */
export async function getDistrictsAction(stateId: number): Promise<ActionResult<Region[]>> {
  // Actions can be called with anything, so check the id before it reaches the URL
  if (!Number.isInteger(stateId) || stateId < 1) {
    return { success: false, errors: [STRINGS.SOMETHING_WENT_WRONG] };
  }

  try {
    return { success: true, data: await commonService.getDistricts(stateId) };
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, errors: err.messages };
    }
    // eslint-disable-next-line no-console -- unexpected errors are logged on the server only
    console.error(err);
    return { success: false, errors: [STRINGS.SOMETHING_WENT_WRONG] };
  }
}
