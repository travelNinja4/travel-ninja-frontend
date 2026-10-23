import { render, screen } from '@testing-library/react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders the title and description', () => {
    render(<EmptyState title="No bookings yet" description="Bookings will show up here." />);

    expect(screen.getByText('No bookings yet')).toBeInTheDocument();
    expect(screen.getByText('Bookings will show up here.')).toBeInTheDocument();
  });

  it('shows a decorative icon by default, and none when it is null', () => {
    const { rerender } = render(<EmptyState title="Empty" />);
    expect(screen.getByTestId('EmptyStateTest').querySelector('svg')).toBeInTheDocument();

    rerender(<EmptyState title="Empty" icon={null} />);
    expect(screen.getByTestId('EmptyStateTest').querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders the title as the given element', () => {
    render(<EmptyState title="No tours yet" titleTag="h1" />);
    expect(screen.getByRole('heading', { level: 1, name: 'No tours yet' })).toBeInTheDocument();
  });

  it('renders the action', () => {
    render(<EmptyState title="Empty" action={<button type="button">Create tour</button>} />);
    expect(screen.getByRole('button', { name: 'Create tour' })).toBeInTheDocument();
  });

  it('accepts a className', () => {
    render(<EmptyState title="Empty" className="extra" />);
    expect(screen.getByTestId('EmptyStateTest')).toHaveClass('container', 'extra');
  });
});
