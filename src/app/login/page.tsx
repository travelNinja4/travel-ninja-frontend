import type { Metadata } from 'next';
import AuthLayout from '@/components/AuthLayout';
import { STRINGS } from '@/constants/strings';
import LoginForm from './LoginForm/LoginForm';

export const metadata: Metadata = {
  title: `Sign in | ${STRINGS.APP_NAME}`,
};

/**
 * Split-screen login: brand + form on the left, green brand panel on the right.
 * Server component; only LoginForm ships client JavaScript.
 */
export default function LoginPage() {
  return (
    <AuthLayout
      subtitle={STRINGS.AGENCY_DASHBOARD}
      bannerHeader={STRINGS.LOGIN_BANNER_HEADER}
      bannerSubText={STRINGS.LOGIN_BANNER_SUB_TEXT}
    >
      <LoginForm />
    </AuthLayout>
  );
}
