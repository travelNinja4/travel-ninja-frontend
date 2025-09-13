import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import OtpVerification from './OtpVerification';

const meta = {
  title: 'components/OtpVerification',
  component: OtpVerification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    /** onClick: fn() **/
  },
} satisfies Meta<typeof OtpVerification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
