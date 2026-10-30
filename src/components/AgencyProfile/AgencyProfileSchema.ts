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

// Tagline, description and destinations are needed to go live, not to save:
// the profile can be saved half done and finished later
export const agencyProfileSchema = z.object({
  logo: profileImageSchema,
  banner: profileImageSchema,
  name: z.string().trim().min(1, AGENCY_PROFILE.NAME_REQUIRED).max(120),
  tagline: z.string().trim().max(TAGLINE_MAX),
  description: z.string().trim().max(DESCRIPTION_MAX),
  destinations: z.string().trim().max(DESTINATIONS_MAX),
  email: z.email(AGENCY_PROFILE.INVALID_EMAIL).or(z.literal('')),
  phone: optionalMatch(/^\+?[\d\s-]{7,16}$/, AGENCY_PROFILE.INVALID_PHONE),
  website: optionalMatch(/^https?:\/\/[^\s.]+\.\S+$/, AGENCY_PROFILE.INVALID_WEBSITE),
  street: z.string().trim().max(200),
  state: z.string(),
  district: z.string(),
  city: z.string().trim().max(80),
  pin: optionalMatch(/^\d{6}$/, AGENCY_PROFILE.INVALID_PIN),
});
