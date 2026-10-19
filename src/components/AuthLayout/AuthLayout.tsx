/**
 * Split-screen shell shared by the auth screens (sign in, OTP verification):
 * brand + content on the left, green brand panel on the right.
 *
 * A server component; only the content passed as children ships client JavaScript.
 *
 * @example
 * ```tsx
 * import AuthLayout from '@/components/AuthLayout'
 *
 * export default function LoginPage() {
 *   return (
 *     <AuthLayout
 *       subtitle="Agency Dashboard"
 *       bannerHeader="Run tours with clarity"
 *       bannerSubText="TravelNinja helps Indian tour operators publish departures."
 *     >
 *       <LoginForm />
 *     </AuthLayout>
 *   );
 * }
 * ```
 */
import type { ReactNode } from 'react';
import { MapIcon } from 'lucide-react';
import AuthSideBanner from '../AuthSideBanner';
import { Caption, TitleMd } from '../Typography';
import { STRINGS } from '@/constants/strings';
import styles from './AuthLayout.module.scss';

/**
 * Define the props available for the AuthLayout component.
 */
export interface AuthLayoutProps {
  /**
   * Line under the app name in the brand block, e.g. "Agency Dashboard" or "Verification".
   */
  subtitle: string;

  /**
   * Main line of the brand panel.
   */
  bannerHeader: ReactNode;

  /**
   * Supporting sentence under the brand panel header.
   */
  bannerSubText?: ReactNode;

  /**
   * The screen's own content (heading + form). It owns the page's h1.
   */
  children: ReactNode;
}

export default function AuthLayout({
  subtitle,
  bannerHeader,
  bannerSubText,
  children,
}: AuthLayoutProps) {
  return (
    <main data-testid="AuthLayoutTest" className={styles.page}>
      <section className={styles.formSide}>
        <div className={styles.formColumn}>
          <div className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              <MapIcon size={20} strokeWidth={1.75} />
            </span>
            <div className={styles.brandText}>
              <TitleMd tag="p" className={styles.brandName}>
                {STRINGS.APP_NAME}
              </TitleMd>
              <Caption tag="p" className={styles.brandSubtitle}>
                {subtitle}
              </Caption>
            </div>
          </div>

          {children}
        </div>
      </section>

      <AuthSideBanner className={styles.banner} header={bannerHeader} subText={bannerSubText} />
    </main>
  );
}
