import { render, screen } from '@testing-library/react';
import Dropdown from './Dropdown';

describe('Home', () => {
  /** Base props for Dropdown **/
  const baseProps = {
    label: 'Dropdown Test',
  };

  /**
   * @test
   * Renders the Dropdown component without throwing an error
   * and checks if the DropdownTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<Dropdown {...baseProps} />);
    expect(screen.getByTestId('DropdownTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the Dropdown component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<Dropdown {...baseProps} />)).not.toThrow();
  });
});
