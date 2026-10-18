import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import Image from './Image';

const meta = {
  title: 'components/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text', description: 'Local path, remote URL or static import' },
    alt: { control: 'text', description: 'Describes the image; "" for decorative images' },
    fallbackSrc: { control: 'text', description: 'Shown when src is missing or broken' },
    width: { control: 'number', description: 'Required unless fill is set' },
    height: { control: 'number', description: 'Required unless fill is set' },
    fill: { control: 'boolean', description: 'Fills the nearest positioned parent' },
    preload: { control: 'boolean', description: 'Preloads above-the-fold images' },
    loading: { control: { type: 'radio' }, options: ['lazy', 'eager'] },
  },
  args: {
    src: 'https://picsum.photos/id/1015/600/400',
    alt: 'River valley between mountains',
    width: 300,
    height: 200,
    onError: fn(),
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LocalAsset: Story = {
  args: {
    src: '/globe.svg',
    alt: 'Globe icon',
    width: 120,
    height: 120,
  },
};

export const BrokenUrl: Story = {
  args: {
    src: 'https://picsum.photos/this-image-does-not-exist.jpg',
    alt: 'Broken image falls back to the placeholder',
  },
};

export const MissingSrc: Story = {
  args: {
    src: '',
    alt: 'No image available',
  },
};

export const FillContainer: Story = {
  args: {
    fill: true,
    sizes: '400px',
    width: undefined,
    height: undefined,
    style: { objectFit: 'cover' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'relative',
          width: 400,
          aspectRatio: '16 / 9',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const Avatar: Story = {
  args: {
    src: 'https://i.pravatar.cc/80?img=12',
    alt: 'Customer avatar',
    width: 40,
    height: 40,
    style: { borderRadius: '50%' },
  },
};
