import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { withAppRouter } from '../../../.storybook/decorators/withAppRouter';
import BaseLayout from '../BaseLayout';
import Sidebar from './Sidebar';

const meta = {
  title: 'components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withAppRouter],
  // Rendered by the real layout so the rail, drawer and scrolling behave as in the app
  render: () => (
    <BaseLayout>
      <p>Page content</p>
    </BaseLayout>
  ),
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
};

export const Tablet: Story = {
  globals: { viewport: { value: 'tablet' } },
};

export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
};
