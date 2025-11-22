import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import DesktopSidebar from './DesktopSidebar'

const meta = {
  title: 'components/DesktopSidebar',
  component: DesktopSidebar,
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
} satisfies Meta<typeof DesktopSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;