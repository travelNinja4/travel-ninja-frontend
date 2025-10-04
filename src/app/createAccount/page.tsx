import CustomImage from '@/components/CustomImage';
import CreateAccountForm from './CreateAccountForm/CreateAccountForm';
import styles from './page.module.scss';
import AuthSideBanner from '@/components/AuthSideBanner';
import { STRINGS } from '@/constants/strings';

export default function CreateAccount() {
  return (
    <div className={styles.container}>
      <CustomImage
        isUrl
        src={process.env.NEXT_PUBLIC_PLACEHOLDER_BG_URL as string}
        fill
        priority
        alt="BackgroundImg"
        className={styles.bgImg}
        unoptimized
      />
      <div className={styles.overlay}></div>

      <div className={styles.subContainer}>
        <div className={styles.mainContainer}>
          <div className={styles.imageContainer}>
            <AuthSideBanner appTagLine={STRINGS.CREATE_ACCOUNT_APP_TAG_LINE} />
          </div>
          <div className={styles.formContainer}>
            <CreateAccountForm />
          </div>
        </div>
      </div>
    </div>
  );
}
