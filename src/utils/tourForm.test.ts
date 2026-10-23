import { MOCK_TOUR_DETAILS } from '@/components/TourForm/TourForm.mocks';
import type { TourFormValues } from '@/constants/types';
import {
  toTourFormValues,
  toTourPayload,
  toTourUpdatePayload,
  withCategory,
  withGuide,
} from './tourForm';

const guides = [
  { value: 'arjun', label: 'Arjun Mehta' },
  { value: 'priya', label: 'Priya Nair' },
];

describe('toTourFormValues', () => {
  it('fills every field of the form from the saved tour', () => {
    const [first, second] = MOCK_TOUR_DETAILS.gallery;
    expect(toTourFormValues(MOCK_TOUR_DETAILS, guides)).toEqual({
      title: 'Coorg Weekend Escape',
      destination: 'Coorg, Karnataka',
      categoryId: '1',
      description: MOCK_TOUR_DETAILS.description,
      coverImage: { url: MOCK_TOUR_DETAILS.coverImageUrl },
      // In sortOrder
      gallery: [
        { id: second.id, url: second.url },
        { id: first.id, url: first.url },
      ],
      durationDays: 3,
      departureDate: '2026-11-14',
      returnDate: '2026-11-16',
      price: 12500,
      capacity: 16,
      guide: 'arjun',
      // In day order, without the API's ids
      itinerary: [
        {
          title: 'Arrival & coffee estate',
          location: 'Madikeri',
          description: 'Check-in, estate walk, evening campfire.',
        },
        {
          title: 'Abbey Falls & Raja’s Seat',
          location: 'Coorg',
          description: 'Falls and sunset point.',
        },
      ],
      inclusions: 'Stay\nBreakfast',
      exclusions: 'Flights',
      cancellationPolicy: MOCK_TOUR_DETAILS.cancellation,
    });
  });

  it('matches the guide by value as well as label', () => {
    expect(toTourFormValues({ ...MOCK_TOUR_DETAILS, guide: 'priya' }, guides).guide).toBe('priya');
  });

  it('copes with a tour that has no cover, photos or optional text', () => {
    const values = toTourFormValues(
      {
        ...MOCK_TOUR_DETAILS,
        coverImageUrl: null,
        gallery: [],
        // The API may send null for empty fields
        description: null as unknown as string,
        inclusions: null as unknown as string[],
      },
      guides,
    );
    expect(values).toMatchObject({
      coverImage: null,
      gallery: [],
      description: '',
      inclusions: '',
    });
  });
});

describe('withGuide', () => {
  it('keeps the list when it already has the guide', () => {
    expect(withGuide(guides, 'Arjun Mehta')).toBe(guides);
    expect(withGuide(guides, 'priya')).toBe(guides);
    expect(withGuide(guides)).toBe(guides);
  });

  it('adds a guide the list doesn’t have', () => {
    expect(withGuide(guides, 'Kiran Rao')).toEqual([
      ...guides,
      { value: 'Kiran Rao', label: 'Kiran Rao' },
    ]);
  });
});

describe('withCategory', () => {
  const nature = { id: 1, value: 'Nature', label: 'Nature' };

  it('keeps the list when the category is active', () => {
    const categories = [nature];
    expect(withCategory(categories, nature)).toBe(categories);
  });

  it('adds a category that is no longer active', () => {
    expect(withCategory([], nature)).toEqual([nature]);
  });
});

describe('toTourPayload', () => {
  const values: TourFormValues = {
    title: 'Goa beach escape',
    destination: 'Goa',
    categoryId: '6',
    description: '',
    coverImage: null,
    gallery: [],
    durationDays: 3,
    departureDate: '2026-11-20',
    returnDate: '2026-11-22',
    price: 15000,
    capacity: 12,
    guide: 'arjun',
    itinerary: [
      { title: 'Arrival', location: 'Panaji', description: 'Check in' },
      { title: 'Beaches', location: 'Calangute', description: 'Sun and sand' },
    ],
    inclusions: 'Breakfast\n\n  Stay  \n',
    exclusions: '',
    cancellationPolicy: '',
  };

  it('builds the create tour body with the given status', () => {
    expect(toTourPayload(values, 'published', guides)).toEqual({
      title: 'Goa beach escape',
      destination: 'Goa',
      categoryId: 6,
      description: undefined,
      durationDays: 3,
      departureDate: '2026-11-20',
      returnDate: '2026-11-22',
      price: 15000,
      capacity: 12,
      // By display name
      guide: 'Arjun Mehta',
      // One per non-blank line
      inclusions: ['Breakfast', 'Stay'],
      exclusions: [],
      cancellation: undefined,
      status: 'published',
      // Numbered from 1
      itinerary: [
        { day: 1, title: 'Arrival', location: 'Panaji', description: 'Check in' },
        { day: 2, title: 'Beaches', location: 'Calangute', description: 'Sun and sand' },
      ],
    });
  });

  it('keeps filled optional text and the draft status', () => {
    const payload = toTourPayload(
      { ...values, description: 'Sea and sand', cancellationPolicy: 'No refunds' },
      'draft',
      guides,
    );
    expect(payload).toMatchObject({
      description: 'Sea and sand',
      cancellation: 'No refunds',
      status: 'draft',
    });
  });

  it('sends a guide the list doesn’t have as it is', () => {
    expect(toTourPayload({ ...values, guide: 'Kiran Rao' }, 'draft', guides).guide).toBe(
      'Kiran Rao',
    );
  });
});

describe('toTourUpdatePayload', () => {
  const tour = MOCK_TOUR_DETAILS;
  const saved = toTourFormValues(tour, withGuide(guides, tour.guide));

  it('is empty when nothing changed', () => {
    expect(toTourUpdatePayload(saved, tour, guides)).toEqual({});
  });

  it('has only the changed fields', () => {
    expect(
      toTourUpdatePayload({ ...saved, title: 'Coorg Escape Updated', price: 13000 }, tour, guides),
    ).toEqual({ title: 'Coorg Escape Updated', price: 13000 });
  });

  it('sends the whole itinerary when any day changes', () => {
    const itinerary = [saved.itinerary[1], saved.itinerary[0]];
    expect(toTourUpdatePayload({ ...saved, itinerary }, tour, guides)).toEqual({
      itinerary: [
        { day: 1, ...saved.itinerary[1] },
        { day: 2, ...saved.itinerary[0] },
      ],
    });
  });

  it('clears emptied optional text and lists', () => {
    expect(
      toTourUpdatePayload(
        { ...saved, description: '', cancellationPolicy: '', inclusions: '' },
        tour,
        guides,
      ),
    ).toEqual({ description: '', cancellation: '', inclusions: [] });
  });

  it('ignores the photos, which aren’t part of the body', () => {
    expect(toTourUpdatePayload({ ...saved, gallery: [], coverImage: null }, tour, guides)).toEqual(
      {},
    );
  });
});
