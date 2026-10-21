import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Plus } from 'lucide-react';
import Button from './Button';

const meta = {
  title: 'components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary'],
    },
    type: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },
  args: {
    children: 'Click Me',
    onClick: fn(),
    disabled: false,
    type: 'button',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithStartIcon: Story = {
  args: {
    children: 'Save',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Add day',
    variant: 'secondary',
    startIcon: Plus,
    iconSize: 16,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};
