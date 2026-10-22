import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Tours from './Tours';
import { MOCK_TOURS } from '../TourCard/TourCard.mocks';
import { MOCK_FILTER_OPTIONS } from './Tours.mocks';
import type { TourPage } from '@/constants/types';
import { withAppRouter } from '../../../.storybook/decorators/withAppRouter';

const tourPage = (overrides: Partial<TourPage> = {}): Promise<TourPage> =>
  Promise.resolve({
    tours: MOCK_TOURS,
    page: 1,
    total: MOCK_TOURS.length,
    pageCount: 1,
    ...overrides,
  });

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
    filterOptions: { control: false },
  },
  args: {
    tours: tourPage(),
    filterOptions: Promise.resolve(MOCK_FILTER_OPTIONS),
  },
} satisfies Meta<typeof Tours>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ManyPages: Story = {
  args: { tours: tourPage({ total: 95, pageCount: 10 }) },
};

export const LaterPage: Story = {
  args: { tours: tourPage({ page: 6, total: 95, pageCount: 10 }) },
};

export const Filtered: Story = {
  args: {
    tours: tourPage({ tours: MOCK_TOURS.slice(5, 7), total: 2 }),
    filters: { search: 'goa', status: 'published', categoryId: 6 },
  },
};

export const NoMatches: Story = {
  args: {
    tours: tourPage({ tours: [], total: 0, pageCount: 0 }),
    filters: { search: 'antarctica' },
  },
};

export const Empty: Story = {
  args: { tours: tourPage({ tours: [], total: 0, pageCount: 0 }) },
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
