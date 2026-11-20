/**
 * Server-only calls to the backend /agency endpoints, fetched in Server Components and server
 * actions. The access token cookie is forwarded by the http client.
 */

import 'server-only';
import { http } from './http';
import type { AgencyProfile, UpdateAgencyProfilePayload } from '@/constants/types';

export const agencyService = {
  /**
   * The signed-in agency's profile. Throws an ApiError with status 403 for a non-agency user and
   * 404 when the agency has no profile yet. Not cached, so the screen always opens on the latest
   * saved values.
   */
  async getProfile(): Promise<AgencyProfile> {
    const res = await http.get<{ data: AgencyProfile }>('/agency/profile');
    return res.data;
  },

  /**
   * Replaces every editable field of the signed-in agency's profile and returns the saved profile.
   * Throws an ApiError with status 404 when the agency has no profile and 422 when the API
   * rejects a field.
   */
  async updateProfile(payload: UpdateAgencyProfilePayload): Promise<AgencyProfile> {
    const res = await http.put<{ data: AgencyProfile }>('/agency/profile', payload);
    return res.data;
  },
};
