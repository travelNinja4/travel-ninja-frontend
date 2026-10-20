import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import TourCard from './TourCard';
import { MOCK_TOURS } from './TourCard.mocks';

const meta = {
  title: 'components/TourCard',
  component: TourCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 340 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    preload: { control: 'boolean', description: 'Preloads the cover image' },
  },
  args: {
    tour: MOCK_TOURS[0],
    onDuplicate: fn(),
  },
} satisfies Meta<typeof TourCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Published: Story = {};

export const Draft: Story = {
  args: { tour: MOCK_TOURS[5] },
};

export const SoldOut: Story = {
  args: { tour: MOCK_TOURS[1] },
};

export const LongTitle: Story = {
  args: {
    tour: {
      ...MOCK_TOURS[3],
      title: 'Rajasthan Cultural Journey through Forts, Deserts and Palaces',
    },
  },
};

export const NoCoverImage: Story = {
  args: { tour: { ...MOCK_TOURS[0], coverImageUrl: null } },
};

export const BookedSeatsUnknown: Story = {
  args: { tour: { ...MOCK_TOURS[0], bookedSeats: undefined } },
};

export const WithoutDuplicate: Story = {
  args: { onDuplicate: undefined },
};
