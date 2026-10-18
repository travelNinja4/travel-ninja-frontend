import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckBox from './CheckBox';

describe('CheckBox', () => {
  /** Base props for CheckBox **/
  const baseProps = {
    label: 'Accept terms',
    name: 'termStatus',
  };

  /**
   * @test
   * Renders the CheckBox component without throwing an error
   * and checks if the CheckBoxTest element is present in the document.
   */
  it('renders without crashing', () => {
    render(<CheckBox {...baseProps} />);
    expect(screen.getByTestId('CheckBoxTest')).toBeInTheDocument();
  });

  it('associates the label with the checkbox', () => {
    render(<CheckBox {...baseProps} />);
    expect(screen.getByLabelText('Accept terms')).toBe(screen.getByRole('checkbox'));
  });

  it('uses the passed id, or a stable generated one', () => {
    const { rerender } = render(<CheckBox {...baseProps} id="terms" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'terms');

    rerender(<CheckBox {...baseProps} />);
    const generated = screen.getByRole('checkbox').id;
    expect(generated).toBeTruthy();
    rerender(<CheckBox {...baseProps} />);
    expect(screen.getByRole('checkbox').id).toBe(generated);
  });

  it('gives each checkbox a unique id even when names match', () => {
    render(
      <>
        <CheckBox name="tour" label="Goa" />
        <CheckBox name="tour" label="Kerala" />
      </>,
    );
    const [first, second] = screen.getAllByRole('checkbox');
    expect(first.id).not.toBe(second.id);
  });

  it('renders without a label', () => {
    render(<CheckBox name="bare" aria-label="Select row" />);
    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument();
  });

  it('renders a React node label with links', () => {
    render(
      <CheckBox
        name="terms"
        label={
          <>
            I agree to the <a href="/terms">Terms of Service</a>
          </>
        }
      />,
    );
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveAccessibleName('I agree to the Terms of Service');
  });

  it('calls onChange with the new checked state and the event', () => {
    const onChange = vi.fn();
    render(<CheckBox {...baseProps} onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true, expect.objectContaining({ type: 'change' }));
  });

  it('toggles when the label is clicked', () => {
    render(<CheckBox {...baseProps} />);
    fireEvent.click(screen.getByText('Accept terms'));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('works uncontrolled with defaultChecked', () => {
    render(<CheckBox {...baseProps} defaultChecked />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('stays in sync with the parent when controlled', () => {
    const { rerender } = render(<CheckBox {...baseProps} checked={false} onChange={vi.fn()} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(<CheckBox {...baseProps} checked onChange={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<CheckBox {...baseProps} disabled onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets the indeterminate DOM property and updates it', () => {
    const { rerender } = render(<CheckBox {...baseProps} indeterminate />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);

    rerender(<CheckBox {...baseProps} indeterminate={false} />);
    expect(input.indeterminate).toBe(false);
  });

  it('shows a required marker and sets required on the input', () => {
    render(<CheckBox {...baseProps} required />);
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('checkbox')).toBeRequired();
  });

  it('shows the error message and marks the input invalid', () => {
    render(<CheckBox {...baseProps} id="terms" error="You must accept" helperText="Read first" />);
    const checkbox = screen.getByRole('checkbox');

    expect(screen.getByRole('alert')).toHaveTextContent('You must accept');
    expect(screen.queryByText('Read first')).not.toBeInTheDocument();
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-describedby', 'terms-message');
  });

  it('shows helper text when there is no error', () => {
    render(<CheckBox {...baseProps} helperText="You can change this later" />);
    expect(screen.getByText('You can change this later')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
  });

  it('forwards object and callback refs to the input', () => {
    const objectRef = createRef<HTMLInputElement>();
    const { unmount } = render(<CheckBox {...baseProps} ref={objectRef} />);
    expect(objectRef.current).toBe(screen.getByRole('checkbox'));
    unmount();

    const callbackRef = vi.fn();
    render(<CheckBox {...baseProps} ref={callbackRef} />);
    expect(callbackRef).toHaveBeenCalledWith(screen.getByRole('checkbox'));
  });

  it('passes native attributes through to the input', () => {
    const onBlur = vi.fn();
    render(<CheckBox {...baseProps} value="yes" onBlur={onBlur} data-track="terms" />);
    const checkbox = screen.getByRole('checkbox');

    fireEvent.blur(checkbox);

    expect(checkbox).toHaveAttribute('name', 'termStatus');
    expect(checkbox).toHaveAttribute('value', 'yes');
    expect(checkbox).toHaveAttribute('data-track', 'terms');
    expect(onBlur).toHaveBeenCalled();
  });

  it('applies custom class names', () => {
    render(<CheckBox {...baseProps} className="wrapper" labelClassName="text" />);
    expect(screen.getByTestId('CheckBoxTest')).toHaveClass('wrapper');
    expect(screen.getByText('Accept terms')).toHaveClass('text');
  });
});
