import { z } from 'zod';

// Number inputs are read with `valueAsNumber`, so an empty one arrives as NaN and fails the type check
export const schedulePricingSchema = z.object({
  durationDays: z
    .number({ error: 'Enter the number of days' })
    .int('Use whole days')
    .min(1, 'A tour lasts at least 1 day'),
  departureDate: z.string().min(1, 'Pick a departure date'),
  returnDate: z.string().min(1, 'Pick a return date'),
  price: z.number({ error: 'Enter a price per person' }).min(0, 'Price can’t be negative'),
  capacity: z
    .number({ error: 'Enter the capacity' })
    .int('Use a whole number')
    .min(1, 'Allow at least 1 guest'),
  guide: z.string().min(1, 'Pick a guide'),
});

/** "YYYY-MM-DD" strings compare in date order. Apply with `.refine` on the form's schema. */
export const returnsAfterDeparture = ({
  departureDate,
  returnDate,
}: {
  departureDate: string;
  returnDate: string;
}) => !departureDate || !returnDate || returnDate >= departureDate;
