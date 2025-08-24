'use client';

import CustomImage from '@/components/CustomImage';
import CreateAccountForm from './CreateAccountForm/CreateAccountForm';
import styles from './page.module.scss';
import AuthSideBanner from '@/components/AuthSideBanner';

export default function CreateAccount() {
  return (
    <div className={styles.container}>
      <CustomImage
        isUrl
        src="https://picsum.photos/1920/1080?random=1"
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
            <AuthSideBanner />
          </div>
          <div className={styles.formContainer}>
            <CreateAccountForm />
          </div>
        </div>
      </div>
    </div>
  );
}
