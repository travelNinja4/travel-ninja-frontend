import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/strings';
import { getPendingVerification } from '@/server/pendingVerification';
import LoginVerify from './LoginVerify';

export default async function LoginVerifyPage() {
  const contact = await getPendingVerification();

  // Opened directly or the verification window expired: log in again
  if (!contact) {
    redirect(ROUTES.LOGIN);
  }

  return <LoginVerify contact={contact} />;
}
