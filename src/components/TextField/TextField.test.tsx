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

  it('renders without label', () => {
    render(<TextField {...baseProps} label={undefined} />);
    expect(screen.getByTestId('TextFieldTest')).toBeInTheDocument();
  });

  it('shows required asterisk when required is true', () => {
    render(<TextField {...baseProps} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders calendar icon when isCalender is true', () => {
    render(<TextField {...baseProps} isCalender />);
    expect(screen.getByTestId('TextFieldTest').querySelector('svg')).toBeInTheDocument();
  });

  it('renders error text when error prop is passed', () => {
    render(<TextField {...baseProps} error="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });
});
