import { z } from 'zod';

export const itineraryDaySchema = z.object({
  title: z.string().trim().min(1, 'Enter a title for the day').max(100),
  location: z.string().trim().min(1, 'Enter a location').max(100),
  description: z.string().trim().min(1, 'Enter a description').max(2000),
});

export const itinerarySchema = z.object({
  itinerary: z.array(itineraryDaySchema).min(1, 'Add at least one day'),
});

export type ItineraryFormValues = z.infer<typeof itinerarySchema>;
