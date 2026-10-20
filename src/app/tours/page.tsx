import Tours from '@/components/Tours';
import { tourService } from '@/server/tourService';
import { parseToursQuery } from '@/utils/toursQuery';

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { page, status } = parseToursQuery(await searchParams);
  // Not awaited, so the header renders without waiting for the API
  const tours = tourService.getToursPage({ page, status });
  return <Tours tours={tours} status={status} />;
}
