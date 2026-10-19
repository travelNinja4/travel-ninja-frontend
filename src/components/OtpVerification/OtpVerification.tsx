/**
 * OTP verification form for an email address or mobile number: heading, the
 * contact the code went to, a 6-box code input, submit, and resend with a
 * cooldown. The same form serves both steps; only the copy changes.
 *
 * Layout (brand + side banner) comes from the page via `AuthLayout`.
 * Verifying is the caller's job (`onSubmit`); resending calls `sendOtpAction`.
 *
 * @example
 * ```tsx
 * import OtpVerification from '@/components/OtpVerification'
 *
 * export default function Example() {
 *   return (
 *     <OtpVerification
 *       otpType="email"
 *       contact={{ email: 'ops@wanderlytravels.example' }}
 *       changeContactHref="/create-account"
 *       onSubmit={({ otpCode }) => console.log(otpCode)}
 *     />
 *   );
 * }
 * ```
 */
'use client';

import { FormEvent, useEffect, useId, useState, useTransition } from 'react';
import { sendOtpAction } from '@/actions/auth';
import { NOTIFICATION_TYPES, STRINGS } from '@/constants/strings';
import { OtpProps, OtpType, PendingVerification } from '@/constants/types';
import { useNotification } from '@/providers/NotificationProvider';
import AppLink from '../AppLink';
import Button from '../Button';
import OtpInput from '../OtpInput';
import { Body, BodyLg, BodySm, Heading2 } from '../Typography';
import styles from './OtpVerification.module.scss';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Define the props available for the OtpVerification component.
 * Callers render it with `key={otpType}` when switching steps so the code and cooldown reset.
 */
interface OtpVerificationProps {
  /**
   * Which contact is being verified.
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
   * Where "Change email" / "Change mobile number" leads. The link is hidden when not set.
   */
  changeContactHref?: string;

  /**
   * Called with the full code when the form is submitted.
   */
  onSubmit?: (params: OtpProps) => void;

  /**
   * True while the code is being verified: disables the input and shows the button spinner.
   *
   * @default false
   */
  loading?: boolean;
}

export default function OtpVerification({
  otpType = 'email',
  contact,
  changeContactHref,
  onSubmit,
  loading = false,
}: OtpVerificationProps) {
  const { showNotification } = useNotification();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [cooldown, setCooldown] = useState(0);
  const [isResending, startResend] = useTransition();
  const errorId = useId();

  const isEmail = otpType === STRINGS.EMAIL;
  const contactValue = (isEmail ? contact?.email : contact?.phoneNumber) ?? '';

  // One tick per second while the resend cooldown runs
  useEffect(() => {
    if (cooldown === 0) return;
    const timeout = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timeout);
  }, [cooldown]);

  const handleCodeChange = (next: string) => {
    setCode(next);
    setError(undefined);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length < OTP_LENGTH) {
      setError(STRINGS.ENTER_COMPLETE_CODE);
      return;
    }
    onSubmit?.({ otpCode: code, otpType });
  };

  const handleResend = () => {
    startResend(async () => {
      const result = await sendOtpAction(otpType);
      if (!result.success) {
        result.errors.forEach((errMsg) => {
          showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
        });
        return;
      }
      setCode('');
      setError(undefined);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      showNotification(STRINGS.SUCCESS, STRINGS.CODE_RESENT, NOTIFICATION_TYPES.SUCCESS);
    });
  };

  return (
    <div data-testid="OtpVerificationTest" className={styles.otpVerification}>
      <header className={styles.header}>
        <Heading2 tag="h1" className={styles.title}>
          {isEmail ? STRINGS.VERIFY_YOUR_EMAIL : STRINGS.VERIFY_YOUR_MOBILE_NUMBER}
        </Heading2>
        <BodyLg className={styles.description}>
          {STRINGS.ENTER_CODE_SENT_TO} <strong className={styles.contact}>{contactValue}</strong>.
        </BodyLg>
        {changeContactHref && (
          <AppLink href={changeContactHref} replace className={styles.link}>
            {isEmail ? STRINGS.CHANGE_EMAIL : STRINGS.CHANGE_MOBILE_NUMBER}
          </AppLink>
        )}
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={loading}>
        <div className={styles.codeField}>
          <OtpInput
            label={STRINGS.VERIFICATION_CODE}
            value={code}
            onChange={handleCodeChange}
            length={OTP_LENGTH}
            disabled={loading}
            hasError={!!error}
            aria-describedby={error ? errorId : undefined}
            autoFocus
          />
          {error && (
            <BodySm id={errorId} role="alert" className={styles.error}>
              {error}
            </BodySm>
          )}
        </div>

        <Button type="submit" loading={loading} className={styles.submit}>
          {STRINGS.VERIFY_AND_CONTINUE}
        </Button>
      </form>

      <div className={styles.resend}>
        <Body className={styles.muted}>{STRINGS.DIDNT_RECEIVE_CODE}</Body>
        {cooldown > 0 ? (
          <Body className={styles.muted}>{`${STRINGS.RESEND_CODE_IN} ${cooldown}s`}</Body>
        ) : (
          <button
            type="button"
            className={styles.resendButton}
            onClick={handleResend}
            disabled={isResending || loading}
          >
            {STRINGS.RESEND_CODE}
          </button>
        )}
      </div>
    </div>
  );
}
