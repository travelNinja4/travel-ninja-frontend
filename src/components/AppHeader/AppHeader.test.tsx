import { render, screen, fireEvent } from '@testing-library/react';
import AppHeader from './AppHeader';
import { APP_HEADER, NAV_ITEM } from '@/constants/strings';

describe('AppHeader', () => {
  it('shows the breadcrumb for the current route', () => {
    // usePathname is mocked to '/dashboard' in vitest.setup.ts
    render(<AppHeader />);

    const nav = screen.getByRole('navigation', { name: APP_HEADER.BREADCRUMB });
    expect(nav).toHaveTextContent(NAV_ITEM.DASHBOARD);
    expect(screen.getByText(NAV_ITEM.DASHBOARD)).toHaveAttribute('aria-current', 'page');
  });

  it('renders the theme toggle and notifications buttons', () => {
    render(<AppHeader />);

    expect(screen.getByRole('button', { name: APP_HEADER.TOGGLE_THEME })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: APP_HEADER.NOTIFICATIONS })).toBeInTheDocument();
  });

  it('calls onNotificationsClick', () => {
    const onNotificationsClick = vi.fn();
    render(<AppHeader onNotificationsClick={onNotificationsClick} />);

    fireEvent.click(screen.getByRole('button', { name: APP_HEADER.NOTIFICATIONS }));
    expect(onNotificationsClick).toHaveBeenCalledTimes(1);
  });
});
