import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
/**
import { fn } from 'storybook/test';
*/
import Link from 'next/link';
import CheckBox from './CheckBox';

const meta = {
  title: 'components/CheckBox',
  component: CheckBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text or ReactNode for the checkbox',
    },
    tag: {
      control: 'select',
      options: ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h6'],
      description: 'HTML tag used for the label text',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in indeterminate state',
    },
    onChange: { action: 'changed' },
  },
  args: {
    label: 'Sample label',
    tag: 'span',
    checked: false,
    disabled: false,
    indeterminate: false,
  },
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default interactive story
export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckBox {...args} checked={checked} onChange={(newChecked) => setChecked(newChecked)} />
    );
  },
};

// With links interactive story
export const WithLinks: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <CheckBox
        {...args}
        label={
          <>
            I agree to the <Link href="/terms">Terms of Service</Link> and{' '}
            <Link href="/privacy">Privacy Policy</Link>
          </>
        }
        checked={checked}
        onChange={(newChecked) => setChecked(newChecked)}
      />
    );
  },
};

// Disabled story stays static
export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
    checked: false,
  },
};

// Indeterminate interactive story
export const Indeterminate: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckBox
        {...args}
        label="Partially selected"
        indeterminate={!checked && true}
        checked={checked}
        onChange={(newChecked) => setChecked(newChecked)}
      />
    );
  },
};
