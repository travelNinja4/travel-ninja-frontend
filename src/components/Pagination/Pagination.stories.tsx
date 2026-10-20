import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Pagination from './Pagination';

const meta = {
  title: 'components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    pageCount: { control: { type: 'number', min: 1 } },
  },
  args: {
    page: 1,
    pageCount: 1,
    getHref: (page: number) => `?page=${page}`,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SinglePage: Story = {};

export const FewPages: Story = {
  args: { page: 2, pageCount: 4 },
};

export const ManyPages: Story = {
  args: { page: 10, pageCount: 20 },
};
