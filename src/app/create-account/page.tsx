import type { Metadata } from 'next';
import AuthLayout from '@/components/AuthLayout';
import { STRINGS } from '@/constants/strings';
import { commonService } from '@/server/commonService';
import CreateAccountForm from './CreateAccountForm/CreateAccountForm';

export const metadata: Metadata = {
  title: `Create your agency account | ${STRINGS.APP_NAME}`,
};

/**
 * Split-screen agency sign up, same layout as sign in.
 * Server component: fetches the countries (cached for a day); only CreateAccountForm ships client JavaScript.
 */
export default async function CreateAccountPage() {
  const countries = await commonService.getCountries();

  return (
    <AuthLayout
      subtitle={STRINGS.AGENCY_ONBOARDING}
      bannerHeader={STRINGS.CREATE_ACCOUNT_BANNER_HEADER}
      bannerSubText={STRINGS.CREATE_ACCOUNT_BANNER_SUB_TEXT}
    >
      <CreateAccountForm countries={countries} />
    </AuthLayout>
  );
}
