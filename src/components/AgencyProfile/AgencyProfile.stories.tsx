import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import type { ActionResult, Region } from '@/constants/types';
import AgencyProfile from './AgencyProfile';
import { MOCK_STATES, mockGetDistricts } from './AgencyProfile.mocks';

const meta = {
  title: 'components/AgencyProfile',
  component: AgencyProfile,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    profile: { control: 'object' },
    states: { control: 'object' },
    getDistricts: { control: false },
  },
  args: {
    profile: { name: 'Wanderly Travels' },
    states: MOCK_STATES,
    getDistricts: fn(mockGetDistricts),
    onSave: fn(),
  },
} satisfies Meta<typeof AgencyProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewAgency: Story = {};

export const Filled: Story = {
  args: {
    profile: {
      name: 'Wanderly Travels',
      tagline: 'Curated journeys across India',
      description:
        'Small-group trips of 8–12 guests, led by local guides. Prices include stays, transfers and most meals.',
      destinations: 'Karnataka, Kerala',
      email: 'ops@wanderlytravels.example',
      phone: '+91 98765 43210',
      website: 'https://wanderlytravels.example',
      street: '42 Church Street, Ashok Nagar',
      state: '1',
      district: '11',
      city: 'Bengaluru',
      pin: '560025',
    },
  },
};

export const DistrictsFailToLoad: Story = {
  args: {
    getDistricts: fn(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- same signature as getDistrictsAction
      async (stateId: number): Promise<ActionResult<Region[]>> => ({
        success: false,
        errors: ['We couldn’t load districts. Try again.'],
      }),
    ),
  },
};
