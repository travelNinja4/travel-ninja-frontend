import { commonService } from '@/server/commonService';
import { TOUR_GUIDES } from '@/constants/strings';
import NewTourForm from './NewTourForm';

export default async function NewTourPage() {
  // Without categories the form still works; the Category field just has nothing to pick
  const { tour_category } = await commonService
    .getMetaOptions(['tour_category'])
    .catch(() => ({ tour_category: [] }));
  return <NewTourForm categories={tour_category} guides={TOUR_GUIDES} />;
}
