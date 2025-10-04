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

import { useEffect, useState } from 'react';
import { ROUTES, STRINGS } from '@/constants/strings';
import AuthSideBanner from '../AuthSideBanner';
import Button from '../Button';
import TextField from '../TextField';
import Typography from '../Typography';
import CustomImage from '../CustomImage';
import { Mail, Phone, Check, RotateCw } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useNotification } from '@/providers/NotificationProvider';
import { errorHandler } from '@/utils/errorHandler';
import styles from './OtpVerification.module.scss';

export default function OtpVerification() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const accountData = useAuthStore((store) => store.accountData);
  const [type, setType] = useState<'email' | 'mobile'>('email');
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(0);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const rawCountry = accountData?.phoneNumber?.country ?? '';
  const countryCode = rawCountry.split('(')[0].trim();

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

  const handleResend = async () => {
    try {
      const requestParams =
        type === STRINGS.EMAIL
          ? { email: accountData?.email }
          : { phoneNumber: `${countryCode}-${accountData?.phoneNumber?.number}` };
      const response = await authService.sendOtp(requestParams);
      setTimer(60);
    } catch (err: unknown) {
      const messages = errorHandler(err);
      messages.forEach((errMsg) => {
        showNotification('Error!', errMsg, 'error');
      });
    }
  };

  const handleOnChange = (val: string) => {
    setValue(val);
  };

  const handleCodeVerify = async () => {
    if (!value) {
      return false;
    }

    try {
      const requestParams =
        type === STRINGS.EMAIL
          ? { email: accountData?.email, otpCode: value }
          : { phoneNumber: `${countryCode}-${accountData?.phoneNumber?.number}`, otpCode: value };
      console.log('requestParams>>>', requestParams);
      setVerifyLoading(true);
      const response = await authService.verifyOtp(requestParams);
      if (type === STRINGS.EMAIL) {
        setType('mobile');
        setValue('');
        setTimer(0);
      } else {
        showNotification('Success!', 'Account created successfully', 'success');
        router.push(ROUTES.LOGIN);
      }
    } catch (err: unknown) {
      const messages = errorHandler(err);
      messages.forEach((errMsg) => {
        showNotification('Error!', errMsg, 'error');
      });
    } finally {
      setVerifyLoading(false);
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
                {type === STRINGS.EMAIL
                  ? accountData?.email
                  : `${countryCode}-${accountData?.phoneNumber?.number}`}
              </Typography>
            </div>
            <div className={styles.verificationWrapper}>
              <TextField
                label={STRINGS.ENTER_VERIFICATION_CODE}
                placeholder="000000"
                value={value}
                maxLength={6}
                inputClassName={styles.verificationTextField}
                onChange={(e) => handleOnChange(e.target.value)}
              />
              <Typography tag="label" align="center" className={styles.otpSubHeader}>
                {type === STRINGS.EMAIL ? STRINGS.EMAIL_CODE_HINT : STRINGS.MOBILE_CODE_HINT}
              </Typography>
            </div>
            <Button
              className={styles.button}
              startIcon={Check}
              onClick={handleCodeVerify}
              disabled={verifyLoading}
              loading={verifyLoading}
            >
              {type === STRINGS.EMAIL ? STRINGS.VERIFY_EMAIL : STRINGS.VERIFY_MOBILE_NUMBER}
            </Button>
            <div className={styles.resendWrapper}>
              {timer > 0 ? (
                <Typography tag="span">{`${STRINGS.RESEND_CODE_IN} ${timer} ${STRINGS.SECONDS}`}</Typography>
              ) : (
                <div onClick={handleResend} className={styles.resendTextContainer}>
                  <RotateCw color="var(--color-indigo)" />
                  <Typography tag="span" className={styles.resendText}>
                    {STRINGS.RESEND_CODE}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
