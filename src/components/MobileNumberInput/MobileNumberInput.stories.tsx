import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import MobileNumberInput from './MobileNumberInput'

const meta = {
  title: 'components/MobileNumberInput',
  component: MobileNumberInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { 
        control: 'text', 
        description: 'Sample label for the component' 
        },
  },
  args: { 
    /** onClick: fn() **/
    },
} satisfies Meta<typeof MobileNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;