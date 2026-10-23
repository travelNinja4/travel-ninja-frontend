/**
 * Placeholder for the Tours component while the tours load: the toolbar and a
 * grid of card shapes, laid out like the loaded screen so nothing jumps when
 * the tours arrive.
 */

import clsx from 'clsx';
import TourCardSkeleton from '../TourCard/TourCardSkeleton';
import { TOURS } from '@/constants/strings';
import styles from './Tours.module.scss';

const CARD_COUNT = 8;

export default function ToursSkeleton() {
  return (
    <div
      data-testid="ToursSkeletonTest"
      role="status"
      aria-label={TOURS.LOADING}
      className={styles.content}
    >
      <div className={styles.toolbar}>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={clsx(styles.skeletonBlock, styles.skeletonField)} />
        ))}
      </div>
      <div className={styles.skeletonPanel}>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: CARD_COUNT }, (_, index) => (
            <TourCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
