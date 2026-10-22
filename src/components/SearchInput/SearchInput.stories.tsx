import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import SearchInput from './SearchInput';

const meta = {
  title: 'components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    placeholder: { control: 'text' },
    label: { control: 'text', description: 'Optional text shown above the input' },
    debounceMs: { control: 'number', description: 'Pause before onSearch runs, in ms' },
    minChars: { control: 'number', description: 'Shortest term worth searching' },
    loading: { control: 'boolean', description: 'Shows a spinner in place of the clear button' },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: {
    onSearch: fn(),
    onChange: fn(),
    onClear: fn(),
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: 'Kyoto' },
};

export const Loading: Story = {
  args: { defaultValue: 'Kyoto', loading: true },
};

export const WithLabel: Story = {
  args: { label: 'Find a tour', helperText: 'Type at least 2 characters', minChars: 2 },
};

export const Disabled: Story = {
  args: { disabled: true },
};

const TOURS = ['Kyoto temples', 'Bali beaches', 'Swiss Alps trek', 'Paris food walk', 'Cairo'];

/**
 * Shows the debounced term and the matching tours as you type.
 */
export const LiveResults: Story = {
  render: function LiveResultsStory(args) {
    const [term, setTerm] = useState('');
    const results = TOURS.filter((tour) => tour.toLowerCase().includes(term.toLowerCase()));

    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <SearchInput
          {...args}
          onSearch={(next, signal) => {
            setTerm(next);
            args.onSearch?.(next, signal);
          }}
        />
        <small>Searched for: "{term}"</small>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {results.map((tour) => (
            <li key={tour}>{tour}</li>
          ))}
        </ul>
      </div>
    );
  },
};
