import { z } from 'zod';
import {
  returnsAfterDeparture,
  schedulePricingSchema,
} from '../SchedulePricing/SchedulePricingSchema';
import { itinerarySchema } from '../Itinerary/ItinerarySchema';
import { coverGallerySchema } from '../CoverGallery/CoverGallerySchema';

export const tourBasicsSchema = z.object({
  title: z.string().trim().min(1, 'Enter a tour title').max(120),
  destination: z.string().trim().min(1, 'Enter a destination').max(120),
  categoryId: z.string().min(1, 'Pick a category'),
  description: z.string().trim().max(2000),
});

export const tourPoliciesSchema = z.object({
  inclusions: z.string().trim().max(2000),
  exclusions: z.string().trim().max(2000),
  cancellationPolicy: z.string().trim().max(2000),
});

export const tourFormSchema = tourBasicsSchema
  .extend(coverGallerySchema.shape)
  .extend(schedulePricingSchema.shape)
  .extend(itinerarySchema.shape)
  .extend(tourPoliciesSchema.shape)
  .refine(returnsAfterDeparture, {
    message: 'Return date can’t be before departure',
    path: ['returnDate'],
  });
