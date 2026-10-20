import { render, screen } from '@testing-library/react';
import StatusBadge, { STATUS_TONES } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders its label', () => {
    render(<StatusBadge status="published">Published</StatusBadge>);
    expect(screen.getByTestId('StatusBadgeTest')).toHaveTextContent('Published');
  });

  it.each(STATUS_TONES)('applies the %s colours', (status) => {
    render(<StatusBadge status={status}>{status}</StatusBadge>);
    expect(screen.getByTestId('StatusBadgeTest')).toHaveClass('badge', status);
  });

  it('accepts a className', () => {
    render(
      <StatusBadge status="draft" className="extra">
        Draft
      </StatusBadge>,
    );
    expect(screen.getByTestId('StatusBadgeTest')).toHaveClass('extra');
  });
});
