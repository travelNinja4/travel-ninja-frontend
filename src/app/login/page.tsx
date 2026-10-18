import Image from '@/components/Image';
import LoginForm from './LoginForm/LoginForm';
import styles from './page.module.scss';
import AuthSideBanner from '@/components/AuthSideBanner';
import { STRINGS } from '@/constants/strings';

export default function LoginPage() {
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

      <div className={styles.subContainer}>
        <div className={styles.mainContainer}>
          <div className={styles.imageContainer}>
            <AuthSideBanner
              header={STRINGS.LOGIN_BANNER_HEADER}
              subText={STRINGS.LOGIN_BANNER_SUB_TEXT}
            />
          </div>
          <div className={styles.formContainer}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
