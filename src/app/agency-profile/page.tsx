import { agencyService } from '@/server/agencyService';
import { commonService } from '@/server/commonService';
import { ApiError } from '@/server/http';
import { toAgencyProfileValues } from '@/utils/agencyProfile';
import AgencyProfileForm from './AgencyProfileForm';

export default async function AgencyProfilePage() {
  // Both requests run in parallel
  const [profile, states] = await Promise.all([
    agencyService.getProfile().catch((error) => {
      // No profile yet: open an empty form
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }),
    // Without states the form still opens; the State and District fields just have nothing to pick
    commonService.getStates().catch(() => []),
  ]);

  return (
    <AgencyProfileForm
      profile={profile ? toAgencyProfileValues(profile, states) : undefined}
      states={states}
    />
  );
}
