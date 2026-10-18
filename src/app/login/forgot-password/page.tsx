import Image from '@/components/Image';
import ForgotPasswordForm from '../ForgotPasswordForm/ForgotPasswordForm';
import AuthSideBanner from '@/components/AuthSideBanner';
import { STRINGS } from '@/constants/strings';
import styles from './page.module.scss';

export default function ForgotPasswordPage() {
  return (
    <div className={styles.container}>
      <Image
        src={process.env.NEXT_PUBLIC_PLACEHOLDER_BG_URL as string}
        fill
        preload
        alt="BackgroundImg"
        className={styles.bgImg}
        unoptimized
      />
      <div className={styles.overlay}></div>

      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <AuthSideBanner
              header={STRINGS.RESET_PASSWORD_BANNER_HEADER}
              subText={STRINGS.RESET_PASSWORD_BANNER_SUB_TEXT}
            />
          </div>

          <div className={styles.formContainer}>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
