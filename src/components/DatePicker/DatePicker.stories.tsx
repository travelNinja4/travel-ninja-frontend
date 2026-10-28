import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import DatePicker, { DatePickerProps } from './DatePicker';

// Typed against the props union directly: `typeof DatePicker` collapses it to `never`
const meta: Meta<DatePickerProps> = {
  title: 'components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 296, minHeight: 460 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text', description: 'Text shown above the field' },
    placeholder: { control: 'text' },
    displayMode: { control: 'inline-radio', options: ['inline', 'modal'] },
    error: { control: 'text', description: 'Error message; turns the border red' },
    helperText: { control: 'text', description: 'Hint shown when there is no error' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Departure date',
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<DatePickerProps>;

export const Default: Story = {};

export const WithDefaultValue: Story = {
  args: { defaultValue: '2026-11-14' },
};

export const FutureOnly: Story = {
  args: { minDate: new Date(), defaultValue: '2026-11-14' },
};

export const Range: Story = {
  args: { label: 'Date range', mode: 'range', min: 1, max: 6 },
};

export const Multiple: Story = {
  args: { label: 'Departures', mode: 'multiple' },
};

export const Modal: Story = {
  args: { displayMode: 'modal' },
};

export const WithError: Story = {
  args: { error: 'Pick a departure date', required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
