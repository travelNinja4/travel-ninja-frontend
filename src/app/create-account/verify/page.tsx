import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/strings';
import { getPendingVerification } from '@/server/pendingVerification';
import CreateAccountVerify from './CreateAccountVerify';

export default async function CreateAccountVerifyPage() {
  const contact = await getPendingVerification();

  // Opened directly or the verification window expired: start registration again
  if (!contact) {
    redirect(ROUTES.CREATE_ACCOUNT);
  }

  return <CreateAccountVerify contact={contact} />;
}
