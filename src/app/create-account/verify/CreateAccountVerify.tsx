'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { verifyOtpAction } from '@/actions/auth';
import OtpVerification from '@/components/OtpVerification';
import { OtpProps, OtpType, PendingVerification } from '@/constants/types';
import { NOTIFICATION_TYPES, ROUTES, STRINGS } from '@/constants/strings';
import { useNotification } from '@/providers/NotificationProvider';

interface CreateAccountVerifyProps {
  contact: PendingVerification;
}

export default function CreateAccountVerify({ contact }: CreateAccountVerifyProps) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [otpType, setOtpType] = useState<OtpType>('email');
  const [isPending, startTransition] = useTransition();

  const handleCodeVerify = ({ otpCode }: OtpProps) => {
    startTransition(async () => {
      const result = await verifyOtpAction(otpType, otpCode);
      if (!result.success) {
        result.errors.forEach((errMsg) => {
          showNotification(STRINGS.ERROR, errMsg, NOTIFICATION_TYPES.ERROR);
        });
        return;
      }

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
    });
  };

  return (
    <OtpVerification
      // Remount per step so the code and resend cooldown start fresh
      key={otpType}
      otpType={otpType}
      contact={contact}
      changeContactHref={ROUTES.CREATE_ACCOUNT}
      onSubmit={handleCodeVerify}
      loading={isPending}
    />
  );
}
