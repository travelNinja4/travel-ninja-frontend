import type { TourDetails } from '@/constants/types';
import { MOCK_TOURS } from '../TourCard/TourCard.mocks';

const photo = (id: number, sortOrder: number): TourDetails['gallery'][number] => ({
  id,
  kind: 'gallery',
  url: `https://picsum.photos/seed/photo-${id}/800/600`,
  storageKey: `tours/1/photo-${id}.jpg`,
  sortOrder,
  createdAt: '2026-10-01T09:00:00Z',
});

/** A saved tour shaped like the GET /tours/{id} response, for stories and tests. */
export const MOCK_TOUR_DETAILS: TourDetails = {
  ...MOCK_TOURS[0],
  userId: 1,
  description:
    'Coffee plantations, misty hills, and riverside stays. A restorative weekend for couples and small groups.',
  inclusions: ['Stay', 'Breakfast'],
  exclusions: ['Flights'],
  cancellation: 'Full refund up to 7 days before departure.',
  // Out of order, as the form sorts them
  itinerary: [
    {
      id: 12,
      day: 2,
      title: 'Abbey Falls & Raja’s Seat',
      location: 'Coorg',
      description: 'Falls and sunset point.',
    },
    {
      id: 11,
      day: 1,
      title: 'Arrival & coffee estate',
      location: 'Madikeri',
      description: 'Check-in, estate walk, evening campfire.',
    },
  ],
  gallery: [photo(22, 1), photo(21, 0)],
  createdAt: '2026-10-01T09:00:00Z',
  updatedAt: '2026-10-10T09:00:00Z',
};
