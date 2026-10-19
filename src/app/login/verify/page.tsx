import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { ROUTES, STRINGS } from '@/constants/strings';
import { getPendingVerification } from '@/server/pendingVerification';
import LoginVerify from './LoginVerify';

export const metadata: Metadata = {
  title: `Verify your mobile number | ${STRINGS.APP_NAME}`,
};

export default async function LoginVerifyPage() {
  const contact = await getPendingVerification();

  // Opened directly or the verification window expired: log in again
  if (!contact) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <AuthLayout
      subtitle={STRINGS.VERIFICATION}
      bannerHeader={STRINGS.VERIFICATION_BANNER_HEADER}
      bannerSubText={STRINGS.VERIFICATION_BANNER_SUB_TEXT}
    >
      <LoginVerify contact={contact} />
    </AuthLayout>
  );
}
