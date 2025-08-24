import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React, { useState } from 'react';
import TextField from '../TextField';
/**
import { fn } from 'storybook/test';
*/
import PasswordFeedback from './PasswordFeedback';

const meta = {
  title: 'components/PasswordFeedback',
  component: PasswordFeedback,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Current password value for validation',
    },
    hints: {
      control: 'object',
      description: 'Array of password validation hints',
    },
  },
  args: {
    /** onClick: fn() **/
  },
} satisfies Meta<typeof PasswordFeedback>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleHints = [
  { label: 'At least 8 characters', regex: /.{8,}/ },
  { label: 'Contains a number', regex: /\d/ },
  { label: 'Contains a capital letter', regex: /[A-Z]/ },
  { label: 'Contains a special character', regex: /[!@#$%^&*]/ },
];

export const Interactive: Story = {
  render: (args) => {
    const [password, setPassword] = useState('');

    return (
      <div style={{ width: 300 }}>
        <TextField
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <PasswordFeedback value={password} hints={args.hints || []} />
      </div>
    );
  },
  args: {
    value: '',
    hints: exampleHints,
  },
};
