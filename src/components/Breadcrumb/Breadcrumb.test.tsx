import { render, screen, within } from '@testing-library/react';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders a single crumb as the current page, not a link', () => {
    render(<Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }]} />);

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(within(nav).queryByRole('link')).not.toBeInTheDocument();
    expect(within(nav).getByText('Dashboard')).toHaveAttribute('aria-current', 'page');
  });

  it('links ancestors and marks the last crumb as current', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Tours', href: '/tours' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.queryByRole('link', { name: 'Tours' })).not.toBeInTheDocument();
    expect(screen.getByText('Tours')).toHaveAttribute('aria-current', 'page');
  });

  it('renders crumbs without an href as plain text', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Insights' },
          { label: 'Revenue', href: '/insights/revenue' },
        ]}
      />,
    );

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.getByText('Insights')).not.toHaveAttribute('aria-current');
  });

  it('adds the phone ellipsis only when there are middle crumbs', () => {
    const { rerender } = render(
      <Breadcrumb items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Tours' }]} />,
    );
    expect(screen.queryByText('…')).not.toBeInTheDocument();

    rerender(
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Tours', href: '/tours' },
          { label: 'New' },
        ]}
      />,
    );
    // Purely visual; the middle crumbs it replaces stay in the DOM for wider screens
    expect(screen.getByText('…').closest('li')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('link', { name: 'Tours', hidden: true })).toBeInTheDocument();
  });
});
