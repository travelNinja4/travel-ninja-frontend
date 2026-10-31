import { createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MobileNumberInput, { toNationalNumber } from './MobileNumberInput';

describe('MobileNumberInput', () => {
  /** Base props for MobileNumberInput **/
  const baseProps = {
    label: 'Mobile number',
    name: 'mobileNumber',
  };

  const input = () => screen.getByLabelText('Mobile number') as HTMLInputElement;

  /**
   * @test
   * Renders the MobileNumberInput component without throwing an error
   * and checks if the MobileNumberInputTest element is present in the document.
   */
  it('renders without crashing', () => {
    render(<MobileNumberInput {...baseProps} />);
    expect(screen.getByTestId('MobileNumberInputTest')).toBeInTheDocument();
  });

  it('shows +91 by default', () => {
    render(<MobileNumberInput {...baseProps} />);
    expect(screen.getByText('+91')).toBeInTheDocument();
  });

  it('shows the dial code it is given', () => {
    render(<MobileNumberInput {...baseProps} dialCode="+971" />);
    expect(screen.getByText('+971')).toBeInTheDocument();
  });

  it('brings up the phone keypad and national-number autofill', () => {
    render(<MobileNumberInput {...baseProps} />);
    expect(input()).toHaveAttribute('type', 'tel');
    expect(input()).toHaveAttribute('inputmode', 'numeric');
    expect(input()).toHaveAttribute('autocomplete', 'tel-national');
  });

  it('passes the cleaned number to onChange', () => {
    const onChange = vi.fn();
    render(<MobileNumberInput {...baseProps} onChange={onChange} />);
    fireEvent.change(input(), { target: { value: '+91 98765 43210' } });
    expect(onChange.mock.calls[0][0].target.value).toBe('9876543210');
    expect(input()).toHaveValue('9876543210');
  });

  it('forwards its ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<MobileNumberInput {...baseProps} ref={ref} />);
    expect(ref.current).toBe(input());
  });

  it('shows an error', () => {
    render(<MobileNumberInput {...baseProps} error="Enter a valid mobile number" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid mobile number');
    expect(input()).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('toNationalNumber', () => {
  it.each([
    ['9876543210', '9876543210'],
    ['98765 43210', '9876543210'],
    ['+91 98765 43210', '9876543210'],
    ['+91-9876543210', '9876543210'],
    ['919876543210', '9876543210'],
    ['09876543210', '9876543210'],
    ['98a76', '9876'],
    ['987654321099', '9876543210'],
  ])('turns %j into %j', (value, expected) => {
    expect(toNationalNumber(value)).toBe(expected);
  });

  it('keeps a short number starting with 91 as typed', () => {
    expect(toNationalNumber('9198')).toBe('9198');
  });

  it('uses the given dial code and length', () => {
    expect(toNationalNumber('+971 50 123 4567', '+971', 9)).toBe('501234567');
  });
});
