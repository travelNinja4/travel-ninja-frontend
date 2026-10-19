import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { ROUTES, STRINGS } from '@/constants/strings';
import { getPendingVerification } from '@/server/pendingVerification';
import CreateAccountVerify from './CreateAccountVerify';

export const metadata: Metadata = {
  title: `Verify your account | ${STRINGS.APP_NAME}`,
};

export default async function CreateAccountVerifyPage() {
  const contact = await getPendingVerification();

  // Opened directly or the verification window expired: start registration again
  if (!contact) {
    redirect(ROUTES.CREATE_ACCOUNT);
  }

  return (
    <AuthLayout
      subtitle={STRINGS.VERIFICATION}
      bannerHeader={STRINGS.VERIFICATION_BANNER_HEADER}
      bannerSubText={STRINGS.VERIFICATION_BANNER_SUB_TEXT}
    >
      <CreateAccountVerify contact={contact} />
    </AuthLayout>
  );
}
