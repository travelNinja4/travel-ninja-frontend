import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import AuthSideBanner from './AuthSideBanner';

const meta = {
  title: 'components/AuthSideBanner',
  component: AuthSideBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    /** onClick: fn() **/
  },
} satisfies Meta<typeof AuthSideBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
