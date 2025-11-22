import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Tooltip from './Tooltip';

describe('Home', () => {
  /** Base props for Tooltip **/
  const baseProps = {
    children: <button>Hover me</button>,
    content: <div data-testid="TooltipTest">Tooltip Test</div>,
    position: 'top' as const,
    variant: 'light' as const,
    arrow: true,
  };

  /**
   * @test
   * Renders the Tooltip component without throwing an error
   * and checks if the TooltipTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<Tooltip {...baseProps} />);
    expect(screen.getByTestId('TooltipTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the Tooltip component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<Tooltip {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the Tooltip component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<Tooltip {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
