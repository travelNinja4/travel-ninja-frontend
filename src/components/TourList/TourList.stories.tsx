import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import TourList from './TourList';
import { MOCK_TOURS } from '../TourCard/TourCard.mocks';

const meta = {
  title: 'components/TourList',
  component: TourList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    total: { control: 'number', description: 'All tours matching the filters' },
    preloadCount: { control: 'number', description: 'How many covers to preload' },
  },
  args: {
    tours: MOCK_TOURS,
    onDuplicate: fn(),
  },
} satisfies Meta<typeof TourList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnePage: Story = {
  args: { tours: MOCK_TOURS.slice(0, 4), total: 24 },
};

export const Empty: Story = {
  args: { tours: [] },
};

export const Tablet: Story = {
  globals: { viewport: { value: 'tablet' } },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
};
