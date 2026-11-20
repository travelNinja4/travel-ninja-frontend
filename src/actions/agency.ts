'use server';

/**
 * Server actions for the agency profile screen. Client components call these directly; they run
 * on the server, talk to the backend through src/server, and return an ActionResult instead of
 * throwing.
 */

import { ApiError } from '@/server/http';
import { agencyService } from '@/server/agencyService';
import { STRINGS } from '@/constants/strings';
import type { ActionResult, AgencyProfile, UpdateAgencyProfilePayload } from '@/constants/types';

/**
 * Saves the agency profile, replacing every editable field. Returns the saved profile, which the
 * API may have tidied (e.g. duplicate destinations dropped). Anything it rejects comes back as
 * `errors`.
 */
export async function updateAgencyProfileAction(
  payload: UpdateAgencyProfilePayload,
): Promise<ActionResult<AgencyProfile>> {
  try {
    return { success: true, data: await agencyService.updateProfile(payload) };
  } catch (err) {
    if (err instanceof ApiError) {
      return { success: false, errors: err.messages };
    }
    // eslint-disable-next-line no-console -- unexpected errors are logged on the server only
    console.error(err);
    return { success: false, errors: [STRINGS.SOMETHING_WENT_WRONG] };
  }
}
