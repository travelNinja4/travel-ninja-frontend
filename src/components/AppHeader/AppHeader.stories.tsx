import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import AppHeader from './AppHeader';

const meta = {
  title: 'components/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    nextjs: { navigation: { pathname: '/dashboard' } },
  },
  tags: ['autodocs'],
  args: { onNotificationsClick: fn() },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {};

export const InnerScreen: Story = {
  parameters: { nextjs: { navigation: { pathname: '/tours/new' } } },
};

export const Tablet: Story = {
  ...InnerScreen,
  globals: { viewport: { value: 'tablet' } },
};
