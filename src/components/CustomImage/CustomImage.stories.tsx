import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import CustomImage from './CustomImage';

const meta = {
  title: 'components/CustomImage',
  component: CustomImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'Image source key from IMAGES or a direct URL',
    },
    alt: {
      control: 'text',
      description: 'Accessible alt text for the image',
    },
    width: {
      control: 'number',
      description: 'Image width (ignored if fill=true)',
    },
    height: {
      control: 'number',
      description: 'Image height (ignored if fill=true)',
    },
    fill: {
      control: 'boolean',
      description: 'If true, the image will fill its container',
    },
    isUrl: {
      control: 'boolean',
      description: 'If true, src is treated as a direct URL instead of IMAGES key',
    },
    loading: {
      control: { type: 'radio' },
      options: ['lazy', 'eager'],
      description: 'Image loading strategy',
    },
    priority: {
      control: 'boolean',
      description: 'If true, loads image with high priority',
    },
  },
  args: {
    src: 'FALLBACK_IMG',
    alt: 'Default Image',
    width: 200,
    height: 200,
    fill: false,
    isUrl: false,
    loading: 'lazy',
    priority: false,
  },
} satisfies Meta<typeof CustomImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFallback: Story = {
  args: {
    src: 'INVALID_KEY',
    alt: 'Fallback image demo',
  },
};

export const CloudinaryImage: Story = {
  args: {
    src: 'FALLBACK_IMG',
    alt: 'Cloudinary image example',
    width: 300,
    height: 200,
  },
};

export const RemoteUrlImage: Story = {
  args: {
    src: 'https://picsum.photos/300/200',
    alt: 'External URL image',
    isUrl: true,
  },
};

export const FillContainer: Story = {
  args: {
    src: 'FALLBACK_IMG',
    alt: 'Fill container demo',
    fill: true,
    style: { objectFit: 'cover' },
  },
};
