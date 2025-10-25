import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import BookingTable from './BookingTable';

const meta = {
  title: 'components/BookingTable',
  component: BookingTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Sample label for the component',
    },
  },
  args: {
    label: 'Recent Bookings',
  },
} satisfies Meta<typeof BookingTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Recent Bookings',
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'My Custom Booking Table',
  },
};
