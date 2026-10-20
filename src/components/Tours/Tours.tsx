/**
 * The tours screen: title, description and New tour link above the toolbar
 * and tours grid (ToursContent).
 *
 * Pass the page of tours as a promise the page started without awaiting it:
 * the header paints straight away and the grid streams in behind a skeleton
 * when the tours arrive. It holds no state, so it stays a Server Component; only
 * ToursContent ships JavaScript for search and filtering.
 *
 * @example
 * ```tsx
 * import Tours from '@/components/Tours'
 *
 * export default function ToursPage() {
 *   const tours = tourService.getToursPage({ page: 1 });
 *   return <Tours tours={tours} />;
 * }
 * ```
 */

import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import AppLink from '../AppLink';
import Typography from '../Typography';
import ToursContent from './ToursContent';
import ToursSkeleton from './ToursSkeleton';
import { ROUTES, SIDEBAR, TOURS } from '@/constants/strings';
import type { TourPage, TourStatusFilter } from '@/constants/types';
import styles from './Tours.module.scss';

/**
 * Define the props available for the Tours component.
 */
interface ToursProps {
  /**
   * The page of tours to show, still loading. A rejection reaches the route's error boundary.
   */
  tours: Promise<TourPage>;

  /**
   * The status filter the tours were fetched with.
   */
  status?: TourStatusFilter;
}

export default function Tours({ tours, status }: ToursProps) {
  return (
    <div data-testid="ToursTest" className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <Typography variant="heading-1" tag="h1">
            {TOURS.PAGE_TITLE}
          </Typography>
          <Typography variant="body-lg" className={styles.description}>
            {`${TOURS.PAGE_DESCRIPTION} ${SIDEBAR.AGENCY_NAME}.`}
          </Typography>
        </div>
        <AppLink href={ROUTES.NEW_TOUR} className={styles.newTour}>
          <Plus size={18} aria-hidden="true" />
          {TOURS.NEW_TOUR}
        </AppLink>
      </header>

      <Suspense fallback={<ToursSkeleton />}>
        <ToursContent toursPromise={tours} status={status} />
      </Suspense>
    </div>
  );
}
