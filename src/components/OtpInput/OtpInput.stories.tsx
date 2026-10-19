import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import OtpInput from './OtpInput';

const meta = {
  title: 'components/OtpInput',
  component: OtpInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    label: 'Verification code',
    value: '',
    onChange: () => {},
    length: 6,
  },
  // Keeps the boxes controlled so typing works in the canvas
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ width: 420 }}>
        <OtpInput {...args} value={value} onChange={setValue} />
      </div>
    );
  },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const PartlyFilled: Story = {
  args: { value: '482' },
};

export const WithError: Story = {
  args: { value: '48', hasError: true },
};

export const Disabled: Story = {
  args: { value: '482913', disabled: true },
};

export const FourDigits: Story = {
  args: { length: 4 },
};
