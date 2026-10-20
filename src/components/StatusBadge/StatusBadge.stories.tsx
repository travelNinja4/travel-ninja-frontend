import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StatusBadge, { STATUS_TONES } from './StatusBadge';

const meta = {
  title: 'components/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: STATUS_TONES },
    children: { control: 'text', description: 'The visible label' },
  },
  args: {
    status: 'published',
    children: 'Published',
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Published: Story = {};

export const Draft: Story = {
  args: { status: 'draft', children: 'Draft' },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 480 }}>
      {STATUS_TONES.map((status) => (
        <StatusBadge key={status} status={status}>
          {status}
        </StatusBadge>
      ))}
    </div>
  ),
};
