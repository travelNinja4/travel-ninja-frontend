/**
 * The tours screen: title, description and New tour link above the toolbar
 * and tours grid (ToursContent).
 *
 * Pass the page of tours as a promise the page started without awaiting it:
 * the header paints straight away and the grid streams in behind a skeleton
 * when the tours arrive. It holds no state, so it stays a Server Component; only
 * ToursContent ships JavaScript for the search and filter controls.
 *
 * @example
 * ```tsx
 * import Tours from '@/components/Tours'
 *
 * export default function ToursPage() {
 *   const tours = tourService.searchTours({ page: 1 });
 *   const filterOptions = commonService.getMetaOptions(['tour_status', 'tour_category']);
 *   return <Tours tours={tours} filterOptions={filterOptions} />;
 * }
 * ```
 */

import { Suspense } from 'react';
import { Plus } from 'lucide-react';
import AppLink from '../AppLink';
import PageHeader from '../PageHeader';
import ToursContent from './ToursContent';
import ToursSkeleton from './ToursSkeleton';
import { ROUTES, SIDEBAR, TOURS } from '@/constants/strings';
import type { MetaOptions, TourPage, TourSearch } from '@/constants/types';
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
   * Options for the status and category filters, still loading. Started alongside `tours`, so
   * the toolbar waits for whichever arrives last.
   */
  filterOptions: Promise<MetaOptions>;

  /**
   * The search and filters the tours were fetched with, from the URL.
   */
  filters?: TourSearch;
}

export default function Tours({ tours, filterOptions, filters }: ToursProps) {
  return (
    <div data-testid="ToursTest" className={styles.page}>
      <PageHeader
        title={TOURS.PAGE_TITLE}
        description={`${TOURS.PAGE_DESCRIPTION} ${SIDEBAR.AGENCY_NAME}.`}
        actions={
          <AppLink href={ROUTES.NEW_TOUR} className={styles.newTour}>
            <Plus size={18} aria-hidden="true" />
            {TOURS.NEW_TOUR}
          </AppLink>
        }
      />

      <Suspense fallback={<ToursSkeleton />}>
        <ToursContent toursPromise={tours} filterOptionsPromise={filterOptions} filters={filters} />
      </Suspense>
    </div>
  );
}
