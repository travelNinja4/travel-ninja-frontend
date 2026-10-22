import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import {
  ITINERARY,
  SCHEDULE_PRICING,
  TOUR_BASICS,
  TOUR_FORM,
  TOUR_POLICIES,
} from '@/constants/strings';
import type { MetaOption, TourDetails } from '@/constants/types';
import TourForm from './TourForm';
import { MOCK_TOUR_DETAILS } from './TourForm.mocks';

describe('TourForm', () => {
  const categories: MetaOption[] = [{ id: 6, value: 'Beach', label: 'Beach' }];
  const guides = [{ value: 'arjun', label: 'Arjun Mehta' }];

  const setup = (tour?: TourDetails) => {
    const onSave = vi.fn();
    render(<TourForm categories={categories} guides={guides} tour={tour} onSave={onSave} />);
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
      screen.getByRole('heading', { level: 1, name: TOUR_FORM.CREATE_TITLE }),
    ).toBeInTheDocument();
    expect(screen.getByText(TOUR_FORM.CREATE_DESCRIPTION)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: TOUR_FORM.SAVE_DRAFT })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: TOUR_FORM.PUBLISH })).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole('button', { name: TOUR_FORM.PUBLISH }));
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
    fireEvent.click(screen.getByRole('button', { name: TOUR_FORM.SAVE_DRAFT }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave.mock.calls[0][1]).toBe('draft');
  });

  it('shows the errors of every card and does not save an empty tour', async () => {
    const { onSave } = setup();
    fireEvent.click(screen.getByRole('button', { name: TOUR_FORM.PUBLISH }));
    expect(await screen.findByText('Enter a tour title')).toBeInTheDocument();
    expect(screen.getByText('Enter a destination')).toBeInTheDocument();
    expect(screen.getByText('Pick a category')).toBeInTheDocument();
    expect(screen.getByText('Enter a price per person')).toBeInTheDocument();
    expect(screen.getByText('Pick a guide')).toBeInTheDocument();
    expect(screen.getByText('Enter a title for the day')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  describe('editing a saved tour', () => {
    // MOCK_TOUR_DETAILS' category (Nature) isn't in `categories`, so it's added as an option
    it('shows the edit header and a single Update button', () => {
      setup(MOCK_TOUR_DETAILS);
      expect(
        screen.getByRole('heading', { level: 1, name: TOUR_FORM.EDIT_TITLE }),
      ).toBeInTheDocument();
      expect(screen.getByText('Coorg Weekend Escape · Published')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: TOUR_FORM.UPDATE })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: TOUR_FORM.SAVE_DRAFT })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: TOUR_FORM.PUBLISH })).not.toBeInTheDocument();
    });

    it('fills every card with the saved tour', () => {
      setup(MOCK_TOUR_DETAILS);
      expect(
        card(TOUR_BASICS.TITLE).getByLabelText(TOUR_BASICS.TOUR_TITLE, { exact: false }),
      ).toHaveValue('Coorg Weekend Escape');
      expect(screen.getByLabelText(TOUR_BASICS.CATEGORY, { exact: false })).toHaveValue('Nature');
      expect(screen.getByLabelText(SCHEDULE_PRICING.GUIDE, { exact: false })).toHaveValue(
        'Arjun Mehta',
      );
      expect(screen.getByLabelText(SCHEDULE_PRICING.PRICE)).toHaveValue(12500);
      expect(
        card(ITINERARY.TITLE).getAllByLabelText(ITINERARY.LOCATION, { exact: false }),
      ).toHaveLength(2);
      expect(screen.getByLabelText(TOUR_POLICIES.INCLUSIONS)).toHaveValue('Stay\nBreakfast');
    });

    it('updates the tour with its edits, keeping its status', async () => {
      const { onSave } = setup({ ...MOCK_TOUR_DETAILS, status: 'draft' });
      change(TOUR_BASICS.TITLE, TOUR_BASICS.TOUR_TITLE, 'Coorg Long Weekend');
      fireEvent.click(screen.getByRole('button', { name: TOUR_FORM.UPDATE }));
      await waitFor(() => expect(onSave).toHaveBeenCalled());
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Coorg Long Weekend',
          categoryId: '1',
          coverImage: { url: MOCK_TOUR_DETAILS.coverImageUrl },
          guide: 'arjun',
        }),
        'draft',
      );
    });
  });
});
