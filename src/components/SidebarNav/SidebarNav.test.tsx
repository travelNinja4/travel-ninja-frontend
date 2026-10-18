import { render, screen } from '@testing-library/react';
import SidebarNav from './SidebarNav';

vi.mock('../AppLink', () => ({
  default: ({ children }: any) => <div data-testid="AppLinkMock">{children}</div>,
}));

vi.mock('../Tooltip', () => ({
  default: ({ children, content }: any) => (
    <div data-testid="TooltipMock">
      {content}
      {children}
    </div>
  ),
}));

vi.mock('../Typography', () => ({
  default: ({ children }: any) => <span data-testid="TypographyMock">{children}</span>,
}));

describe('Home', () => {
  /** Base props for SidebarNav **/
  const baseProps = {
    collapsed: false,
    isMobile: false,
  };

  /**
   * @test
   * Renders the SidebarNav component without throwing an error
   * and checks if the SidebarNavTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<SidebarNav {...baseProps} />);
    expect(screen.getByTestId('SidebarNavTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the SidebarNav component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<SidebarNav {...baseProps} />)).not.toThrow();
  });

  it('renders root container', () => {
    render(<SidebarNav {...baseProps} />);
    expect(screen.getByTestId('SidebarNavTest')).toBeInTheDocument();
  });

  it('renders all nav items', () => {
    render(<SidebarNav {...baseProps} />);

    // total nav items = 7 top + 2 bottom = 9 links
    expect(screen.getAllByTestId('AppLinkMock')).toHaveLength(9);
  });

  it('shows labels when not collapsed', () => {
    render(<SidebarNav {...baseProps} />);

    // Typography should appear for each item
    expect(screen.getAllByTestId('TypographyMock').length).toBeGreaterThan(0);
  });

  it('does NOT render Typography when collapsed = true', () => {
    render(<SidebarNav collapsed={true} isMobile={false} />);

    expect(screen.queryByTestId('TypographyMock')).not.toBeInTheDocument();
  });

  it('renders Tooltip when collapsed AND not mobile', () => {
    render(<SidebarNav collapsed={true} isMobile={false} />);

    expect(screen.getAllByTestId('TooltipMock').length).toBeGreaterThan(0);
  });

  it('does NOT render Tooltip when collapsed on mobile', () => {
    render(<SidebarNav collapsed={true} isMobile={true} />);

    expect(screen.queryByTestId('TooltipMock')).not.toBeInTheDocument();
  });
});
