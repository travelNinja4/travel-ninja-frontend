import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Trash2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const meta = {
  title: 'components/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: { type: 'inline-radio' },
      options: ['danger', 'warning', 'success', 'info'],
    },
    open: { control: 'boolean' },
    loading: { control: 'boolean' },
    showCancel: { control: 'boolean' },
  },
  args: {
    open: true,
    tone: 'info',
    title: 'Publish this tour?',
    description: 'Guests will be able to find and book it straight away.',
    confirmLabel: 'Publish',
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Delete: Story = {
  args: {
    tone: 'danger',
    icon: Trash2,
    title: 'Delete this tour?',
    description:
      'Coorg Weekend Escape will be removed with its itinerary and photos. This can’t be undone.',
    confirmLabel: 'Delete tour',
  },
};

export const Deleting: Story = {
  args: { ...Delete.args, loading: true },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    title: 'Discard your changes?',
    description: 'The edits you made to this tour haven’t been saved.',
    confirmLabel: 'Discard',
    cancelLabel: 'Keep editing',
  },
};

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'Tour published',
    description: 'Guests can now find and book Coorg Weekend Escape.',
    confirmLabel: 'Done',
    showCancel: false,
  },
};
