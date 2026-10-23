import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NOTIFICATION_TYPES, ROUTES, STRINGS, TOUR_FORM } from '@/constants/strings';
import type { TourFormProps } from '@/components/TourForm/TourForm';
import type { TourFormValues } from '@/constants/types';
import NewTourForm from './NewTourForm';

const push = vi.fn();
const showNotification = vi.fn();
const createTourAction = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/providers/NotificationProvider', () => ({
  useNotification: () => ({ showNotification }),
}));
vi.mock('@/actions/tours', () => ({
  createTourAction: (...args: unknown[]) => createTourAction(...args),
}));

const values = {
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
  itinerary: [{ title: 'Arrival', location: 'Panaji', description: 'Check in' }],
  inclusions: '',
  exclusions: '',
  cancellationPolicy: '',
} satisfies TourFormValues;

// The form itself is covered by its own tests; this stands in for its two create buttons
vi.mock('@/components/TourForm', () => ({
  default: ({ onSave }: TourFormProps) => (
    <>
      <button onClick={() => onSave?.(values, 'draft')}>{TOUR_FORM.SAVE_DRAFT}</button>
      <button onClick={() => onSave?.(values, 'published')}>{TOUR_FORM.PUBLISH}</button>
    </>
  ),
}));

describe('NewTourForm', () => {
  const guides = [{ value: 'arjun', label: 'Arjun Mehta' }];

  const setup = () => render(<NewTourForm categories={[]} guides={guides} />);
  const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }));

  beforeEach(() => {
    vi.clearAllMocks();
    createTourAction.mockResolvedValue({ success: true, data: { id: 1 } });
  });

  it('saves a draft and goes back to the tours list', async () => {
    setup();
    click(TOUR_FORM.SAVE_DRAFT);

    await waitFor(() => expect(push).toHaveBeenCalledWith(ROUTES.TOURS));
    expect(createTourAction).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'draft', categoryId: 6, guide: 'Arjun Mehta' }),
    );
    expect(showNotification).toHaveBeenCalledWith(
      TOUR_FORM.DRAFT_SAVED,
      values.title,
      NOTIFICATION_TYPES.SUCCESS,
    );
  });

  it('publishes the tour', async () => {
    setup();
    click(TOUR_FORM.PUBLISH);

    await waitFor(() => expect(push).toHaveBeenCalledWith(ROUTES.TOURS));
    expect(createTourAction).toHaveBeenCalledWith(expect.objectContaining({ status: 'published' }));
    expect(showNotification).toHaveBeenCalledWith(
      TOUR_FORM.PUBLISHED,
      values.title,
      NOTIFICATION_TYPES.SUCCESS,
    );
  });

  it('shows the API’s errors and stays on the form', async () => {
    createTourAction.mockResolvedValue({ success: false, errors: ['Unknown category'] });
    setup();
    click(TOUR_FORM.PUBLISH);

    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith(
        STRINGS.ERROR,
        'Unknown category',
        NOTIFICATION_TYPES.ERROR,
      ),
    );
    expect(push).not.toHaveBeenCalled();
  });
});
