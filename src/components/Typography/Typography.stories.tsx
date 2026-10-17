import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ComponentType, ReactNode } from 'react';
import Typography, * as Text from './Typography';
import { TYPOGRAPHY_VARIANTS } from './Typography';

/** Named components in scale order, shown in the "Components" story. */
const NAMED_COMPONENTS: [string, ComponentType<{ children?: ReactNode }>][] = [
  ['Display2xl', Text.Display2xl],
  ['DisplayXl', Text.DisplayXl],
  ['DisplayLg', Text.DisplayLg],
  ['Heading1', Text.Heading1],
  ['StatLg', Text.StatLg],
  ['Heading2', Text.Heading2],
  ['StatSm', Text.StatSm],
  ['Heading3', Text.Heading3],
  ['Heading4', Text.Heading4],
  ['TitleMd', Text.TitleMd],
  ['BodyLg', Text.BodyLg],
  ['TitleSm', Text.TitleSm],
  ['Body', Text.Body],
  ['BodySm', Text.BodySm],
  ['Label', Text.Label],
  ['BodySmStrong', Text.BodySmStrong],
  ['Caption', Text.Caption],
  ['CaptionMedium', Text.CaptionMedium],
  ['CaptionStrong', Text.CaptionStrong],
  ['Overline', Text.Overline],
  ['Micro', Text.Micro],
  ['MicroMedium', Text.MicroMedium],
  ['MicroOverline', Text.MicroOverline],
  ['Tiny', Text.Tiny],
  ['TinyOverline', Text.TinyOverline],
];

const meta = {
  title: 'components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: TYPOGRAPHY_VARIANTS,
      description: 'Text style from the type scale (size, weight, line-height, letter-spacing)',
    },
    tag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'strong'],
      description: 'The HTML element. Defaults from the variant; never changes the style',
    },
    truncation: {
      control: 'select',
      options: [
        'ellipsis',
        'noWrap',
        'lineClamp-1',
        'lineClamp-2',
        'lineClamp-3',
        'lineClamp-4',
        'lineClamp-5',
      ],
      description: 'Truncates or clamps text display',
    },
    children: {
      control: 'text',
      description: 'The text content or elements inside Typography',
    },
  },
  args: {
    variant: 'body',
    children: 'The quick brown fox jumps over the lazy dog',
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Every variant in the type scale
export const Scale: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      {TYPOGRAPHY_VARIANTS.map((variant) => (
        <div
          key={variant}
          style={{
            display: 'grid',
            gridTemplateColumns: '10rem 1fr',
            alignItems: 'baseline',
            gap: 'var(--space-4)',
          }}
        >
          <Typography variant="caption">{variant}</Typography>
          <Typography {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};

// The named components the app imports, e.g. `import { Heading1 } from '@/components/Typography'`
export const Components: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      {NAMED_COMPONENTS.map(([name, Component]) => (
        <div
          key={name}
          style={{
            display: 'grid',
            gridTemplateColumns: '10rem 1fr',
            alignItems: 'baseline',
            gap: 'var(--space-4)',
          }}
        >
          <Typography variant="caption">{`<${name} />`}</Typography>
          <Component>{args.children}</Component>
        </div>
      ))}
    </div>
  ),
};

export const Truncations: Story = {
  render: (args) => (
    <div style={{ width: '250px', display: 'grid', gap: 'var(--space-2)' }}>
      <Typography {...args} variant="caption" truncation="ellipsis">
        A caption renders as a span and still truncates with an ellipsis.
      </Typography>
      <Typography {...args} truncation="lineClamp-2">
        This is a long paragraph that will be clamped to two lines in height, and anything beyond
        that will be hidden from view.
      </Typography>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'heading-2',
    tag: 'h2',
    children: 'Edit me in Storybook controls!',
  },
};
