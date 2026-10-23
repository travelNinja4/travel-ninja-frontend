import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarX, Plus, SearchX } from 'lucide-react';
import EmptyState from './EmptyState';
import Button from '../Button';

const meta = {
  title: 'components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    titleTag: { control: 'select', options: ['h1', 'h2', 'h3', 'h4', 'p'] },
  },
  args: {
    title: 'No bookings yet',
    description: 'Bookings will show up here once customers start booking your tours.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    icon: CalendarX,
    action: <Button startIcon={Plus}>Create tour</Button>,
  },
};

export const NoMatches: Story = {
  args: {
    icon: SearchX,
    title: 'No matching bookings',
    description: 'Try a different search term or filter.',
  },
};

export const TitleOnly: Story = {
  args: { icon: null, description: undefined },
};
