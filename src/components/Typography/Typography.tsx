/**
 * Renders text using the app's type scale. `variant` sets the font size, weight,
 * line-height and letter-spacing; `tag` picks the semantic element (defaults from
 * the variant).
 *
 * @example
 * ```tsx
 * import Typography from '@/components/Typography'
 *
 * export default function PageHeader() {
 *   return (
 *     <>
 *       <Typography variant="heading-1">Bookings</Typography>
 *       <Typography variant="body-sm">12 upcoming trips</Typography>
 *       <Typography variant="display-lg" tag="h2">₹4.2L</Typography>
 *     </>
 *   );
 * }
 * ```
 */

import { ComponentPropsWithRef, ComponentType, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Typography.module.scss';

/**
 * Every variant of the type scale, largest to smallest.
 * Each one needs a `.<name>` class in Typography.module.scss.
 */
export const TYPOGRAPHY_VARIANTS = [
  'display-2xl',
  'display-xl',
  'display-lg',
  'heading-1',
  'stat-lg',
  'heading-2',
  'stat-sm',
  'heading-3',
  'heading-4',
  'title-md',
  'body-lg',
  'title-sm',
  'body',
  'body-sm',
  'label',
  'body-sm-strong',
  'caption',
  'caption-medium',
  'caption-strong',
  'overline',
  'micro',
  'micro-medium',
  'micro-overline',
  'tiny',
  'tiny-overline',
] as const;

export type TypographyVariant = (typeof TYPOGRAPHY_VARIANTS)[number];

/** Elements Typography may render. */
export type TextTag =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'li'
  | 'strong'
  | 'em'
  | 'small'
  | 'a'
  | 'time'
  | 'legend'
  | 'figcaption'
  | 'dt'
  | 'dd'
  | 'blockquote';

export type Truncation = 'ellipsis' | 'noWrap' | `lineClamp-${1 | 2 | 3 | 4 | 5}`;

/** Element rendered when no `tag` is passed. Anything not listed renders a span. */
const DEFAULT_TAG = {
  'heading-1': 'h1',
  'heading-2': 'h2',
  'heading-3': 'h3',
  'heading-4': 'h4',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
} as const satisfies Partial<Record<TypographyVariant, TextTag>>;

type DefaultTag<V extends TypographyVariant> = V extends keyof typeof DEFAULT_TAG
  ? (typeof DEFAULT_TAG)[V]
  : 'span';

type OwnProps<V extends TypographyVariant, T extends TextTag> = {
  /**
   * The text style from the type scale.
   * @default 'body'
   */
  variant?: V;

  /**
   * The HTML element to render. Only changes semantics, never the style.
   * Defaults to h1–h4 for heading variants, p for body variants, otherwise span.
   */
  tag?: T;

  /**
   * Truncates text to one line with an ellipsis, prevents wrapping,
   * or clamps it to 1–5 lines.
   */
  truncation?: Truncation;

  className?: string;
  children?: ReactNode;
};

/**
 * Props for Typography. Native attributes (including `ref` and `data-testid`)
 * are typed for the element that is actually rendered.
 */
export type TypographyProps<
  V extends TypographyVariant = 'body',
  T extends TextTag = DefaultTag<V>,
> = OwnProps<V, T> & Omit<ComponentPropsWithRef<T>, keyof OwnProps<V, T>>;

export default function Typography<
  V extends TypographyVariant = 'body',
  T extends TextTag = DefaultTag<V>,
>({ variant, tag, truncation, className, children, ...rest }: TypographyProps<V, T>) {
  const resolvedVariant: TypographyVariant = variant ?? 'body';
  const defaultTags: Partial<Record<TypographyVariant, TextTag>> = DEFAULT_TAG;
  // Props are already checked against `T` above; TS can't narrow a dynamic tag here.
  const Component = (tag ?? defaultTags[resolvedVariant] ?? 'span') as unknown as ComponentType<
    Record<string, unknown>
  >;

  return (
    <Component
      className={clsx(
        styles.typography,
        styles[resolvedVariant],
        truncation && styles[truncation],
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}

/** Props for a named text component: everything except `variant`, which it fixes. */
export type TextProps<V extends TypographyVariant, T extends TextTag = DefaultTag<V>> = Omit<
  TypographyProps<V, T>,
  'variant'
>;

function createText<V extends TypographyVariant>(variant: V, displayName: string) {
  function Text<T extends TextTag = DefaultTag<V>>(props: TextProps<V, T>) {
    return <Typography {...(props as TypographyProps<V, T>)} variant={variant} />;
  }
  Text.displayName = displayName;
  return Text;
}

/*
  Named components, one per variant. Use these in the app:
  import { Heading1, BodySm } from '@/components/Typography';
*/
export const Display2xl = createText('display-2xl', 'Display2xl');
export const DisplayXl = createText('display-xl', 'DisplayXl');
export const DisplayLg = createText('display-lg', 'DisplayLg');
export const Heading1 = createText('heading-1', 'Heading1');
export const Heading2 = createText('heading-2', 'Heading2');
export const Heading3 = createText('heading-3', 'Heading3');
export const Heading4 = createText('heading-4', 'Heading4');
export const StatLg = createText('stat-lg', 'StatLg');
export const StatSm = createText('stat-sm', 'StatSm');
export const TitleMd = createText('title-md', 'TitleMd');
export const TitleSm = createText('title-sm', 'TitleSm');
export const BodyLg = createText('body-lg', 'BodyLg');
export const Body = createText('body', 'Body');
export const BodySm = createText('body-sm', 'BodySm');
export const BodySmStrong = createText('body-sm-strong', 'BodySmStrong');
export const Label = createText('label', 'Label');
export const Caption = createText('caption', 'Caption');
export const CaptionMedium = createText('caption-medium', 'CaptionMedium');
export const CaptionStrong = createText('caption-strong', 'CaptionStrong');
export const Overline = createText('overline', 'Overline');
export const Micro = createText('micro', 'Micro');
export const MicroMedium = createText('micro-medium', 'MicroMedium');
export const MicroOverline = createText('micro-overline', 'MicroOverline');
export const Tiny = createText('tiny', 'Tiny');
export const TinyOverline = createText('tiny-overline', 'TinyOverline');
