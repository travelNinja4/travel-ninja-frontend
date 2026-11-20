import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from '../Button';
import PageHeader from './PageHeader';

const meta = {
  title: 'components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    // A React node can't be edited from the controls panel
    actions: { control: false },
  },
  args: {
    title: 'Agency profile',
    description: 'Public identity guests see when browsing your tours.',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithAction: Story = {
  args: { actions: <Button>Save changes</Button> },
};

export const WithTwoActions: Story = {
  args: {
    title: 'Create tour',
    description: 'Build a departure guests can discover and book.',
    actions: (
      <>
        <Button variant="secondary">Save draft</Button>
        <Button>Publish</Button>
      </>
    ),
  },
};

export const TitleOnly: Story = {
  args: { description: undefined },
};
