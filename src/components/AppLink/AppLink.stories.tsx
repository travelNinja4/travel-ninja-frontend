import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import AppLink from './AppLink';

const meta = {
  title: 'components/AppLink',
  component: AppLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    href: {
      control: 'text',
      description: 'Destination URL for the link',
    },
    children: {
      control: 'text',
      description: 'Content inside the link',
    },
    isExternal: {
      control: 'boolean',
      description: 'Opens the link in a new tab if true',
    },
    replace: {
      control: 'boolean',
      description: 'Replaces the current history state instead of pushing a new URL',
    },
    className: {
      control: 'text',
      description: 'Custom CSS class for styling',
    },
  },
  args: {
    href: '/about',
    children: 'About Us',
    isExternal: false,
  },
} satisfies Meta<typeof AppLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: '/about',
    children: 'Go to About',
  },
};

export const External: Story = {
  args: {
    href: 'https://google.com',
    children: 'Go to Google',
    isExternal: true,
  },
};

export const CustomClass: Story = {
  args: {
    href: '/contact',
    children: 'Contact Us',
    className: 'text-blue-600 underline hover:text-blue-800',
  },
};
