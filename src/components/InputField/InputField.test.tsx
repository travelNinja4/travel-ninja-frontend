import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from './InputField';

describe('InputField', () => {
  /** Base props for InputField **/
  const baseProps = {
    label: 'Work email',
    id: 'email',
    name: 'email',
    placeholder: 'ops@wanderlytravels.example',
  };

  /**
   * @test
   * Renders the InputField component without throwing an error
   * and checks if the InputFieldTest element is present in the document.
   */
  it('renders without crashing', () => {
    render(<InputField {...baseProps} />);
    expect(screen.getByTestId('InputFieldTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Captures a snapshot of the InputField with base props to detect unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<InputField {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('associates the label with the input', () => {
    render(<InputField {...baseProps} />);
    expect(screen.getByLabelText('Work email')).toHaveAttribute('id', 'email');
  });

  it('generates an id for the label when none is passed', () => {
    render(<InputField {...baseProps} id={undefined} />);
    expect(screen.getByLabelText('Work email')).toHaveAttribute('id');
  });

  it('renders without a label', () => {
    render(<InputField {...baseProps} label={undefined} />);
    expect(screen.queryByText('Work email')).not.toBeInTheDocument();
  });

  it('shows a required marker when required', () => {
    render(<InputField {...baseProps} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(baseProps.placeholder)).toBeRequired();
  });

  it('shows the error message and marks the input invalid', () => {
    render(
      <InputField {...baseProps} error="Enter a valid email" helperText="We never share it" />,
    );
    const input = screen.getByPlaceholderText(baseProps.placeholder);

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
    expect(screen.queryByText('We never share it')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-message');
  });

  it('shows helper text when there is no error', () => {
    render(<InputField {...baseProps} helperText="We never share it" />);
    expect(screen.getByText('We never share it')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(baseProps.placeholder)).not.toHaveAttribute('aria-invalid');
  });

  it('renders left and right icons', () => {
    render(
      <InputField
        {...baseProps}
        leftIcon={<svg data-testid="left" />}
        rightIcon={<svg data-testid="right" />}
      />,
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('keeps an interactive right icon reachable by assistive tech', () => {
    render(<InputField {...baseProps} rightIcon={<button aria-label="Clear email">×</button>} />);
    expect(screen.getByRole('button', { name: 'Clear email' })).toBeInTheDocument();
  });

  it('focuses the input when an icon in the field is clicked', () => {
    render(<InputField {...baseProps} leftIcon={<svg data-testid="left" />} />);
    fireEvent.mouseDown(screen.getByTestId('left'));
    expect(screen.getByPlaceholderText(baseProps.placeholder)).toHaveFocus();
  });

  it('does not steal focus from an interactive right icon', () => {
    render(<InputField {...baseProps} rightIcon={<button aria-label="Clear email">×</button>} />);
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Clear email' }));
    expect(screen.getByPlaceholderText(baseProps.placeholder)).not.toHaveFocus();
  });

  it('does not focus a disabled input when the field is clicked', () => {
    render(<InputField {...baseProps} disabled leftIcon={<svg data-testid="left" />} />);
    fireEvent.mouseDown(screen.getByTestId('left'));
    expect(screen.getByPlaceholderText(baseProps.placeholder)).not.toHaveFocus();
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<InputField {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText(baseProps.placeholder), {
      target: { value: 'a@b.co' },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('passes native attributes through to the input', () => {
    render(<InputField {...baseProps} maxLength={10} disabled autoComplete="email" />);
    const input = screen.getByPlaceholderText(baseProps.placeholder);

    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('autoComplete', 'email');
    expect(input).toBeDisabled();
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<InputField {...baseProps} ref={ref} />);
    expect(ref.current).toBe(screen.getByPlaceholderText(baseProps.placeholder));
  });

  it('toggles password visibility and replaces the right icon', () => {
    render(
      <InputField
        {...baseProps}
        type="password"
        placeholder="Enter password"
        rightIcon={<svg data-testid="right" />}
      />,
    );
    const input = screen.getByPlaceholderText('Enter password');
    const toggle = screen.getByRole('button', { name: 'Show password' });

    expect(screen.queryByTestId('right')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
  });
});
