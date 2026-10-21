import { ReactNode } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ITINERARY } from '@/constants/strings';
import type { TourItinerary } from '@/constants/types';
import Itinerary, { EMPTY_DAY } from './Itinerary';
import { itinerarySchema } from './ItinerarySchema';

describe('Itinerary', () => {
  /** The parent form Itinerary registers on; submitting it reports the values **/
  function Form({
    children,
    onSubmit,
    defaultValues,
  }: {
    children: ReactNode;
    onSubmit: (v: unknown) => void;
    defaultValues: Partial<TourItinerary>;
  }) {
    const methods = useForm<TourItinerary>({
      resolver: zodResolver(itinerarySchema),
      defaultValues,
    });
    return (
      <FormProvider {...methods}>
        <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
          {children}
          <button type="submit">Save</button>
        </form>
      </FormProvider>
    );
  }

  const setup = ({ defaultValues = { itinerary: [EMPTY_DAY] }, ...props } = {} as any) => {
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit} defaultValues={defaultValues}>
        <Itinerary {...props} />
      </Form>,
    );
    return { onSubmit };
  };

  const day = (n: number) =>
    screen.getByRole('region', { name: new RegExp(`^${ITINERARY.DAY} ${n}:`) });

  const fill = (n: number, title: string, location: string, description: string) => {
    const d = within(day(n));
    fireEvent.change(d.getByLabelText(ITINERARY.DAY_TITLE, { exact: false }), {
      target: { value: title },
    });
    fireEvent.change(d.getByLabelText(ITINERARY.LOCATION, { exact: false }), {
      target: { value: location },
    });
    fireEvent.change(d.getByLabelText(ITINERARY.DESCRIPTION, { exact: false }), {
      target: { value: description },
    });
  };

  it('starts with one untitled day', () => {
    setup();
    expect(screen.getByRole('region', { name: ITINERARY.TITLE })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
    expect(day(1)).toHaveTextContent('Day 1: Untitled');
  });

  it('still shows one day when the form has none', async () => {
    setup({ defaultValues: {} });
    expect(await screen.findByText('Day 1: Untitled')).toBeInTheDocument();
  });

  it('marks every field as required', () => {
    setup();
    expect(within(day(1)).getAllByText('*')).toHaveLength(3);
  });

  it('shows the typed title in the day header', () => {
    setup();
    fireEvent.change(within(day(1)).getByLabelText(ITINERARY.DAY_TITLE, { exact: false }), {
      target: { value: 'Arrival' },
    });
    expect(day(1)).toHaveTextContent('Day 1: Arrival');
  });

  it('adds a day below the last one and focuses its title', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: ITINERARY.ADD_DAY }));
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(['Day 1: Untitled', 'Day 2: Untitled']);
    await waitFor(() =>
      expect(within(day(2)).getByLabelText(ITINERARY.DAY_TITLE, { exact: false })).toHaveFocus(),
    );
  });

  it('hides Remove while there is only one day', () => {
    setup();
    expect(screen.queryByRole('button', { name: ITINERARY.REMOVE_DAY })).not.toBeInTheDocument();
  });

  it('removes a day and renumbers the ones after it', async () => {
    const { onSubmit } = setup();
    fill(1, 'Arrival', 'Manali', 'Check in');
    fireEvent.click(screen.getByRole('button', { name: ITINERARY.ADD_DAY }));
    fill(2, 'Solang Valley', 'Solang', 'Snow sports');
    fireEvent.click(screen.getByRole('button', { name: ITINERARY.ADD_DAY }));
    fill(3, 'Departure', 'Manali', 'Check out');

    fireEvent.click(within(day(2)).getByRole('button', { name: ITINERARY.REMOVE_DAY }));

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(['Day 1: Arrival', 'Day 2: Departure']);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      itinerary: [
        { title: 'Arrival', location: 'Manali', description: 'Check in' },
        { title: 'Departure', location: 'Manali', description: 'Check out' },
      ],
    });
  });

  it('hides Remove again once only one day is left', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: ITINERARY.ADD_DAY }));
    expect(screen.getAllByRole('button', { name: ITINERARY.REMOVE_DAY })).toHaveLength(2);
    fireEvent.click(within(day(1)).getByRole('button', { name: ITINERARY.REMOVE_DAY }));
    expect(screen.queryByRole('button', { name: ITINERARY.REMOVE_DAY })).not.toBeInTheDocument();
  });

  it('blocks submit and shows errors for empty fields', async () => {
    const { onSubmit } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await within(day(1)).findByText('Enter a title for the day')).toBeInTheDocument();
    expect(within(day(1)).getByText('Enter a location')).toBeInTheDocument();
    expect(within(day(1)).getByText('Enter a description')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits every day in order', async () => {
    const { onSubmit } = setup();
    fill(1, 'Arrival', 'Manali', 'Check in and rest');
    fireEvent.click(screen.getByRole('button', { name: ITINERARY.ADD_DAY }));
    fill(2, 'Solang Valley', 'Solang', 'Paragliding and snow sports');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      itinerary: [
        { title: 'Arrival', location: 'Manali', description: 'Check in and rest' },
        { title: 'Solang Valley', location: 'Solang', description: 'Paragliding and snow sports' },
      ],
    });
  });

  it('disables the fields and the buttons', () => {
    setup({ disabled: true, defaultValues: { itinerary: [EMPTY_DAY, EMPTY_DAY] } });
    screen
      .getAllByRole('button', { name: ITINERARY.REMOVE_DAY })
      .forEach((button) => expect(button).toBeDisabled());
    expect(screen.getByRole('button', { name: ITINERARY.ADD_DAY })).toBeDisabled();
    expect(within(day(1)).getByLabelText(ITINERARY.DESCRIPTION, { exact: false })).toBeDisabled();
  });
});
