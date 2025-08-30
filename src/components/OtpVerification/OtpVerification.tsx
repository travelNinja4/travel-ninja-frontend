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

/**
 * Define the props available for the OtpVerification component.
 */
interface OtpVerificationProps {
  type: 'email' | 'mobile';
  value?: string;
  verifyApi?: (payload: { type: 'email' | 'mobile'; value: string; code: string }) => Promise<void>;
  resendApi?: (payload: { type: 'email' | 'mobile'; value: string }) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function OtpVerification({
  type,
  value,
  verifyApi,
  resendApi,
  onSuccess,
  onError,
}: OtpVerificationProps) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
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
            <AuthSideBanner appTagLine={STRINGS.CREATE_ACCOUNT_APP_TAG_LINE} />
          </div>
          <div className={styles.otpContainer}>
            <Typography tag="h2" align="center" className={styles.otpHeader}>
              {type === 'email' ? 'Email Verification' : 'Mobile Number Verification'}
            </Typography>
            <Typography tag="p" align="center" className={styles.otpSubHeader}>
              {type === 'email'
                ? `We've sent a verification code to your email`
                : `We've sent a verification code to your mobile number`}
            </Typography>
            <div className={styles.userData}>
              {type === 'email' ? <Mail color="#000000" /> : <Phone color="#000000" />}
              <Typography tag="span" align="center" color="#667eea" className={styles.userEmail}>
                {type === 'email' ? 'user@gmail.com' : '4658265937'}
              </Typography>
            </div>
            <div className={styles.verificationWrapper}>
              <TextField
                label="Enter Verification Code"
                placeholder="000000"
                maxLength={6}
                className={styles.verificationTextField}
              />
              <Typography tag="label" align="center" className={styles.otpSubHeader}>
                {type === 'email'
                  ? 'Enter the 6-digit code sent to your email'
                  : 'Enter the 6-digit code sent to your mobile number'}
              </Typography>
            </div>
            <Button className={styles.button} startIcon={Check}>
              {type === 'email' ? 'Verify Email' : 'Verify Mobile Number'}
            </Button>
            <div className={styles.resendWrapper}>
              {timer > 0 ? (
                <Typography tag="span">{`Resend code in ${timer} seconds`}</Typography>
              ) : (
                <>
                  <RotateCw color="#667eea" />
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
