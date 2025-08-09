/**
 * custom typography component that standardizes text styles across the application.
 *
 * @example
 * ```tsx
 * import Typography from '@src/components/Typography'
 *
 * export default function Typography() {
 *   return <Typography label="Hello" />;
 * }
 * ```
 */

import React, { JSX, ReactNode, ElementType } from 'react';
import clsx from 'clsx';
import styles from './Typography.module.scss';

/**
 * Define the props available for the Typography component.
 */
export interface TypographyProps {
  tag: Tags;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  align?: TextAlign;
  transform?: TextTransform;
  truncation?: Truncation;
}

type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none';

type Truncation = 'ellipsis' | 'noWrap' | `lineClamp-${number}`;

type TextAlign = 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | 'match-parent';

type Tags = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'h6' | 'span';

const TagsMapping: Record<Tags, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h6: 'h6',
  p: 'p',
  span: 'span',
};

export default function Typography({
  tag,
  as,
  children,
  className,
  align = 'left',
  transform = 'none',
  truncation,
}: TypographyProps) {
  const Component = as || TagsMapping[tag] || 'p';
  return (
    <Component
      data-testid="TypographyTest"
      className={clsx(
        styles.typography,
        styles[tag],
        styles[`align-${align}`],
        transform !== 'none' && styles[`transform-${transform}`],
        truncation && styles[truncation],
        className,
      )}
    >
      {children}
    </Component>
  );
}
