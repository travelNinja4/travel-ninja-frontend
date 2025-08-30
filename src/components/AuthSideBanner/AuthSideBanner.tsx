/**
 * AuthSideBanner is a reusable UI component that displays a full-height side banner with an optional background image, overlay, title, and description.
 *
 * @example
 * ```tsx
 * import AuthSideBanner from '@src/components/AuthSideBanner'
 *
 * export default function AuthSideBanner() {
 *   return <AuthSideBanner label="Hello" />;
 * }
 * ```
 */

import { STRINGS } from '@/constants/strings';
import CustomImage from '../CustomImage';
import Typography from '../Typography';
import styles from './AuthSideBanner.module.scss';

interface AuthSideBannerProps {
  appTagLine: string;
}

export default function AuthSideBanner({ appTagLine }: AuthSideBannerProps) {
  return (
    <div data-testid="AuthSideBannerTest" className={styles.container}>
      <CustomImage
        isUrl
        src="https://picsum.photos/1920/1080?random=1"
        priority
        alt="authImg"
        className={styles.imgContainer}
        unoptimized
        fill
      />
      <div className={styles.overlay}></div>
      <div className={styles.headerContainer}>
        <Typography tag="h1" className={styles.header} color="#ffffff" align="center">
          {STRINGS.APP_NAME}
        </Typography>
        <Typography tag="p" className={styles.subHeader} color="#ffffff" align="center">
          {appTagLine}
        </Typography>
      </div>
    </div>
  );
}
