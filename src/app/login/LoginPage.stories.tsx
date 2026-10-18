import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { withAppRouter } from '../../../.storybook/decorators/withAppRouter';
import { NotificationProvider } from '@/providers/NotificationProvider';
import LoginPage from './page';

const meta = {
  title: 'screens/Login',
  component: LoginPage,
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
} satisfies Meta<typeof LoginPage>;

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
