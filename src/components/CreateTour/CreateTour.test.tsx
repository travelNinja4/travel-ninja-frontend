import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import {
  CREATE_TOUR,
  ITINERARY,
  SCHEDULE_PRICING,
  TOUR_BASICS,
  TOUR_POLICIES,
} from '@/constants/strings';
import type { MetaOption } from '@/constants/types';
import CreateTour from './CreateTour';

describe('CreateTour', () => {
  const categories: MetaOption[] = [{ id: 6, value: 'Beach', label: 'Beach' }];
  const guides = [{ value: 'arjun', label: 'Arjun Mehta' }];

  const setup = () => {
    const onSave = vi.fn();
    render(<CreateTour categories={categories} guides={guides} onSave={onSave} />);
    return { onSave };
  };

  // Basics and Itinerary both have "Description" fields, so look each field up within its card
  const card = (name: string) => within(screen.getByRole('region', { name }));

  // A string matches the label loosely, to allow for the required marker
  const change = (cardName: string, label: string | RegExp, value: string) =>
    fireEvent.change(card(cardName).getByLabelText(label, { exact: false }), {
      target: { value },
    });

  const pick = (label: string, option: string) => {
    // Loose, to allow for the required marker
    fireEvent.click(screen.getByLabelText(label, { exact: false }));
    fireEvent.click(screen.getByRole('option', { name: option }));
  };

  const fillValidTour = () => {
    change(TOUR_BASICS.TITLE, TOUR_BASICS.TOUR_TITLE, 'Goa beach escape');
    change(TOUR_BASICS.TITLE, TOUR_BASICS.DESTINATION, 'Goa');
    pick(TOUR_BASICS.CATEGORY, 'Beach');
    change(SCHEDULE_PRICING.TITLE, SCHEDULE_PRICING.DURATION, '3');
    change(SCHEDULE_PRICING.TITLE, SCHEDULE_PRICING.DEPARTURE_DATE, '2026-11-20');
    change(SCHEDULE_PRICING.TITLE, SCHEDULE_PRICING.PRICE, '15000');
    change(SCHEDULE_PRICING.TITLE, SCHEDULE_PRICING.CAPACITY, '12');
    pick(SCHEDULE_PRICING.GUIDE, 'Arjun Mehta');
    // Anchored, as "Title" alone also matches the day's "Day 1: Untitled" heading
    change(ITINERARY.TITLE, new RegExp(`^${ITINERARY.DAY_TITLE}`), 'Arrival');
    change(ITINERARY.TITLE, ITINERARY.LOCATION, 'Panaji');
    change(ITINERARY.TITLE, ITINERARY.DESCRIPTION, 'Check in and sunset walk');
    change(TOUR_POLICIES.TITLE, TOUR_POLICIES.INCLUSIONS, 'Breakfast');
  };

  it('renders the header, actions and every card', () => {
    setup();
    expect(
      screen.getByRole('heading', { level: 1, name: CREATE_TOUR.PAGE_TITLE }),
    ).toBeInTheDocument();
    expect(screen.getByText(CREATE_TOUR.PAGE_DESCRIPTION)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: CREATE_TOUR.SAVE_DRAFT })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: CREATE_TOUR.PUBLISH })).toBeInTheDocument();
    [TOUR_BASICS.TITLE, ITINERARY.TITLE, TOUR_POLICIES.TITLE, SCHEDULE_PRICING.TITLE].forEach(
      (name) => expect(screen.getByRole('region', { name })).toBeInTheDocument(),
    );
  });

  it('starts with one itinerary day and an empty cancellation policy', () => {
    setup();
    expect(
      card(ITINERARY.TITLE).getAllByLabelText(ITINERARY.LOCATION, { exact: false }),
    ).toHaveLength(1);
    expect(screen.getByLabelText(TOUR_POLICIES.CANCELLATION_POLICY)).toHaveValue('');
  });

  it('publishes the tour with every card’s values', async () => {
    const { onSave } = setup();
    fillValidTour();
    fireEvent.click(screen.getByRole('button', { name: CREATE_TOUR.PUBLISH }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave).toHaveBeenCalledWith(
      {
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
          { title: 'Arrival', location: 'Panaji', description: 'Check in and sunset walk' },
        ],
        inclusions: 'Breakfast',
        exclusions: '',
        cancellationPolicy: '',
      },
      'published',
    );
  });

  it('saves a draft with the draft status', async () => {
    const { onSave } = setup();
    fillValidTour();
    fireEvent.click(screen.getByRole('button', { name: CREATE_TOUR.SAVE_DRAFT }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave.mock.calls[0][1]).toBe('draft');
  });

  it('shows the errors of every card and does not save an empty tour', async () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole('button', { name: CREATE_TOUR.PUBLISH }));
    expect(await screen.findByText('Enter a tour title')).toBeInTheDocument();
    expect(screen.getByText('Enter a destination')).toBeInTheDocument();
    expect(screen.getByText('Pick a category')).toBeInTheDocument();
    expect(screen.getByText('Enter a price per person')).toBeInTheDocument();
    expect(screen.getByText('Pick a guide')).toBeInTheDocument();
    expect(screen.getByText('Enter a title for the day')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
