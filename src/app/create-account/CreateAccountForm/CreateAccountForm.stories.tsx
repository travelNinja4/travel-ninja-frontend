import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { withAppRouter } from '../../../../.storybook/decorators/withAppRouter';
import AuthLayout from '@/components/AuthLayout';
import { STRINGS } from '@/constants/strings';
import { NotificationProvider } from '@/providers/NotificationProvider';
import CreateAccountForm from './CreateAccountForm';

// The page fetches countries on the server, so the screen is composed here with sample data
const meta = {
  title: 'screens/Create Account',
  component: CreateAccountForm,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    countries: [
      { name: 'India', code: '+91 (IN)', length: 10 },
      { name: 'United States', code: '+1 (US)', length: 10 },
      { name: 'United Kingdom', code: '+44 (GB)', length: 11 },
    ],
  },
  decorators: [
    withAppRouter,
    (Story) => (
      <NotificationProvider>
        <AuthLayout
          subtitle={STRINGS.AGENCY_ONBOARDING}
          bannerHeader={STRINGS.CREATE_ACCOUNT_BANNER_HEADER}
          bannerSubText={STRINGS.CREATE_ACCOUNT_BANNER_SUB_TEXT}
        >
          <Story />
        </AuthLayout>
      </NotificationProvider>
    ),
  ],
} satisfies Meta<typeof CreateAccountForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
};

export const Tablet: Story = {
  globals: { viewport: { value: 'tablet' } },
};

export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
};
