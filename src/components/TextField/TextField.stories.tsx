import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import TextField from './TextField';

const meta = {
  title: 'components/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed above the input',
      defaultValue: 'Sample Label',
    },
    type: {
      control: 'text',
      description: 'HTML input type',
      defaultValue: 'text',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
      defaultValue: 'Enter value',
    },
    error: {
      control: 'text',
      description: 'Error message to display below the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      defaultValue: false,
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
      defaultValue: false,
    },
    value: {
      control: 'text',
      description: 'Controlled value of the input',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when input value changes',
    },
  },
  args: {
    /** onClick: fn() **/
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: 'Invalid email address',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'You cannot type here',
    disabled: true,
  },
};
