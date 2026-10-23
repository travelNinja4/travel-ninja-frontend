import { render, screen } from '@testing-library/react';
import TourCardSkeleton from './TourCardSkeleton';

describe('TourCardSkeleton', () => {
  it('uses the card layout so it takes the same size', () => {
    render(<TourCardSkeleton className="extra" />);
    expect(screen.getByTestId('TourCardSkeletonTest')).toHaveClass('card', 'extra');
  });

  it('is hidden from assistive technology', () => {
    render(<TourCardSkeleton />);
    expect(screen.getByTestId('TourCardSkeletonTest')).toHaveAttribute('aria-hidden', 'true');
  });
});
