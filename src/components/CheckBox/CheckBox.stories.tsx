import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import Link from 'next/link';
import CheckBox from './CheckBox';

const meta = {
  title: 'components/CheckBox',
  component: CheckBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Text or elements shown next to the box' },
    helperText: { control: 'text', description: 'Hint shown under the label' },
    error: { control: 'text', description: 'Error message; turns the box red' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean', description: 'Shows a dash instead of a check' },
    checked: { control: 'boolean' },
  },
  args: {
    label: 'Send me trip updates by email',
    onChange: fn(),
  },
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

// Matches the create-account terms field
export const TermsAndConditions: Story = {
  args: { required: true },
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <CheckBox
        {...args}
        name="termStatus"
        checked={checked}
        onChange={(next, event) => {
          setChecked(next);
          args.onChange?.(next, event);
        }}
        label={
          <>
            I agree to the <Link href="/terms">Terms of Service</Link> and{' '}
            <Link href="/privacy">Privacy Policy</Link>
          </>
        }
      />
    );
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['goa']);
    const tours = [
      { id: 'goa', label: 'Goa beach escape' },
      { id: 'kerala', label: 'Kerala backwaters' },
      { id: 'ladakh', label: 'Ladakh road trip' },
    ];
    const allSelected = selected.length === tours.length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CheckBox
          label="Select all tours"
          checked={allSelected}
          indeterminate={selected.length > 0 && !allSelected}
          onChange={(checked) => setSelected(checked ? tours.map((t) => t.id) : [])}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 28 }}>
          {tours.map((tour) => (
            <CheckBox
              key={tour.id}
              name="tours"
              value={tour.id}
              label={tour.label}
              checked={selected.includes(tour.id)}
              onChange={(checked) =>
                setSelected((prev) =>
                  checked ? [...prev, tour.id] : prev.filter((id) => id !== tour.id),
                )
              }
            />
          ))}
        </div>
      </div>
    );
  },
};

export const WithHelperText: Story = {
  args: { helperText: 'At most one email a week. Unsubscribe anytime.' },
};

export const WithError: Story = {
  args: {
    label: 'I agree to the Terms of Service and Privacy Policy',
    required: true,
    error: 'You must accept the terms to continue',
  },
};

export const LongLabel: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label:
      'I confirm that all travellers on this booking hold valid passports and visas for every destination on the itinerary',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};
