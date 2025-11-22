import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('renders password toggle icon when type=password', () => {
    render(<TextField {...baseProps} type="password" />);

    // Icon button for toggling
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onChange when typing in input', () => {
    render(<TextField {...baseProps} />);

    const input = screen.getByPlaceholderText('Enter text here');

    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(baseProps.onChange).toHaveBeenCalledTimes(1);
  });

  it('renders disabled input when disabled=true', () => {
    render(<TextField {...baseProps} disabled />);

    const input = screen.getByPlaceholderText('Enter text here');
    expect(input).toBeDisabled();
  });

  it('passes maxLength & minLength to input', () => {
    render(<TextField {...baseProps} maxLength={10} minLength={3} />);

    const input = screen.getByPlaceholderText('Enter text here');

    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('minLength', '3');
  });

  it('applies autoCapitalize prop correctly', () => {
    render(<TextField {...baseProps} autoCapitalize="sentences" />);

    const input = screen.getByPlaceholderText('Enter text here');

    expect(input).toHaveAttribute('autoCapitalize', 'sentences');
  });

  it('supports defaultValue for uncontrolled input', () => {
    render(<TextField {...baseProps} defaultValue="Default Text" value={undefined} />);

    const input = screen.getByDisplayValue('Default Text');
    expect(input).toBeInTheDocument();
  });

  it('renders both password toggle and calendar icon when both conditions are true', () => {
    render(<TextField {...baseProps} type="password" isCalender />);

    // Two SVG icons expected: (Eye/EyeOff + Calendar)
    const svgIcons = screen.getAllByTestId('TextFieldTest')[0].querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThanOrEqual(2);
  });

  it('label is associated with the input via htmlFor', () => {
    render(<TextField {...baseProps} />);

    const label = screen.getByText('TextField Test');
    const input = screen.getByPlaceholderText('Enter text here');

    expect(label).toHaveAttribute('for', 'testFieldId');
    expect(input.id).toBe('testFieldId');
  });

  it('toggles password visibility on icon click', () => {
    render(<TextField {...baseProps} type="password" />);

    const input = screen.getByPlaceholderText('Enter text here');
    const toggleBtn = screen.getByRole('button');

    // Default type=password
    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleBtn);

    // After toggle → type should become text
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(toggleBtn);

    // Toggle back
    expect(input).toHaveAttribute('type', 'password');
  });
});
