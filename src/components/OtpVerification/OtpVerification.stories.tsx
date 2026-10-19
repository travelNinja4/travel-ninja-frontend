import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { withAppRouter } from '../../../.storybook/decorators/withAppRouter';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { ROUTES, STRINGS } from '@/constants/strings';
import AuthLayout from '../AuthLayout';
import OtpVerification from './OtpVerification';

// Shown inside AuthLayout, as on /create-account/verify
const meta = {
  title: 'screens/Verification',
  component: OtpVerification,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    withAppRouter,
    (Story) => (
      <NotificationProvider>
        <AuthLayout
          subtitle={STRINGS.VERIFICATION}
          bannerHeader={STRINGS.VERIFICATION_BANNER_HEADER}
          bannerSubText={STRINGS.VERIFICATION_BANNER_SUB_TEXT}
        >
          <Story />
        </AuthLayout>
      </NotificationProvider>
    ),
  ],
  argTypes: {
    otpType: { control: 'inline-radio', options: ['email', 'mobile'] },
    loading: { control: 'boolean' },
  },
  args: {
    otpType: 'email',
    contact: { email: 'ops@wanderlytravels.example', phoneNumber: '+91-9876543210' },
    changeContactHref: ROUTES.CREATE_ACCOUNT,
    onSubmit: fn(),
    loading: false,
  },
} satisfies Meta<typeof OtpVerification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Email: Story = {};

export const Mobile: Story = {
  args: { otpType: 'mobile' },
};

export const Verifying: Story = {
  args: { loading: true },
};

export const EmailOnTablet: Story = {
  globals: { viewport: { value: 'tablet' } },
};

export const EmailOnDesktop: Story = {
  globals: { viewport: { value: 'desktop' } },
};
