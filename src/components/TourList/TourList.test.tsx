import { render, screen, within, fireEvent } from '@testing-library/react';
import TourList from './TourList';
import { MOCK_TOURS } from '../TourCard/TourCard.mocks';
import { TOURS } from '@/constants/strings';

describe('TourList', () => {
  it('renders a card for every tour', () => {
    render(<TourList tours={MOCK_TOURS} />);

    const items = within(screen.getByRole('list')).getAllByRole('listitem');
    expect(items).toHaveLength(MOCK_TOURS.length);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      MOCK_TOURS.map((tour) => tour.title),
    );
  });

  it('shows how many tours are on screen', () => {
    render(<TourList tours={MOCK_TOURS} />);
    expect(screen.getByText('Showing 8 of 8')).toBeInTheDocument();
  });

  it('shows the total when only one page of tours is passed', () => {
    render(<TourList tours={MOCK_TOURS.slice(0, 3)} total={24} />);
    expect(screen.getByText('Showing 3 of 24')).toBeInTheDocument();
  });

  it('shows the empty state when there are no tours', () => {
    render(<TourList tours={[]} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.getByText(TOURS.EMPTY_TITLE)).toBeInTheDocument();
    expect(screen.getByText('Showing 0 of 0')).toBeInTheDocument();
  });

  it('passes onDuplicate to each card', () => {
    const onDuplicate = vi.fn();
    render(<TourList tours={MOCK_TOURS} onDuplicate={onDuplicate} />);

    fireEvent.click(screen.getByRole('button', { name: `Duplicate ${MOCK_TOURS[2].title}` }));
    expect(onDuplicate).toHaveBeenCalledWith(MOCK_TOURS[2]);
  });
});
