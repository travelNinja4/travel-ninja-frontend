import { render, screen, fireEvent } from '@testing-library/react';
import SidebarNav, { NAV_SECTIONS } from './SidebarNav';
import { NAV_ITEM } from '@/constants/strings';

vi.mock('../Tooltip', () => ({
  default: ({ children, content }: any) => (
    <div data-testid="TooltipMock" data-content={content}>
      {children}
    </div>
  ),
}));

const totalItems = NAV_SECTIONS.reduce((count, section) => count + section.items.length, 0);

describe('SidebarNav', () => {
  it('renders without crashing', () => {
    render(<SidebarNav />);
    expect(screen.getByTestId('SidebarNavTest')).toBeInTheDocument();
  });

  it('renders every section title and link', () => {
    render(<SidebarNav />);

    NAV_SECTIONS.forEach(({ title }) => {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    });
    expect(screen.getAllByRole('link')).toHaveLength(totalItems);
  });

  it('marks the link for the current route as the active page', () => {
    // usePathname is mocked to '/dashboard' in vitest.setup.ts
    render(<SidebarNav />);

    const dashboard = screen.getByRole('link', { name: NAV_ITEM.DASHBOARD });
    expect(dashboard).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: NAV_ITEM.TOURS })).not.toHaveAttribute('aria-current');
  });

  // Restore with the Engage section in SidebarNav
  // it('shows the messages badge', () => {
  //   render(<SidebarNav />);
  //   expect(screen.getByRole('link', { name: `${NAV_ITEM.MESSAGES} 2` })).toBeInTheDocument();
  // });

  it('links to the agency profile under Account', () => {
    render(<SidebarNav />);
    expect(screen.getByRole('link', { name: NAV_ITEM.AGENCY_PROFILE })).toHaveAttribute(
      'href',
      '/agency-profile',
    );
  });

  it('wraps each link in a tooltip only when collapsed', () => {
    const { rerender } = render(<SidebarNav />);
    expect(screen.queryByTestId('TooltipMock')).not.toBeInTheDocument();

    rerender(<SidebarNav collapsed />);
    expect(screen.getAllByTestId('TooltipMock')).toHaveLength(totalItems);
    expect(screen.getByRole('link', { name: NAV_ITEM.AGENCY_PROFILE })).toBeInTheDocument();
  });

  it('calls onNavigate when a link is clicked', () => {
    const onNavigate = vi.fn();
    render(<SidebarNav onNavigate={onNavigate} />);
    // jsdom can't navigate; stop the link's default action once the click has run
    document.addEventListener('click', (event) => event.preventDefault(), { once: true });

    fireEvent.click(screen.getByRole('link', { name: NAV_ITEM.CUSTOMERS }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
