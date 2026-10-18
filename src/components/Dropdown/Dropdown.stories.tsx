import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import Dropdown from './Dropdown';

const statusOptions = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const meta = {
  title: 'components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320, minHeight: 260 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text', description: 'Text shown above the field' },
    placeholder: { control: 'text' },
    error: { control: 'text', description: 'Error message; turns the border red' },
    helperText: { control: 'text', description: 'Hint shown when there is no error' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    options: { control: 'object' },
  },
  args: {
    label: 'Status',
    placeholder: 'Select status',
    options: statusOptions,
    onChange: fn(),
  },
} satisfies Meta<typeof Dropdown<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: 'pending' },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('confirmed');
    return (
      <Dropdown
        {...args}
        value={value}
        onChange={(next, option) => {
          setValue(next);
          args.onChange?.(next, option);
        }}
        helperText={`Selected: ${value}`}
      />
    );
  },
};

export const LongList: Story = {
  args: {
    label: 'Tour',
    placeholder: 'Select tour',
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `tour-${i + 1}`,
      label: `Tour package ${i + 1}`,
    })),
  },
};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: { required: true, error: 'Please select a status' },
};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Empty: Story = {
  args: { options: [] },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'confirmed' },
};
