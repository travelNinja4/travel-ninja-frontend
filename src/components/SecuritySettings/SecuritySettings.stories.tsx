import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import SecuritySettings from './SecuritySettings';
import { MOCK_SESSIONS } from './SecuritySettings.mocks';

const meta = {
  title: 'components/SecuritySettings',
  component: SecuritySettings,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    sessions: MOCK_SESSIONS,
    onRevoke: fn(),
  },
} satisfies Meta<typeof SecuritySettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnlyCurrentSession: Story = {
  args: { sessions: MOCK_SESSIONS.slice(0, 1) },
};
