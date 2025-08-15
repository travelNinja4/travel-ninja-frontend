import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TextField from './TextField';

describe('Home', () => {
  /** Base props for TextField **/
  const baseProps = {
    label: 'TextField Test',
    name: 'testField',
    id: 'testFieldId',
    placeholder: 'Enter text here',
    value: '',
    onChange: jest.fn(),
  };

  /**
   * @test
   * Renders the TextField component without throwing an error
   * and checks if the TextFieldTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<TextField {...baseProps} />);
    expect(screen.getByTestId('TextFieldTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the TextField component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<TextField {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the TextField component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<TextField {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
