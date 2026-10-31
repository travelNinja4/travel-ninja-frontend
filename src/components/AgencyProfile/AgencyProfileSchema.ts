import { z } from 'zod';
import { AGENCY_PROFILE } from '@/constants/strings';
import { imageSchema } from '../CoverGallery/CoverGallerySchema';

export const TAGLINE_MAX = 60;
export const DESCRIPTION_MAX = 600;
export const DESTINATIONS_MAX = 200;

// Already uploaded, so only new files need checking
const profileImageSchema = z.union([imageSchema, z.object({ url: z.string().min(1) })]).nullable();

/** An optional text field: empty, or matching `pattern` */
const optionalMatch = (pattern: RegExp, message: string) =>
  z.string().trim().regex(pattern, message).or(z.literal(''));

// No field is mandatory: the profile can be saved half-done and finished later. Filled fields are
// still checked. Limits are the API's, or tighter where the screen wants shorter text.
export const agencyProfileSchema = z.object({
  logo: profileImageSchema,
  banner: profileImageSchema,
  name: z.string().trim().max(100),
  tagline: z.string().trim().max(TAGLINE_MAX),
  description: z.string().trim().max(DESCRIPTION_MAX),
  destinations: z.string().trim().max(DESTINATIONS_MAX),
  // From the registration and read-only here, so not checked
  email: z.string(),
  phone: z.string(),
  website: optionalMatch(/^https?:\/\/[^\s.]+\.\S+$/, AGENCY_PROFILE.INVALID_WEBSITE).pipe(
    z.string().max(255),
  ),
  street: z.string().trim().max(200),
  state: z.string(),
  // Not saved by the API yet
  district: z.string(),
  city: z.string().trim().max(50),
  pin: optionalMatch(/^\d{6}$/, AGENCY_PROFILE.INVALID_PIN),
});
