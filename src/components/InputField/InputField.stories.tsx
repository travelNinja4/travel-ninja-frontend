import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Calendar, Mail, Search } from 'lucide-react';
import InputField from './InputField';

const meta = {
  title: 'components/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text', description: 'Text shown above the input' },
    placeholder: { control: 'text' },
    error: { control: 'text', description: 'Error message; turns the border red' },
    helperText: { control: 'text', description: 'Hint shown when there is no error' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url'] },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    leftIcon: { control: false },
    rightIcon: { control: false },
  },
  args: {
    label: 'Work email',
    placeholder: 'ops@wanderlytravels.example',
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Password: Story = {
  args: { label: 'Password', type: 'password', placeholder: 'Enter password' },
};

export const WithError: Story = {
  args: { error: 'Enter a valid work email', defaultValue: 'ops@wanderly' },
};

export const WithHelperText: Story = {
  args: { helperText: "We'll send booking alerts here" },
};

export const WithLeftIcon: Story = {
  args: { type: 'email', leftIcon: <Mail size={16} /> },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Travel date',
    placeholder: 'Select date',
    readOnly: true,
    rightIcon: <Calendar size={16} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search bookings...',
    leftIcon: <Search size={16} />,
    rightIcon: <Mail size={16} />,
  },
};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'ops@wanderlytravels.example' },
};
