import type { Metadata } from 'next';
import { MapIcon } from 'lucide-react';
import AuthSideBanner from '@/components/AuthSideBanner';
import { Caption, TitleMd } from '@/components/Typography';
import { STRINGS } from '@/constants/strings';
import LoginForm from './LoginForm/LoginForm';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: `Sign in | ${STRINGS.APP_NAME}`,
};

/**
 * Split-screen login: brand + form on the left, green brand panel on the right.
 * Server component; only LoginForm ships client JavaScript.
 */
export default function LoginPage() {
  return (
    <main className={styles.page}>
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
                {STRINGS.AGENCY_DASHBOARD}
              </Caption>
            </div>
          </div>

          <LoginForm />
        </div>
      </section>

      <AuthSideBanner
        className={styles.banner}
        header={STRINGS.LOGIN_BANNER_HEADER}
        subText={STRINGS.LOGIN_BANNER_SUB_TEXT}
      />
    </main>
  );
}
