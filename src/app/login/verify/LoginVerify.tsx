'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { verifyLoginAction } from '@/actions/auth';
import OtpVerification from '@/components/OtpVerification';
import { OtpProps, PendingVerification } from '@/constants/types';
import { useNotification } from '@/providers/NotificationProvider';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';

interface LoginVerifyProps {
  contact: PendingVerification;
}

export default function LoginVerify({ contact }: LoginVerifyProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isPending, startTransition] = useTransition();

  const handleOtpVerification = ({ otpCode }: OtpProps) => {
    startTransition(async () => {
      const result = await verifyLoginAction(otpCode);
      if (!result.success) {
        result.errors.forEach((errMsg) => {
          showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
        });
        return;
      }
      showNotification(STRINGS.SUCCESS, STRINGS.LOGGED_IN_SUCCESSFUL, NOTIFICATION_TYPES.SUCCESS);
      router.push(ROUTES.DASHBOARD);
    });
  };

  return (
    <OtpVerification
      otpType="mobile"
      contact={contact}
      onSubmit={handleOtpVerification}
      loading={isPending}
    />
  );
}
