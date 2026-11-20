import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import AgencyPreviewCard from './AgencyPreviewCard';

const meta = {
  title: 'components/AgencyPreviewCard',
  component: AgencyPreviewCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '19rem' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    tagline: { control: 'text' },
    description: { control: 'text' },
    destinations: { control: 'text', description: 'Comma-separated places' },
    logoUrl: { control: 'text' },
    bannerUrl: { control: 'text' },
  },
  args: {
    name: 'Wanderly Travels',
    onAdd: fn(),
  },
} satisfies Meta<typeof AgencyPreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A new agency: only the name, so every other part prompts to be filled */
export const Empty: Story = {};

export const Filled: Story = {
  args: {
    tagline: 'Curated journeys across India',
    description:
      'Wanderly Travels crafts small-group tours across India — from Western Ghats weekends to heritage trails in Rajasthan and island getaways in the Andamans. We focus on local guides, small groups and honest pricing.',
    destinations: 'Karnataka, Kerala, Rajasthan, Meghalaya, Andaman, Hampi, Goa, Ladakh',
  },
};

export const PartlyFilled: Story = {
  args: {
    tagline: 'Curated journeys across India',
  },
};

export const NoName: Story = {
  args: { name: '' },
};
