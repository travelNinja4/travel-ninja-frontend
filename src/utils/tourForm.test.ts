import { MOCK_TOUR_DETAILS } from '@/components/TourForm/TourForm.mocks';
import { toTourFormValues, withCategory, withGuide } from './tourForm';

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
