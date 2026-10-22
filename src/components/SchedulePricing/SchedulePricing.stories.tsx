import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FormProvider, useForm } from 'react-hook-form';
import type { TourSchedule } from '@/constants/types';
import SchedulePricing from './SchedulePricing';

const GUIDES = [
  { value: 'arjun', label: 'Arjun Mehta' },
  { value: 'priya', label: 'Priya Nair' },
  { value: 'rahul', label: 'Rahul Sharma' },
];

const FILLED: TourSchedule = {
  durationDays: 3,
  departureDate: '2026-11-20',
  returnDate: '2026-11-22',
  price: 15000,
  capacity: 12,
  guide: 'arjun',
};

type FormParams = {
  defaultValues?: Partial<TourSchedule>;
  errors?: Partial<Record<keyof TourSchedule, string>>;
};

// The parent form SchedulePricing registers on, set from `parameters.form`
function FormDecorator({ children, form }: { children: React.ReactNode; form?: FormParams }) {
  const methods = useForm<TourSchedule>({ defaultValues: form?.defaultValues ?? FILLED });

  useEffect(() => {
    Object.entries(form?.errors ?? {}).forEach(([name, message]) =>
      methods.setError(name as keyof TourSchedule, { message }),
    );
  }, [form, methods]);

  return (
    <FormProvider {...methods}>
      <div style={{ width: 320 }}>{children}</div>
    </FormProvider>
  );
}

const meta = {
  title: 'components/SchedulePricing',
  component: SchedulePricing,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters }) => (
      <FormDecorator form={parameters.form}>
        <Story />
      </FormDecorator>
    ),
  ],
  args: {
    guides: GUIDES,
  },
} satisfies Meta<typeof SchedulePricing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {};

export const Empty: Story = {
  parameters: { form: { defaultValues: {} } },
};

export const WithErrors: Story = {
  parameters: {
    form: {
      defaultValues: { ...FILLED, guide: '' },
      errors: { price: 'Enter a price per person', guide: 'Pick a guide' },
    },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
