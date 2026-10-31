import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MobileNumberInput from './MobileNumberInput';

const meta = {
  title: 'components/MobileNumberInput',
  component: MobileNumberInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text', description: 'Text shown above the input' },
    dialCode: { control: 'text', description: 'Fixed dial code shown before the number' },
    maxLength: { control: 'number', description: 'Digits allowed, without the dial code' },
    error: { control: 'text', description: 'Error message; turns the border red' },
    helperText: { control: 'text', description: 'Hint shown when there is no error' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  args: {
    label: 'Mobile number',
  },
} satisfies Meta<typeof MobileNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: { defaultValue: '9876543210' },
};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: { defaultValue: '12345', error: 'Enter a valid 10-digit mobile number' },
};

export const WithHelperText: Story = {
  args: { helperText: "We'll send booking updates to this number" },
};

export const ReadOnly: Story = {
  args: { defaultValue: '9876543210', readOnly: true },
};

export const Disabled: Story = {
  args: { defaultValue: '9876543210', disabled: true },
};
