import Image from '@/components/Image';
import CreateAccountForm from './CreateAccountForm/CreateAccountForm';
import styles from './page.module.scss';
import AuthSideBanner from '@/components/AuthSideBanner';
import { STRINGS } from '@/constants/strings';
import { commonService } from '@/server/commonService';

export default async function CreateAccountPage() {
  const countries = await commonService.getCountries();

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
              header={STRINGS.CREATE_ACCOUNT_BANNER_HEADER}
              subText={STRINGS.CREATE_ACCOUNT_BANNER_SUB_TEXT}
            />
          </div>
          <div className={styles.formContainer}>
            <CreateAccountForm countries={countries} />
          </div>
        </div>
      </div>
    </div>
  );
}
