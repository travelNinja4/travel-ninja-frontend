import { getDistrictsAction } from '@/actions/common';
import AgencyProfile from '@/components/AgencyProfile';
import { SIDEBAR } from '@/constants/strings';
import { commonService } from '@/server/commonService';

export default async function AgencyProfilePage() {
  // Without states the form still works; the State and District fields just have nothing to pick
  const states = await commonService.getStates().catch(() => []);
  // Placeholder agency until the profile API is wired in
  return (
    <AgencyProfile
      profile={{ name: SIDEBAR.AGENCY_NAME }}
      states={states}
      getDistricts={getDistrictsAction}
    />
  );
}
