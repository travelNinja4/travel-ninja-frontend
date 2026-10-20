import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Tours from './Tours';
import { MOCK_TOURS } from '../TourCard/TourCard.mocks';
import type { TourPage } from '@/constants/types';
import { withAppRouter } from '../../../.storybook/decorators/withAppRouter';

const tourPage = (overrides: Partial<TourPage> = {}): Promise<TourPage> =>
  Promise.resolve({ tours: MOCK_TOURS, page: 1, hasNextPage: false, ...overrides });

const meta = {
  title: 'components/Tours',
  component: Tours,
  parameters: {
    layout: 'padded',
  },
  decorators: [withAppRouter],
  tags: ['autodocs'],
  argTypes: {
    // A promise can't be edited from the controls panel
    tours: { control: false },
  },
  args: {
    tours: tourPage(),
  },
} satisfies Meta<typeof Tours>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithNextPage: Story = {
  args: { tours: tourPage({ hasNextPage: true }) },
};

export const LaterPage: Story = {
  args: { tours: tourPage({ page: 6, hasNextPage: true }) },
};

export const Empty: Story = {
  args: { tours: tourPage({ tours: [] }) },
};

export const Loading: Story = {
  args: { tours: new Promise<TourPage>(() => {}) },
};

export const Tablet: Story = {
  globals: { viewport: { value: 'tablet' } },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
};
