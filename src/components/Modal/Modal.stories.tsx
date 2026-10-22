import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import Modal from './Modal';

const meta = {
  title: 'components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
    },
    open: { control: 'boolean' },
    dismissible: { control: 'boolean' },
  },
  args: {
    open: true,
    size: 'md',
    onClose: fn(),
    'aria-labelledby': 'modal-story-title',
    children: (
      <>
        <h2 id="modal-story-title">Share tour</h2>
        <p>Anything can go inside the modal: a form, a preview, a confirmation.</p>
      </>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: 'sm' } };

export const Large: Story = { args: { size: 'lg' } };

// Taller than the screen: the panel scrolls inside the modal
export const LongContent: Story = {
  args: {
    children: (
      <>
        <h2 id="modal-story-title">Terms</h2>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i}>Paragraph {i + 1} of the booking terms.</p>
        ))}
      </>
    ),
  },
};
