import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { ChevronRight } from 'lucide-react';
import Drawer from './Drawer';

const meta = {
  title: 'components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
    },
    open: { control: 'boolean' },
    dismissible: { control: 'boolean' },
    closeIcon: { control: false },
  },
  args: {
    open: true,
    size: 'md',
    title: 'Sneha Krishnan',
    onClose: fn(),
    children: <p>Anything can go inside the drawer: details, a form, related records.</p>,
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: 'sm' } };

export const Large: Story = { args: { size: 'lg' } };

export const CustomCloseIcon: Story = {
  args: { closeIcon: ChevronRight, closeLabel: 'Hide details' },
};

// Taller than the screen: the body scrolls under a fixed header
export const LongContent: Story = {
  args: {
    children: (
      <>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i}>Booking note {i + 1}.</p>
        ))}
      </>
    ),
  },
};
