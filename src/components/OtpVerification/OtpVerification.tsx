/**
 * A reusable component for verifying users via a one-time password (OTP) sent to their email or mobile number, with support for code input, verification, and resending OTP.
 *
 * @example
 * ```tsx
 * import OtpVerification from '@src/components/OtpVerification'
 *
 * export default function OtpVerification() {
 *   return <OtpVerification label="Hello" />;
 * }
 * ```
 */
'use client';

import { STRINGS } from '@/constants/strings';
import AuthSideBanner from '../AuthSideBanner';
import Button from '../Button';
import TextField from '../TextField';
import Typography from '../Typography';
import CustomImage from '../CustomImage';
import { Mail, Phone, Check, RotateCw } from 'lucide-react';
import styles from './OtpVerification.module.scss';
import { useEffect, useState } from 'react';

export default function OtpVerification() {
  const [type, setType] = useState<'email' | 'mobile'>('email');
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer === 0) return;

    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResend = () => {
    setTimer(60);
  };

  const handleOnChange = (val: string) => {
    setValue(val);
  };

  const handleCodeVerify = () => {
    if (!value) {
      return false;
    }
    if (type === STRINGS.EMAIL) {
      setType('mobile');
      setValue('');
      setTimer(0);
    }
  };

  return (
    <div data-testid="OtpVerificationTest" className={styles.container}>
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
          <div className={styles.otpContainer}>
            <Typography tag="h2" align="center" className={styles.otpHeader}>
              {type === STRINGS.EMAIL
                ? STRINGS.EMAIL_VERIFICATION
                : STRINGS.MOBILE_NUMBER_VERIFICATION}
            </Typography>
            <Typography tag="p" align="center" className={styles.otpSubHeader}>
              {type === STRINGS.EMAIL ? STRINGS.EMAIL_SENT : STRINGS.MOBILE_SENT}
            </Typography>
            <div className={styles.userData}>
              {type === STRINGS.EMAIL ? (
                <Mail color="var(--color-black)" />
              ) : (
                <Phone color="var(--color-black)" />
              )}
              <Typography
                tag="span"
                align="center"
                color="var(--color-indigo)"
                className={styles.userEmail}
              >
                {type === STRINGS.EMAIL ? 'user@gmail.com' : '4658265937'}
              </Typography>
            </div>
            <div className={styles.verificationWrapper}>
              <TextField
                label={STRINGS.ENTER_VERIFICATION_CODE}
                placeholder="000000"
                value={value}
                maxLength={6}
                className={styles.verificationTextField}
                onChange={(e) => handleOnChange(e.target.value)}
              />
              <Typography tag="label" align="center" className={styles.otpSubHeader}>
                {type === STRINGS.EMAIL ? STRINGS.EMAIL_CODE_HINT : STRINGS.MOBILE_CODE_HINT}
              </Typography>
            </div>
            <Button className={styles.button} startIcon={Check} onClick={handleCodeVerify}>
              {type === STRINGS.EMAIL ? STRINGS.VERIFY_EMAIL : STRINGS.VERIFY_MOBILE_NUMBER}
            </Button>
            <div className={styles.resendWrapper}>
              {timer > 0 ? (
                <Typography tag="span">{`${STRINGS.RESEND_CODE} ${timer} ${STRINGS.SECONDS}`}</Typography>
              ) : (
                <>
                  <RotateCw color="var(--color-indigo)" />
                  <Typography tag="span" className={styles.resendText} onClick={handleResend}>
                    Resend Code
                  </Typography>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
