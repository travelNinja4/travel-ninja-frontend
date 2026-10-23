import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NOTIFICATION_TYPES, ROUTES, STRINGS, TOUR_FORM } from '@/constants/strings';
import type { TourFormProps } from '@/components/TourForm/TourForm';
import { MOCK_TOUR_DETAILS } from '@/components/TourForm/TourForm.mocks';
import type { TourFormValues } from '@/constants/types';
import { toTourFormValues, withGuide } from '@/utils/tourForm';
import EditTourForm from './EditTourForm';

const push = vi.fn();
const showNotification = vi.fn();
const updateTourAction = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/providers/NotificationProvider', () => ({
  useNotification: () => ({ showNotification }),
}));
vi.mock('@/actions/tours', () => ({
  updateTourAction: (...args: unknown[]) => updateTourAction(...args),
}));

const tour = { ...MOCK_TOUR_DETAILS, status: 'draft' as const };
const guides = [{ value: 'arjun', label: 'Arjun Mehta' }];
const saved = toTourFormValues(tour, withGuide(guides, tour.guide));
let values: TourFormValues;

// The form itself is covered by its own tests; this stands in for its Update button
vi.mock('@/components/TourForm', () => ({
  default: ({ onSave }: TourFormProps) => (
    <button onClick={() => onSave?.(values, 'draft')}>{TOUR_FORM.UPDATE}</button>
  ),
}));

describe('EditTourForm', () => {
  const setup = () => render(<EditTourForm tour={tour} categories={[]} guides={guides} />);
  const update = () => fireEvent.click(screen.getByRole('button', { name: TOUR_FORM.UPDATE }));

  beforeEach(() => {
    vi.clearAllMocks();
    values = saved;
    updateTourAction.mockResolvedValue({ success: true, data: undefined });
  });

  it('sends only the changed fields and goes back to the tours list', async () => {
    values = { ...saved, title: 'Coorg Escape Updated', price: 13000 };
    setup();
    update();

    await waitFor(() => expect(push).toHaveBeenCalledWith(ROUTES.TOURS));
    expect(updateTourAction).toHaveBeenCalledWith(tour.id, {
      title: 'Coorg Escape Updated',
      price: 13000,
    });
    expect(showNotification).toHaveBeenCalledWith(
      TOUR_FORM.UPDATED,
      'Coorg Escape Updated',
      NOTIFICATION_TYPES.SUCCESS,
    );
  });

  it('skips the request when nothing changed', async () => {
    setup();
    update();

    await waitFor(() => expect(push).toHaveBeenCalledWith(ROUTES.TOURS));
    expect(updateTourAction).not.toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalledWith(
      TOUR_FORM.NO_CHANGES,
      tour.title,
      NOTIFICATION_TYPES.INFO,
    );
  });

  it('shows the API’s errors and stays on the form', async () => {
    values = { ...saved, title: 'New title' };
    updateTourAction.mockResolvedValue({ success: false, errors: ['Tour not found'] });
    setup();
    update();

    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith(
        STRINGS.ERROR,
        'Tour not found',
        NOTIFICATION_TYPES.ERROR,
      ),
    );
    expect(push).not.toHaveBeenCalled();
  });
});
