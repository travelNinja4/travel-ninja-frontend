import { notFound, redirect } from 'next/navigation';
import TourForm from '@/components/TourForm';
import { commonService } from '@/server/commonService';
import { ApiError } from '@/server/http';
import { tourService } from '@/server/tourService';
import { ROUTES, TOUR_GUIDES } from '@/constants/strings';

// Largest tour id the API accepts
const MAX_TOUR_ID = 2147483647;

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tourId = Number(id);
  // Anything else would only come back as a 422, so skip the request
  if (!/^\d+$/.test(id) || tourId < 1 || tourId > MAX_TOUR_ID) notFound();

  // Both requests run in parallel
  const [tour, { tour_category }] = await Promise.all([
    tourService.getTour(tourId).catch((error) => {
      // Missing, or owned by another agency
      if (error instanceof ApiError && error.status === 404) notFound();
      throw error;
    }),
    // Without categories the form still works; the tour's own category is kept as an option
    commonService.getMetaOptions(['tour_category']).catch(() => ({ tour_category: [] })),
  ]);

  // Only drafts can be edited (the tours screen shows View for the rest), so an old link or a
  // typed URL opens the tour read-only instead
  if (tour.status !== 'draft') redirect(`${ROUTES.TOURS}/${tour.id}`);

  // Keyed so moving to another tour's edit screen starts a fresh form
  return <TourForm key={tour.id} tour={tour} categories={tour_category} guides={TOUR_GUIDES} />;
}
