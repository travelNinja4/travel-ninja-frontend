import type { Metadata } from 'next';
import AuthLayout from '@/components/AuthLayout';
import { STRINGS } from '@/constants/strings';
import ForgotPasswordForm from '../ForgotPasswordForm/ForgotPasswordForm';

export const metadata: Metadata = {
  title: `Reset your password | ${STRINGS.APP_NAME}`,
};

/**
 * Split-screen password recovery, same layout as sign in.
 * Server component; only ForgotPasswordForm ships client JavaScript.
 */
export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      subtitle={STRINGS.PASSWORD_RECOVERY}
      bannerHeader={STRINGS.ACCOUNT_RECOVERY_BANNER_HEADER}
      bannerSubText={STRINGS.ACCOUNT_RECOVERY_BANNER_SUB_TEXT}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
