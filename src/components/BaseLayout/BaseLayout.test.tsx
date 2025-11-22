import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import BaseLayout from './BaseLayout';

jest.mock('../MobileSidebar', () => () => <div data-testid="MobileSidebarTest" />);
jest.mock('../DesktopSidebar', () => (props: any) => (
  <div data-testid="DesktopSidebarTest">{props.collapsed ? 'Collapsed' : 'Expanded'}</div>
));

describe('Home', () => {
  /** Base props for BaseLayout **/
  const baseProps = {
    children: <div data-testid="BaseLayoutChild">BaseLayout Test</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders DesktopSidebar on large screens', () => {
    // Mock desktop screen
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1200 });

    render(<BaseLayout {...baseProps} />);

    expect(screen.getByTestId('DesktopSidebarTest')).toBeInTheDocument();
    expect(screen.queryByTestId('MobileSidebarTest')).not.toBeInTheDocument();
  });

  it('renders MobileSidebar on small screens', () => {
    // Mock mobile screen
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 });

    render(<BaseLayout {...baseProps} />);

    expect(screen.getByTestId('MobileSidebarTest')).toBeInTheDocument();
    expect(screen.queryByTestId('DesktopSidebarTest')).not.toBeInTheDocument();
  });

  it('updates layout when window is resized', async () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1200 });
    render(<BaseLayout {...baseProps} />);

    expect(screen.getByTestId('DesktopSidebarTest')).toBeInTheDocument();

    // Resize inside act()
    await act(async () => {
      window.innerWidth = 600;
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.getByTestId('MobileSidebarTest')).toBeInTheDocument();
  });
  /**
   * @test
   * Renders the BaseLayout component without throwing an error
   * and checks if the BaseLayoutTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<BaseLayout {...baseProps} />);
    expect(screen.getByTestId('BaseLayoutTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the BaseLayout component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<BaseLayout {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the BaseLayout component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<BaseLayout {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
