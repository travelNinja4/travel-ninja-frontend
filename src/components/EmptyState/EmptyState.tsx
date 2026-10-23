/**
 * The message shown where a list, table or page has nothing to show yet: an
 * icon, a title, an optional description and an optional action, centred.
 *
 * It has no border or background, so it sits inside whatever panel holds the
 * content it replaces (a table, the tours grid...). Padding, the icon and the
 * text grow from tablet up.
 *
 * @example
 * ```tsx
 * import EmptyState from '@/components/EmptyState'
 *
 * export default function NoBookings() {
 *   return (
 *     <EmptyState
 *       icon={CalendarX}
 *       title="No bookings yet"
 *       description="Bookings will show up here once customers start booking your tours."
 *       action={<Button startIcon={Plus}>Create tour</Button>}
 *     />
 *   );
 * }
 * ```
 */

import type { ReactNode } from 'react';
import { Inbox, LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import Typography from '../Typography';
import styles from './EmptyState.module.scss';

/**
 * Define the props available for the EmptyState component.
 */
interface EmptyStateProps {
  /**
   * The heading, e.g. "No bookings yet".
   */
  title: string;

  /**
   * Text below the title, e.g. what to do next.
   */
  description?: ReactNode;

  /**
   * Icon above the title. `null` hides it.
   *
   * @default Inbox
   */
  icon?: LucideIcon | null;

  /**
   * Shown below the text, e.g. a Button to create the first record.
   */
  action?: ReactNode;

  /**
   * The element of the title. Only changes semantics, never the style: use a
   * heading when the empty state is the main content of the page.
   *
   * @default "p"
   */
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';

  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  titleTag = 'p',
  className,
}: EmptyStateProps) {
  return (
    <div data-testid="EmptyStateTest" className={clsx(styles.container, className)}>
      {Icon && (
        <span className={styles.icon} aria-hidden="true">
          <Icon />
        </span>
      )}
      <Typography variant="heading-4" tag={titleTag} className={styles.title}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body" className={styles.description}>
          {description}
        </Typography>
      )}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
