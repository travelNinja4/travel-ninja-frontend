import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from './Sidebar';
import { MEDIA_QUERIES, SIDEBAR, STRINGS } from '@/constants/strings';

type Viewport = 'phone' | 'tablet' | 'laptop';

const viewport = vi.hoisted(() => ({ current: 'laptop' as Viewport }));

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: (query: string) =>
    (query === MEDIA_QUERIES.PHONE && viewport.current === 'phone') ||
    (query === MEDIA_QUERIES.TABLET_ONLY && viewport.current === 'tablet'),
}));

vi.mock('../SidebarNav', () => ({
  default: ({ collapsed, onNavigate }: any) => (
    <nav data-testid="SidebarNavTest">
      {collapsed ? 'CollapsedNav' : 'ExpandedNav'}
      <button type="button" onClick={onNavigate}>
        NavLink
      </button>
    </nav>
  ),
}));

const panel = () => screen.getByRole('complementary', { hidden: true });
// jsdom applies the CSS but not media queries, so the panel is the phone's closed drawer
// (visibility: hidden) unless opened. Hidden elements have no accessible name, so find the
// rail's controls by their label or text instead
const panelButton = (name: string) => {
  const button = screen
    .getAllByRole('button', { hidden: true })
    .find((el) => el.getAttribute('aria-label') === name || el.textContent === name);
  if (!button) throw new Error(`No sidebar button named "${name}"`);
  return button;
};
const openDrawer = () =>
  fireEvent.click(screen.getByRole('button', { name: SIDEBAR.OPEN_NAVIGATION }));

describe('Sidebar', () => {
  beforeEach(() => {
    viewport.current = 'laptop';
  });

  it('renders the brand, nav and agency footer', () => {
    render(<Sidebar />);

    expect(screen.getByTestId('SidebarTest')).toBeInTheDocument();
    expect(screen.getAllByText(STRINGS.APP_NAME).length).toBeGreaterThan(0);
    expect(screen.getByText(SIDEBAR.AGENCY_NAME)).toBeInTheDocument();
    expect(screen.getByText('WT')).toBeInTheDocument();
  });

  it('calls onSignOut', () => {
    const onSignOut = vi.fn();
    render(<Sidebar onSignOut={onSignOut} />);

    fireEvent.click(panelButton(SIDEBAR.SIGN_OUT));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it('disables sign out while it is in progress', async () => {
    const onSignOut = vi.fn(() => new Promise<void>(() => {}));
    render(<Sidebar onSignOut={onSignOut} />);

    fireEvent.click(panelButton(SIDEBAR.SIGN_OUT));
    await waitFor(() => expect(panelButton(SIDEBAR.SIGN_OUT)).toBeDisabled());
    fireEvent.click(panelButton(SIDEBAR.SIGN_OUT));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  describe('rail (tablet and up)', () => {
    it('follows the breakpoint until toggled', () => {
      render(<Sidebar />);
      expect(panel()).toHaveAttribute('data-sidebar', 'auto');
      expect(screen.getByTestId('SidebarNavTest')).toHaveTextContent('ExpandedNav');
    });

    it('starts collapsed on tablets', () => {
      viewport.current = 'tablet';
      render(<Sidebar />);

      expect(screen.getByTestId('SidebarNavTest')).toHaveTextContent('CollapsedNav');
      expect(panelButton(SIDEBAR.EXPAND)).toBeInTheDocument();
    });

    it('collapses and expands from the toggle', () => {
      render(<Sidebar />);

      fireEvent.click(panelButton(SIDEBAR.COLLAPSE));
      expect(panel()).toHaveAttribute('data-sidebar', 'collapsed');
      expect(screen.getByTestId('SidebarNavTest')).toHaveTextContent('CollapsedNav');

      fireEvent.click(panelButton(SIDEBAR.EXPAND));
      expect(panel()).toHaveAttribute('data-sidebar', 'expanded');
      expect(screen.getByTestId('SidebarNavTest')).toHaveTextContent('ExpandedNav');
    });
  });

  describe('drawer (phones)', () => {
    beforeEach(() => {
      viewport.current = 'phone';
    });

    it('is closed by default', () => {
      render(<Sidebar />);

      expect(screen.queryByTestId('SidebarOverlay')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: SIDEBAR.OPEN_NAVIGATION })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('opens as a modal dialog, always expanded, with focus on close', () => {
      render(<Sidebar />);
      fireEvent.click(panelButton(SIDEBAR.COLLAPSE));
      openDrawer();

      expect(screen.getByRole('dialog', { name: SIDEBAR.MAIN_NAVIGATION })).toBeInTheDocument();
      expect(screen.getByTestId('SidebarOverlay')).toBeInTheDocument();
      expect(screen.getByTestId('SidebarNavTest')).toHaveTextContent('ExpandedNav');
      expect(screen.getByRole('button', { name: SIDEBAR.CLOSE_NAVIGATION })).toHaveFocus();
    });

    it.each([
      ['the overlay', () => fireEvent.click(screen.getByTestId('SidebarOverlay'))],
      [
        'the close button',
        () => fireEvent.click(screen.getByRole('button', { name: SIDEBAR.CLOSE_NAVIGATION })),
      ],
      ['Escape', () => fireEvent.keyDown(document, { key: 'Escape' })],
      ['navigating', () => fireEvent.click(screen.getByRole('button', { name: 'NavLink' }))],
    ])('closes from %s', (_, close) => {
      render(<Sidebar />);
      openDrawer();

      close();

      expect(screen.queryByTestId('SidebarOverlay')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
