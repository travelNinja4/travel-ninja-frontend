import type { Meta, StoryObj } from '@storybook/nextjs-vite';
/**
import { fn } from 'storybook/test';
*/
import ClientNetworkWrapper from './ClientNetworkWrapper';

const meta: Meta<typeof ClientNetworkWrapper> = {
  title: 'components/ClientNetworkWrapper',
  component: ClientNetworkWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    /** onClick: fn() **/
  },
} satisfies Meta<typeof ClientNetworkWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: '2rem', backgroundColor: '#e5e7eb', borderRadius: '8px' }}>
        <h2>App Content Goes Here</h2>
        <p>This is a placeholder child inside the ClientNetworkWrapper.</p>
      </div>
    ),
  },
  render: (args) => <ClientNetworkWrapper {...args} />,
};
