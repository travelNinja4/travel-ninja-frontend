import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import AuthSideBanner from './AuthSideBanner'

const meta = {
  title: 'components/AuthSideBanner',
  component: AuthSideBanner,
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
} satisfies Meta<typeof AuthSideBanner>;

export default meta;
type Story = StoryObj<typeof meta>;