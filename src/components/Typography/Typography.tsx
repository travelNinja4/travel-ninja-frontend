/**
 * custom typography component that standardizes text styles across the application.
 *
 * @example
 * ```tsx
 * import Typography from '@src/components/Typography'
 *
 * export default function Typography() {
 *   return <Typography
 *            label="Hello"
 *            tag="span"
 *          />;
 * }
 * ```
 */

import React, { JSX, ReactNode, ElementType } from 'react';
import clsx from 'clsx';
import styles from './Typography.module.scss';

/**
 * Define the props available for the Typography component.
 */
export type TypographyProps<T extends Tags = Tags> = {
  /**
   * The semantic HTML tag to render (e.g., heading, paragraph, span).
   * @example 'h1'
   */
  tag: T;

  /**
   * Override the underlying rendered element.
   * Useful when you want the styling of one tag but render another element.
   * @example 'div'
   */
  as?: ElementType;

  /**
   * The content to be displayed inside the Typography component.
   */
  children?: ReactNode;

  /**
   * Additional custom class names for styling.
   */
  className?: string;

  /**
   * Text alignment for the content.
   * @default 'left'
   */
  align?: TextAlign;

  /**
   * Text transformation style.
   * @default 'none'
   */
  transform?: TextTransform;

  /**
   * Controls text truncation and line clamping behavior.
   * @example 'ellipsis'
   * @example 'lineClamp-2'
   */
  truncation?: Truncation;
} & React.ComponentPropsWithoutRef<(typeof TagsMapping)[T]>;

type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none';

type Truncation = 'ellipsis' | 'noWrap' | `lineClamp-${number}`;

type TextAlign = 'left' | 'right' | 'center' | 'justify' | 'start' | 'end' | 'match-parent';

export type Tags = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'h6' | 'span' | 'label';

const TagsMapping: Record<Tags, keyof JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h6: 'h6',
  p: 'p',
  span: 'span',
  label: 'label',
};

export default function Typography<T extends Tags>({
  tag,
  as,
  children,
  className,
  align = 'left',
  transform = 'none',
  truncation,
  ...rest
}: TypographyProps<T>) {
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
      {...rest}
    >
      {children}
    </Component>
  );
}
