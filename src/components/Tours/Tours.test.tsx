import { act, render, screen } from '@testing-library/react';
import Tours from './Tours';
import { MOCK_TOURS } from '../TourCard/TourCard.mocks';
import { ROUTES, TOURS } from '@/constants/strings';
import type { TourPage } from '@/constants/types';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe('Tours', () => {
  it('shows the header and a skeleton while the tours load', () => {
    render(<Tours tours={new Promise<TourPage>(() => {})} />);

    expect(screen.getByRole('heading', { level: 1, name: TOURS.PAGE_TITLE })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: TOURS.NEW_TOUR })).toHaveAttribute(
      'href',
      ROUTES.NEW_TOUR,
    );
    expect(screen.getByRole('status', { name: TOURS.LOADING })).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('swaps the skeleton for the toolbar and cards once the tours arrive', async () => {
    await act(async () => {
      render(<Tours tours={Promise.resolve({ tours: MOCK_TOURS, page: 1, hasNextPage: false })} />);
    });

    expect(screen.queryByRole('status', { name: TOURS.LOADING })).not.toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(MOCK_TOURS.length);
  });
});
