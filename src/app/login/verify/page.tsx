'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { OtpProps } from '@/constants/types';
import { errorHandler } from '@/utils/errorHandler';
import { authService } from '@/services/authService';
import OtpVerification from '@/components/OtpVerification';
import { useNotification } from '@/providers/NotificationProvider';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import styles from './page.module.scss';

export default function LoginVerifyPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { accountData } = useAuthStore((store) => store);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleOtpVerification = async ({ otpCode }: OtpProps) => {
    try {
      const requestedParams = {
        otp: otpCode,
      };
      setVerifyLoading(true);
      await authService.verifyLogin(requestedParams);
      showNotification(STRINGS.SUCCESS, STRINGS.LOGGED_IN_SUCCESSFUL, NOTIFICATION_TYPES.SUCCESS);
      router.push(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const messages = errorHandler(err);
      messages.forEach((errMsg) => {
        showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <OtpVerification otpType="mobile" onSubmit={handleOtpVerification} loading={verifyLoading} />
  );
}
