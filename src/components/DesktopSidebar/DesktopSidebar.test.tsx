import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DesktopSidebar from './DesktopSidebar';

jest.mock('../SidebarNav', () => (props: any) => (
  <div data-testid="SidebarNavTest">{props.collapsed ? 'CollapsedNav' : 'ExpandedNav'}</div>
));

describe('Home', () => {
  /** Base props for DesktopSidebar **/
  const baseProps = {
    collapsed: false,
    setCollapsed: jest.fn(),
  };

  it('renders expanded view when collapsed=false', () => {
    render(<DesktopSidebar collapsed={false} setCollapsed={jest.fn()} />);

    expect(screen.getByTestId('DesktopSidebarTest')).toBeInTheDocument();

    expect(screen.getByText('TravelNinja')).toBeInTheDocument();

    expect(screen.getByText('Adventure Tours')).toBeInTheDocument();

    expect(screen.getByTestId('SidebarNavTest')).toHaveTextContent('ExpandedNav');
  });

  it('renders collapsed view when collapsed=true', () => {
    render(<DesktopSidebar collapsed={true} setCollapsed={jest.fn()} />);

    expect(screen.queryByText('TravelNinja')).not.toBeInTheDocument();

    expect(screen.getByTestId('SidebarNavTest')).toHaveTextContent('CollapsedNav');
  });

  it('calls setCollapsed(true) when collapse button clicked in expanded mode', () => {
    const mockSetCollapsed = jest.fn();
    render(<DesktopSidebar collapsed={false} setCollapsed={mockSetCollapsed} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetCollapsed).toHaveBeenCalledWith(true);
  });

  it('calls setCollapsed(false) when collapse button clicked in collapsed mode', () => {
    const mockSetCollapsed = jest.fn();
    render(<DesktopSidebar collapsed={true} setCollapsed={mockSetCollapsed} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSetCollapsed).toHaveBeenCalledWith(false);
  });

  /**
   * @test
   * Renders the DesktopSidebar component without throwing an error
   * and checks if the DesktopSidebarTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<DesktopSidebar {...baseProps} />);
    expect(screen.getByTestId('DesktopSidebarTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the DesktopSidebar component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<DesktopSidebar {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the DesktopSidebar component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<DesktopSidebar {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
