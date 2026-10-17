/**
 * A reusable component for verifying users via a one-time password (OTP) sent to their email or mobile number, with support for code input, verification, and resending OTP.
 *
 * @example
 * ```tsx
 * import OtpVerification from '@src/components/OtpVerification'
 *
 * export default function Example() {
 *   const handleOtpSubmit = (params) => {
 *     console.log('OTP submitted:', params);
 *   };
 *
 *   return (
 *     <OtpVerification
 *       otpType="mobile"
 *       contact={{ phoneNumber: '+91-9876543210' }}
 *       onSubmit={handleOtpSubmit}
 *       loading={false}
 *     />
 *   );
 * }
 * ```
 */
'use client';

import { useEffect, useState } from 'react';
import Button from '../Button';
import InputField from '../InputField';
import Typography from '../Typography';
import CustomImage from '../CustomImage';
import { OtpProps, OtpType, PendingVerification } from '@/constants/types';
import { NOTIFICATION_TYPES, STRINGS } from '@/constants/strings';
import AuthSideBanner from '../AuthSideBanner';
import { sendOtpAction } from '@/actions/auth';
import { Mail, Phone, Check, RotateCw } from 'lucide-react';
import { useNotification } from '@/providers/NotificationProvider';
import styles from './OtpVerification.module.scss';

interface OtpVerificationProps {
  /**
   * Specifies the type of OTP verification to perform.
   * - `'email'` → Verifies the user's email address.
   * - `'mobile'` → Verifies the user's mobile number.
   *
   * @default 'email'
   */
  otpType?: OtpType;

  /**
   * The email / phone number the code was sent to, shown to the user.
   * Read on the server from the pending-verification cookie and passed down by the page.
   */
  contact?: PendingVerification;

  /**
   * Callback function triggered when the user submits the OTP for verification.
   *
   * @param params - The OTP data containing the entered code and OTP type.
   * @returns void
   */
  onSubmit?: (params: OtpProps) => void;

  /**
   * Indicates whether the verification process is currently loading.
   * When `true`, the verify button is disabled and a loading indicator may be shown.
   *
   * @default false
   */
  loading?: boolean;
}

export default function OtpVerification({
  otpType = 'email',
  contact,
  onSubmit,
  loading = false,
}: OtpVerificationProps) {
  const { showNotification } = useNotification();
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(0);

  const formattedContactValue =
    (otpType === STRINGS.EMAIL ? contact?.email : contact?.phoneNumber) ?? '';

  // Reset the code and timer when switching between email and mobile
  const [prevOtpType, setPrevOtpType] = useState(otpType);
  if (otpType !== prevOtpType) {
    setPrevOtpType(otpType);
    setValue('');
    setTimer(0);
  }

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
    const result = await sendOtpAction(otpType);
    if (!result.success) {
      result.errors.forEach((errMsg) => {
        showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
      });
      return;
    }
    setTimer(60);
  };

  const handleOnChange = (val: string) => {
    setValue(val);
  };

  const handleCodeVerify = async () => {
    if (!value) {
      return false;
    }

    onSubmit?.({ otpCode: value, otpType });
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
              {otpType === STRINGS.EMAIL
                ? STRINGS.EMAIL_VERIFICATION
                : STRINGS.MOBILE_NUMBER_VERIFICATION}
            </Typography>
            <Typography tag="p" align="center" className={styles.otpSubHeader}>
              {otpType === STRINGS.EMAIL ? STRINGS.EMAIL_SENT : STRINGS.MOBILE_SENT}
            </Typography>
            <div className={styles.userData}>
              {otpType === STRINGS.EMAIL ? (
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
                {formattedContactValue}
              </Typography>
            </div>
            <div className={styles.verificationWrapper}>
              <InputField
                label={STRINGS.ENTER_VERIFICATION_CODE}
                placeholder="000000"
                value={value}
                maxLength={6}
                inputClassName={styles.verificationTextField}
                onChange={(e) => handleOnChange(e.target.value)}
              />
              <Typography tag="label" align="center" className={styles.otpSubHeader}>
                {otpType === STRINGS.EMAIL ? STRINGS.EMAIL_CODE_HINT : STRINGS.MOBILE_CODE_HINT}
              </Typography>
            </div>
            <Button
              className={styles.button}
              startIcon={Check}
              onClick={handleCodeVerify}
              disabled={loading}
              loading={loading}
            >
              {otpType === STRINGS.EMAIL ? STRINGS.VERIFY_EMAIL : STRINGS.VERIFY_MOBILE_NUMBER}
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
