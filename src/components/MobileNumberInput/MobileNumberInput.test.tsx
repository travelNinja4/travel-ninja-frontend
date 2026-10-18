import { render, screen } from '@testing-library/react';
import MobileNumberInput from './MobileNumberInput';

describe('Home', () => {
  /** Base props for MobileNumberInput **/
  const baseProps = {
    value: { country: 'US', number: '1234567890' },
    onChange: vi.fn(),
    maxLength: 10,
    error: '',
    countryError: '',
  };

  /**
   * @test
   * Renders the MobileNumberInput component without throwing an error
   * and checks if the MobileNumberInputTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<MobileNumberInput {...baseProps} />);
    expect(screen.getByTestId('MobileNumberInputTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the MobileNumberInput component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<MobileNumberInput {...baseProps} />)).not.toThrow();
  });
});
