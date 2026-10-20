import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Breadcrumb from './Breadcrumb';

const meta = {
  title: 'components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LandingScreen: Story = {
  args: {
    items: [{ label: 'Dashboard', href: '/dashboard' }],
  },
};

export const InnerScreen: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Tours', href: '/tours' },
    ],
  },
};

export const DeepTrail: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Tours', href: '/tours' },
      { label: 'Himalayan Trek Departures', href: '/tours/himalayan-trek' },
      { label: 'Edit departure on 14 November' },
    ],
  },
};

// Phones fold the middle crumbs into "…"
export const DeepTrailMobile: Story = {
  ...DeepTrail,
  globals: { viewport: { value: 'mobile1' } },
};
