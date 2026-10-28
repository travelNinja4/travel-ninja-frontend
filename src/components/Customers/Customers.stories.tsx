import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Customers from './Customers';
import { MOCK_CITIES, MOCK_CUSTOMERS } from './Customers.mocks';
import type { CustomerPage } from '@/constants/types';
import { withAppRouter } from '../../../.storybook/decorators/withAppRouter';

const customerPage = (overrides: Partial<CustomerPage> = {}): Promise<CustomerPage> =>
  Promise.resolve({
    customers: MOCK_CUSTOMERS,
    page: 1,
    total: MOCK_CUSTOMERS.length,
    pageCount: 1,
    ...overrides,
  });

const meta = {
  title: 'components/Customers',
  component: Customers,
  parameters: {
    layout: 'padded',
  },
  decorators: [withAppRouter],
  tags: ['autodocs'],
  argTypes: {
    // A promise can't be edited from the controls panel
    customers: { control: false },
    cities: { control: false },
  },
  args: {
    customers: customerPage(),
    cities: Promise.resolve(MOCK_CITIES),
  },
} satisfies Meta<typeof Customers>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ManyPages: Story = {
  args: { customers: customerPage({ total: 48, pageCount: 5 }) },
};

export const Filtered: Story = {
  args: {
    customers: customerPage({ customers: MOCK_CUSTOMERS.slice(0, 1), total: 1 }),
    filters: { city: 'Chennai', search: 'sneha' },
  },
};

export const NoMatches: Story = {
  args: {
    customers: customerPage({ customers: [], total: 0, pageCount: 0 }),
    filters: { search: 'zzz' },
  },
};

export const Empty: Story = {
  args: { customers: customerPage({ customers: [], total: 0, pageCount: 0 }) },
};

export const Loading: Story = {
  args: { customers: new Promise<CustomerPage>(() => {}) },
};
