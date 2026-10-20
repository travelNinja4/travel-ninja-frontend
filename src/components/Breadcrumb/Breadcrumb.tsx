/**
 * A breadcrumb trail: every crumb but the last links back up, and the last one
 * is the current page.
 *
 * Fits any width without wrapping: long labels end in an ellipsis, and on
 * phones the crumbs between the first and the last fold into "…". Both are
 * CSS, so this renders the same on the server and the client.
 *
 * @example
 * ```tsx
 * import Breadcrumb from '@/components/Breadcrumb'
 *
 * export default function Header() {
 *   return (
 *     <Breadcrumb
 *       items={[
 *         { label: 'Dashboard', href: '/dashboard' },
 *         { label: 'Tours', href: '/tours' },
 *         { label: 'New' },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */

import { Fragment } from 'react';
import clsx from 'clsx';
import AppLink from '../AppLink';
import { APP_HEADER } from '@/constants/strings';
import type { BreadcrumbItem } from '@/utils/breadcrumbs';
import styles from './Breadcrumb.module.scss';

/**
 * Define the props available for the Breadcrumb component.
 */
interface BreadcrumbProps {
  /**
   * The trail from the top level down to the current page.
   * Crumbs without an `href` render as plain text.
   */
  items: BreadcrumbItem[];

  /**
   * Accessible name of the navigation landmark.
   * @default 'Breadcrumb'
   */
  ariaLabel?: string;

  className?: string;
}

const Separator = () => (
  <span className={styles.separator} aria-hidden="true">
    /
  </span>
);

export default function Breadcrumb({
  items,
  ariaLabel = APP_HEADER.BREADCRUMB,
  className,
}: BreadcrumbProps) {
  const lastIndex = items.length - 1;

  return (
    <nav
      data-testid="BreadcrumbTest"
      aria-label={ariaLabel}
      className={clsx(styles.nav, className)}
    >
      <ol className={styles.list}>
        {items.map(({ label, href }, index) => {
          const isCurrent = index === lastIndex;
          const isMiddle = index > 0 && !isCurrent;

          return (
            <Fragment key={href ?? `${index}-${label}`}>
              {/* Phones only: stands in for the hidden middle crumbs */}
              {isCurrent && lastIndex > 1 && (
                <li className={styles.ellipsis} aria-hidden="true">
                  <Separator />
                  <span className={clsx(styles.crumb, styles.text)}>…</span>
                </li>
              )}

              <li className={clsx(styles.item, isMiddle && styles.middle)}>
                {index > 0 && <Separator />}
                {href && !isCurrent ? (
                  <AppLink href={href} className={clsx(styles.crumb, styles.link)} title={label}>
                    {label}
                  </AppLink>
                ) : (
                  <span
                    className={clsx(styles.crumb, isCurrent ? styles.current : styles.text)}
                    aria-current={isCurrent ? 'page' : undefined}
                    title={label}
                  >
                    {label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
