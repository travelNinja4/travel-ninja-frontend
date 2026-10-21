import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TourItinerary } from '@/constants/types';
import Itinerary, { EMPTY_DAY } from './Itinerary';
import { itinerarySchema } from './ItinerarySchema';

const FILLED: TourItinerary = {
  itinerary: [
    {
      title: 'Arrival',
      location: 'Manali',
      description: 'Check in and evening walk on Mall Road.',
    },
    { title: 'Solang Valley', location: 'Solang', description: 'Paragliding and snow sports.' },
  ],
};

// The parent form Itinerary registers on, set from `parameters.defaultValues`; Save runs validation
function FormDecorator({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: TourItinerary;
}) {
  const methods = useForm<TourItinerary>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: defaultValues ?? { itinerary: [EMPTY_DAY] },
  });

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={methods.handleSubmit(() => {})} style={{ maxWidth: 960 }}>
        {children}
        <button type="submit" style={{ marginTop: 16 }}>
          Save
        </button>
      </form>
    </FormProvider>
  );
}

const meta = {
  title: 'components/Itinerary',
  component: Itinerary,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters }) => (
      <FormDecorator defaultValues={parameters.defaultValues}>
        <Story />
      </FormDecorator>
    ),
  ],
} satisfies Meta<typeof Itinerary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  parameters: { defaultValues: FILLED },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { defaultValues: FILLED },
};
