/**
 * Converts between the agency profile API (GET / PUT /agency/profile) and the agency profile
 * form. The two differ in names (`agencyName` / `name`, `address` / `street`, `pincode` / `pin`),
 * in the state (a name in the API, a region id in the form's dropdown) and in destinations
 * (a list in the API, comma-separated text in the form).
 *
 * The API has no district, logo or banner yet, so those start empty and aren't sent.
 *
 * @example
 * ```ts
 * const values = toAgencyProfileValues(profile, states);
 * const payload = toAgencyProfilePayload(values, states);
 * ```
 */

import type {
  AgencyProfile,
  AgencyProfileValues,
  Region,
  UpdateAgencyProfilePayload,
} from '@/constants/types';

/** The form fields the API stores: everything but the district, logo and banner */
export type SavedAgencyProfileValues = Omit<AgencyProfileValues, 'district' | 'logo' | 'banner'>;

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** The form's values for a saved profile. A state missing from `states` starts unpicked. */
export const toAgencyProfileValues = (
  profile: AgencyProfile,
  states: Region[],
): SavedAgencyProfileValues => {
  const state = profile.state && states.find(({ name }) => sameName(name, profile.state!));
  return {
    name: profile.agencyName,
    tagline: profile.tagline ?? '',
    description: profile.description ?? '',
    destinations: profile.destinations.join(', '),
    email: profile.email,
    phone: profile.phoneNumber ?? '',
    website: profile.website ?? '',
    street: profile.address ?? '',
    state: state ? String(state.id) : '',
    city: profile.city ?? '',
    pin: profile.pincode ?? '',
  };
};

/**
 * The PUT body for the form's values. Every editable field is sent, since the API clears the
 * ones left out. The schema has already trimmed the text and made sure a state is picked.
 */
export const toAgencyProfilePayload = (
  values: SavedAgencyProfileValues,
  states: Region[],
): UpdateAgencyProfilePayload => ({
  agencyName: values.name,
  tagline: values.tagline,
  description: values.description,
  destinations: values.destinations,
  website: values.website,
  address: values.street,
  city: values.city,
  state: states.find(({ id }) => String(id) === values.state)?.name ?? '',
  pincode: values.pin,
});
