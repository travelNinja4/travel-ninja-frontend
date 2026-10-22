import TourForm from '@/components/TourForm';
import { commonService } from '@/server/commonService';
import { TOUR_GUIDES } from '@/constants/strings';

export default async function NewTourPage() {
  // Without categories the form still works; the Category field just has nothing to pick
  const { tour_category } = await commonService
    .getMetaOptions(['tour_category'])
    .catch(() => ({ tour_category: [] }));
  return <TourForm categories={tour_category} guides={TOUR_GUIDES} />;
}
