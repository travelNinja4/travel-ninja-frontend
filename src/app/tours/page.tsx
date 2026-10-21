import Tours from '@/components/Tours';
import { commonService } from '@/server/commonService';
import { ApiError } from '@/server/http';
import { tourService } from '@/server/tourService';
import { parseToursQuery } from '@/utils/toursQuery';
import type { MetaOptions } from '@/constants/types';

const NO_OPTIONS: MetaOptions = { tour_status: [], tour_category: [] };

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { page, ...filters } = parseToursQuery(await searchParams);
  // Not awaited, so the header renders without waiting for the API. Both requests run in parallel.
  const tours = tourService.searchTours({ page, ...filters }).catch((error) => {
    // 400 is an unknown or inactive category, e.g. from an old link: nothing matches it
    if (error instanceof ApiError && error.status === 400) {
      return { tours: [], page, total: 0, pageCount: 0 };
    }
    throw error;
  });
  // Missing filter options shouldn't take the tours down with them: fall back to "All" only
  const filterOptions = commonService
    .getMetaOptions(['tour_status', 'tour_category'])
    .catch(() => NO_OPTIONS);
  return <Tours tours={tours} filterOptions={filterOptions} filters={filters} />;
}
