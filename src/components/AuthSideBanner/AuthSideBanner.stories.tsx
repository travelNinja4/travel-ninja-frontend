import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { STRINGS } from '@/constants/strings';
import AuthSideBanner from './AuthSideBanner';

const meta = {
  title: 'components/AuthSideBanner',
  component: AuthSideBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', width: '100%', maxWidth: 720, height: 640 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    header: { control: 'text', description: 'Main line of the panel' },
    subText: { control: 'text', description: 'Supporting sentence under the header' },
  },
  args: {
    header: STRINGS.LOGIN_BANNER_HEADER,
    subText: STRINGS.LOGIN_BANNER_SUB_TEXT,
  },
} satisfies Meta<typeof AuthSideBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {};

export const CreateAccount: Story = {
  args: {
    header: STRINGS.CREATE_ACCOUNT_BANNER_HEADER,
    subText: STRINGS.CREATE_ACCOUNT_BANNER_SUB_TEXT,
  },
};

export const ResetPassword: Story = {
  args: {
    header: STRINGS.RESET_PASSWORD_BANNER_HEADER,
    subText: STRINGS.RESET_PASSWORD_BANNER_SUB_TEXT,
  },
};

export const HeaderOnly: Story = {
  args: { subText: undefined },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
  decorators: [
    (Story) => (
      <div style={{ width: 360, height: 320, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};
