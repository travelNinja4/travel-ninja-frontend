'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { OtpProps } from '@/constants/types';
import { errorHandler } from '@/utils/errorHandler';
import { authService } from '@/services/authService';
import OtpVerification from '@/components/OtpVerification';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import { useNotification } from '@/providers/NotificationProvider';
import styles from './page.module.scss';

export default function CreateAccountVerifyPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [otpType, setOtpType] = useState<'email' | 'mobile'>('email');
  const { accountData } = useAuthStore((store) => store);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const rawCountry = accountData?.phoneNumber?.country ?? '';
  const countryCode = rawCountry.split('(')[0].trim();

  const handleCodeVerify = async ({ otpCode, otpType }: OtpProps) => {
    try {
      const requestParams =
        otpType === STRINGS.EMAIL
          ? { email: accountData?.email, otpCode }
          : {
              phoneNumber: `${countryCode}-${accountData?.phoneNumber.number}`,
              otpCode,
            };
      setVerifyLoading(true);
      await authService.verifyOtp(requestParams);
      if (otpType === STRINGS.EMAIL) {
        setOtpType('mobile');
      } else {
        showNotification(
          STRINGS.SUCCESS,
          STRINGS.ACCOUNT_CREATED_SUCCESSFUL,
          NOTIFICATION_TYPES.SUCCESS,
        );
        router.push(ROUTES.LOGIN);
      }
    } catch (err: unknown) {
      const messages = errorHandler(err);
      messages.forEach((errMsg) => {
        showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  return <OtpVerification otpType={otpType} onSubmit={handleCodeVerify} loading={verifyLoading} />;
}
