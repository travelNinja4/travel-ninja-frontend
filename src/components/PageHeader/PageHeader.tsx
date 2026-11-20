/**
 * The header at the top of every screen: the page title and a short
 * description on the left, the screen's actions (buttons, links) on the right.
 *
 * It only lays things out; the parent passes whatever actions it needs and
 * styles them. Rendered inline, so a `type="submit"` button in `actions`
 * still submits the form the header sits in.
 *
 *   phone    actions wrap below the title and share the row
 *   tablet+  actions on the right, sized to their content
 *
 * @example
 * ```tsx
 * import PageHeader from '@/components/PageHeader'
 *
 * export default function AgencyProfile() {
 *   return (
 *     <PageHeader
 *       title="Agency profile"
 *       description="Public identity guests see when browsing your tours."
 *       actions={<Button type="submit">Save changes</Button>}
 *     />
 *   );
 * }
 * ```
 */

import { ReactNode } from 'react';
import clsx from 'clsx';
import Typography from '../Typography';
import styles from './PageHeader.module.scss';

/**
 * Define the props available for the PageHeader component.
 */
export interface PageHeaderProps {
  /**
   * The page title, rendered as the page's only `<h1>`.
   */
  title: ReactNode;

  /**
   * One line under the title saying what the screen is for.
   */
  description?: ReactNode;

  /**
   * Buttons or links shown on the right, e.g. Save or New tour.
   */
  actions?: ReactNode;

  className?: string;
}

export default function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header data-testid="PageHeaderTest" className={clsx(styles.header, className)}>
      <div className={styles.heading}>
        <Typography variant="heading-1" tag="h1" className={styles.title}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body-sm" className={styles.description}>
            {description}
          </Typography>
        )}
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
