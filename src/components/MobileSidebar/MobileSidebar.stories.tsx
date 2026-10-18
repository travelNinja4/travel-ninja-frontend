import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import MobileSidebar from './MobileSidebar'

const meta = {
  title: 'components/MobileSidebar',
  component: MobileSidebar,
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
} satisfies Meta<typeof MobileSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;