/**
 * Brand panel shown beside the auth forms (sign in, create account, password
 * reset, OTP). A green surface with a faint grid, and a header + sub text
 * pinned to the bottom-left. Each screen passes its own copy.
 *
 * Pure CSS and text: no images, no client JavaScript, so it renders on the
 * server and costs nothing to load.
 *
 * @example
 * ```tsx
 * import AuthSideBanner from '@/components/AuthSideBanner'
 *
 * export default function LoginPage() {
 *   return (
 *     <AuthSideBanner
 *       header="Run tours with clarity"
 *       subText="TravelNinja helps Indian tour operators publish departures, fill seats, and track net earnings after platform commission."
 *     />
 *   );
 * }
 * ```
 */
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import clsx from 'clsx';
import { BodyLg, DisplayLg } from '../Typography';
import styles from './AuthSideBanner.module.scss';

/**
 * Define the props available for the AuthSideBanner component.
 * Other native `<aside>` attributes are passed through.
 */
export interface AuthSideBannerProps extends Omit<ComponentPropsWithoutRef<'aside'>, 'children'> {
  /**
   * Main line of the panel, e.g. "Run tours with clarity".
   */
  header: ReactNode;

  /**
   * Supporting sentence shown under the header.
   */
  subText?: ReactNode;
}

export default function AuthSideBanner({
  header,
  subText,
  className,
  ...rest
}: AuthSideBannerProps) {
  return (
    <aside data-testid="AuthSideBannerTest" className={clsx(styles.banner, className)} {...rest}>
      <div className={styles.content}>
        {/* h2: the form beside it owns the page's h1 */}
        <DisplayLg tag="h2" className={styles.header}>
          {header}
        </DisplayLg>
        {subText && (
          <BodyLg tag="p" className={styles.subText}>
            {subText}
          </BodyLg>
        )}
      </div>
    </aside>
  );
}
