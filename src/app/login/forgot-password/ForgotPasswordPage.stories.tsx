import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { withAppRouter } from '../../../../.storybook/decorators/withAppRouter';
import { NotificationProvider } from '@/providers/NotificationProvider';
import ForgotPasswordPage from './page';

const meta = {
  title: 'screens/Forgot Password',
  component: ForgotPasswordPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    withAppRouter,
    (Story) => (
      <NotificationProvider>
        <Story />
      </NotificationProvider>
    ),
  ],
} satisfies Meta<typeof ForgotPasswordPage>;

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
