import { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { SCHEDULE_PRICING } from '@/constants/strings';
import type { TourSchedule } from '@/constants/types';
import SchedulePricing from './SchedulePricing';

describe('SchedulePricing', () => {
  const defaults: TourSchedule = {
    durationDays: 3,
    departureDate: '2026-11-20',
    returnDate: '2026-11-22',
    price: 15000,
    capacity: 12,
    guide: 'arjun',
  };

  const guides = [
    { value: 'arjun', label: 'Arjun Mehta' },
    { value: 'priya', label: 'Priya Nair' },
  ];

  /** The parent form SchedulePricing registers on; submitting it reports the values **/
  function Form({ children, onSubmit }: { children: ReactNode; onSubmit: (v: unknown) => void }) {
    const methods = useForm<TourSchedule>({ defaultValues: defaults });
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {children}
          <button type="submit">Save</button>
        </form>
      </FormProvider>
    );
  }

  const setup = (props = {}) => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <SchedulePricing guides={guides} {...props} />
      </Form>,
    );
    const submit = async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
      await waitFor(() => expect(onSubmit).toHaveBeenCalled());
      return onSubmit.mock.calls[0][0];
    };
    return { submit };
  };

  const change = (label: string, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });

  it('renders the title and every field with the form values', () => {
    setup();
    expect(screen.getByRole('region', { name: SCHEDULE_PRICING.TITLE })).toBeInTheDocument();
    expect(screen.getByLabelText(SCHEDULE_PRICING.DURATION)).toHaveValue(3);
    expect(screen.getByLabelText(SCHEDULE_PRICING.DEPARTURE_DATE)).toHaveValue('2026-11-20');
    expect(screen.getByLabelText(SCHEDULE_PRICING.RETURN_DATE)).toHaveValue('2026-11-22');
    expect(screen.getByLabelText(SCHEDULE_PRICING.PRICE)).toHaveValue(15000);
    expect(screen.getByLabelText(SCHEDULE_PRICING.CAPACITY)).toHaveValue(12);
    expect(screen.getByLabelText(SCHEDULE_PRICING.GUIDE)).toHaveValue('Arjun Mehta');
  });

  it('submits the entered values, with numbers as numbers', async () => {
    const { submit } = setup();
    change(SCHEDULE_PRICING.PRICE, '18000');
    change(SCHEDULE_PRICING.CAPACITY, '20');
    expect(await submit()).toEqual({ ...defaults, price: 18000, capacity: 20 });
  });

  it('moves the return date when the duration changes', async () => {
    const { submit } = setup();
    change(SCHEDULE_PRICING.DURATION, '5');
    expect(screen.getByLabelText(SCHEDULE_PRICING.RETURN_DATE)).toHaveValue('2026-11-24');
    expect(await submit()).toMatchObject({ durationDays: 5, returnDate: '2026-11-24' });
  });

  it('moves the return date when the departure date changes', () => {
    setup();
    change(SCHEDULE_PRICING.DEPARTURE_DATE, '2026-12-30');
    expect(screen.getByLabelText(SCHEDULE_PRICING.RETURN_DATE)).toHaveValue('2027-01-01');
  });

  it('updates the duration when the return date changes', async () => {
    const { submit } = setup();
    change(SCHEDULE_PRICING.RETURN_DATE, '2026-11-26');
    expect(screen.getByLabelText(SCHEDULE_PRICING.DURATION)).toHaveValue(7);
    expect(await submit()).toMatchObject({ durationDays: 7, returnDate: '2026-11-26' });
  });

  it('leaves the dates alone when the duration is cleared', () => {
    setup();
    change(SCHEDULE_PRICING.DURATION, '');
    expect(screen.getByLabelText(SCHEDULE_PRICING.RETURN_DATE)).toHaveValue('2026-11-22');
  });

  it('does not let the return date go before departure', () => {
    setup();
    change(SCHEDULE_PRICING.DEPARTURE_DATE, '2026-12-01');
    expect(screen.getByLabelText(SCHEDULE_PRICING.RETURN_DATE)).toHaveAttribute(
      'min',
      '2026-12-01',
    );
  });

  it('submits the selected guide', async () => {
    const { submit } = setup();
    fireEvent.click(screen.getByLabelText(SCHEDULE_PRICING.GUIDE));
    fireEvent.click(screen.getByRole('option', { name: 'Priya Nair' }));
    expect(await submit()).toMatchObject({ guide: 'priya' });
  });

  it('shows the errors set on the form', async () => {
    function WithErrors() {
      const methods = useForm<TourSchedule>({ defaultValues: defaults });
      return (
        <FormProvider {...methods}>
          <SchedulePricing guides={guides} />
          <button
            type="button"
            onClick={() => {
              methods.setError('price', { message: 'Enter a price' });
              methods.setError('guide', { message: 'Pick a guide' });
            }}
          >
            Fail
          </button>
        </FormProvider>
      );
    }
    render(<WithErrors />);
    fireEvent.click(screen.getByRole('button', { name: 'Fail' }));
    expect(await screen.findByText('Enter a price')).toBeInTheDocument();
    expect(screen.getByText('Pick a guide')).toBeInTheDocument();
  });

  it('disables every field', () => {
    setup({ disabled: true });
    expect(screen.getByLabelText(SCHEDULE_PRICING.DURATION)).toBeDisabled();
    expect(screen.getByLabelText(SCHEDULE_PRICING.GUIDE)).toBeDisabled();
  });
});
