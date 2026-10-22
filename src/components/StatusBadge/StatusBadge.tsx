/**
 * A small pill with a dot that shows the status of a tour, booking or payment.
 * Colours come from the `--status-*` tokens in styleguide.scss, so it follows
 * the theme. An unknown status falls back to the neutral draft colours.
 *
 * @example
 * ```tsx
 * import StatusBadge from '@/components/StatusBadge'
 *
 * export default function TourHeader() {
 *   return <StatusBadge status="published">Published</StatusBadge>;
 * }
 * ```
 */

import { ReactNode } from 'react';
import clsx from 'clsx';
import Typography from '../Typography';
import styles from './StatusBadge.module.scss';

/**
 * Every status with colour tokens. Each one needs a `.<name>` class in StatusBadge.module.scss.
 */
export const STATUS_TONES = [
  'published',
  'draft',
  'archived',
  'confirmed',
  'pending',
  'cancelled',
  'completed',
  'paid',
  'refunded',
  'available',
  'soldout',
  'partial',
] as const;

export type StatusTone = (typeof STATUS_TONES)[number];

/**
 * Define the props available for the StatusBadge component.
 */
interface StatusBadgeProps {
  /**
   * Picks the colours.
   */
  status: StatusTone;

  /**
   * The visible label, e.g. "Published".
   */
  children: ReactNode;

  className?: string;
}

export default function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <Typography
      variant="caption-medium"
      tag="span"
      data-testid="StatusBadgeTest"
      className={clsx(styles.badge, styles[status], className)}
    >
      {children}
    </Typography>
  );
}
