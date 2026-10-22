import { render, screen, fireEvent } from '@testing-library/react';
import TourCard from './TourCard';
import { MOCK_TOURS } from './TourCard.mocks';
import { FALLBACK_IMAGE_SRC } from '../Image/Image';
import { TOURS } from '@/constants/strings';
import type { Tour } from '@/constants/types';

describe('TourCard', () => {
  // Coorg Weekend Escape: 12 of 16 seats booked
  const tour = MOCK_TOURS[0];

  const getStat = (label: string) => screen.getByText(label).nextElementSibling;

  it('shows the title, status and destination', () => {
    render(<TourCard tour={tour} />);

    expect(screen.getByRole('heading', { level: 3, name: tour.title })).toBeInTheDocument();
    expect(screen.getByTestId('StatusBadgeTest')).toHaveTextContent('Published');
    expect(screen.getByText('Coorg, Karnataka')).toBeInTheDocument();
  });

  it('shows the place, the part of the destination before the comma, on the cover', () => {
    render(<TourCard tour={tour} />);
    expect(screen.getByText('Coorg')).toHaveClass('place');
  });

  it('shows a destination without a comma as the place', () => {
    render(<TourCard tour={{ ...tour, destination: 'North Goa' }} />);
    expect(screen.getAllByText('North Goa')).toHaveLength(2);
  });

  it('formats the departure, price, capacity and occupancy', () => {
    render(<TourCard tour={tour} />);

    expect(getStat(TOURS.DEPARTURE)).toHaveTextContent('14 Nov 2026');
    expect(getStat(TOURS.PRICE)).toHaveTextContent('₹12,500');
    expect(getStat(TOURS.CAPACITY)).toHaveTextContent('12/16');
    expect(getStat(TOURS.OCCUPANCY)).toHaveTextContent('75%');
  });

  it('shows only the capacity when booked seats are unknown', () => {
    const { bookedSeats, ...withoutBookings } = tour;
    render(<TourCard tour={withoutBookings} />);

    expect(bookedSeats).toBeDefined();
    expect(getStat(TOURS.CAPACITY)).toHaveTextContent(/^16$/);
    expect(getStat(TOURS.OCCUPANCY)).toHaveTextContent(TOURS.NOT_AVAILABLE);
  });

  it('does not divide by zero when the capacity is 0', () => {
    render(<TourCard tour={{ ...tour, capacity: 0, bookedSeats: 0 }} />);
    expect(getStat(TOURS.OCCUPANCY)).toHaveTextContent(TOURS.NOT_AVAILABLE);
  });

  it('shows the draft status', () => {
    render(<TourCard tour={{ ...tour, status: 'draft' }} />);
    expect(screen.getByTestId('StatusBadgeTest')).toHaveTextContent('Draft');
  });

  it('shows the fallback image when there is no cover', () => {
    render(<TourCard tour={{ ...tour, coverImageUrl: null }} />);
    expect(screen.getByTestId('ImageTest')).toHaveAttribute('src', FALLBACK_IMAGE_SRC);
  });

  it('links a draft’s Edit to the tour edit page', () => {
    render(<TourCard tour={{ ...tour, status: 'draft' }} />);
    expect(screen.getByRole('link', { name: `${TOURS.EDIT} ${tour.title}` })).toHaveAttribute(
      'href',
      '/tours/1/edit',
    );
    expect(screen.queryByRole('link', { name: /^View/ })).not.toBeInTheDocument();
  });

  it.each(['published', 'archived'] as const)('shows View instead of Edit when %s', (status) => {
    render(<TourCard tour={{ ...tour, status }} />);
    expect(screen.getByRole('link', { name: `${TOURS.VIEW} ${tour.title}` })).toHaveAttribute(
      'href',
      '/tours/1',
    );
    expect(screen.queryByRole('link', { name: /^Edit/ })).not.toBeInTheDocument();
  });

  it('calls onDelete with the tour', () => {
    const onDelete = vi.fn<(tour: Tour) => void>();
    const draft = { ...tour, status: 'draft' as const };
    render(<TourCard tour={draft} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: `${TOURS.DELETE} ${tour.title}` }));
    expect(onDelete).toHaveBeenCalledWith(draft);
  });

  it('hides the delete icon on a published tour', () => {
    render(<TourCard tour={{ ...tour, status: 'published' }} onDelete={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /^Delete/ })).not.toBeInTheDocument();
  });

  it('hides the delete icon without onDelete', () => {
    render(<TourCard tour={tour} />);
    expect(screen.queryByRole('button', { name: /^Delete/ })).not.toBeInTheDocument();
  });

  it('calls onDuplicate with the tour', () => {
    const onDuplicate = vi.fn<(tour: Tour) => void>();
    render(<TourCard tour={tour} onDuplicate={onDuplicate} />);

    fireEvent.click(screen.getByRole('button', { name: `Duplicate ${tour.title}` }));
    expect(onDuplicate).toHaveBeenCalledWith(tour);
  });

  it('hides Duplicate without onDuplicate', () => {
    render(<TourCard tour={tour} />);
    expect(screen.queryByRole('button', { name: /Duplicate/ })).not.toBeInTheDocument();
  });
});
