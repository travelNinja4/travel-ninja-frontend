/**
 * Turns a saved tour (GET /tours/{id}) into the tour form's values and options,
 * so the edit screen opens with every field filled in.
 *
 * @example
 * ```ts
 * const guides = withGuide(TOUR_GUIDES, tour.guide);
 * const values = toTourFormValues(tour, guides);
 * ```
 */

import type { DropdownOption } from '@/components/Dropdown/Dropdown';
import type {
  CreateTourPayload,
  MetaOption,
  TourDetails,
  TourFormValues,
  TourStatus,
} from '@/constants/types';

const matchesGuide = (guide: string) => (option: DropdownOption<string>) =>
  option.value === guide || option.label === guide;

/** `guides` plus the tour's own guide when the list doesn't have it, so the field never shows blank */
export const withGuide = (guides: DropdownOption<string>[], guide?: string) =>
  !guide || guides.some(matchesGuide(guide)) ? guides : [...guides, { value: guide, label: guide }];

/** `categories` plus the tour's own category when it's no longer active */
export const withCategory = (categories: MetaOption[], category?: MetaOption) =>
  !category || categories.some(({ id }) => id === category.id)
    ? categories
    : [...categories, category];

/** One entry per line, the way the Inclusions and Exclusions boxes hold them */
const toLines = (items: string[] | null) => (items ?? []).join('\n');

/** The non-blank lines of an Inclusions or Exclusions box */
const fromLines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * The form values of a saved tour. `guides` should already include the tour's guide
 * (see `withGuide`); the API may send either its value or its label.
 */
export const toTourFormValues = (
  tour: TourDetails,
  guides: DropdownOption<string>[],
): TourFormValues => ({
  title: tour.title,
  destination: tour.destination,
  categoryId: String(tour.categoryId),
  description: tour.description ?? '',
  coverImage: tour.coverImageUrl ? { url: tour.coverImageUrl } : null,
  gallery: (tour.gallery ?? [])
    .filter(({ kind }) => kind !== 'cover')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ id, url }) => ({ id, url })),
  durationDays: tour.durationDays,
  departureDate: tour.departureDate,
  returnDate: tour.returnDate,
  price: tour.price,
  capacity: tour.capacity,
  guide: guides.find(matchesGuide(tour.guide))?.value ?? '',
  itinerary: [...(tour.itinerary ?? [])]
    .sort((a, b) => a.day - b.day)
    .map(({ title, location, description }) => ({ title, location, description })),
  inclusions: toLines(tour.inclusions),
  exclusions: toLines(tour.exclusions),
  cancellationPolicy: tour.cancellation ?? '',
});

/**
 * The POST /tours/create-tour body for valid form values. The guide is sent by its display name,
 * and itinerary days are numbered from 1 in the order they appear. Photos aren't part of it.
 */
export const toTourPayload = (
  values: TourFormValues,
  status: TourStatus,
  guides: DropdownOption<string>[],
): CreateTourPayload => ({
  title: values.title,
  destination: values.destination,
  categoryId: Number(values.categoryId),
  description: values.description || undefined,
  durationDays: values.durationDays,
  departureDate: values.departureDate,
  returnDate: values.returnDate,
  price: values.price,
  capacity: values.capacity,
  guide: guides.find(matchesGuide(values.guide))?.label ?? values.guide,
  inclusions: fromLines(values.inclusions),
  exclusions: fromLines(values.exclusions),
  cancellation: values.cancellationPolicy || undefined,
  status,
  itinerary: values.itinerary.map((day, index) => ({ ...day, day: index + 1 })),
});
