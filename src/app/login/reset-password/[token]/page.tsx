import CustomImage from '@/components/CustomImage';
import AuthSideBanner from '@/components/AuthSideBanner';
import { STRINGS } from '@/constants/strings';
import { authService } from '@/services/authService';
import ResetPasswordForm from '../../ResetPasswordForm/ResetPasswordForm';
import styles from './page.module.scss';

export default async function ForgotPassword({ params: { token } }: { params: { token: string } }) {
  try {
    await authService.validateResetPassword(token);
  } catch (err: unknown) {
    throw new Error('INVALID_OR_EXPIRED_TOKEN');
  }

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

      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <AuthSideBanner appTagLine={STRINGS.RESET_PASSWORD_TAG_LINE} />
          </div>

          <div className={styles.formContainer}>
            <ResetPasswordForm token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}
