import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { STRINGS } from '@/constants/strings';
import OtpVerification from './OtpVerification';

describe('Home', () => {
  /** Base props for OtpVerification **/
  const baseProps = {};

  /**
   * @test
   * Renders the OtpVerification component without throwing an error
   * and checks if the OtpVerificationTest text is present in the document.
   *
   * This ensures that the component loads correctly with the base props.
   */
  it('renders without crashing', () => {
    render(<OtpVerification {...baseProps} />);
    expect(screen.getByTestId('OtpVerificationTest')).toBeInTheDocument();
  });

  /**
   * @test
   * Ensures that the OtpVerification component renders without throwing any runtime errors.
   *
   * This is a safety check to confirm that the component can mount successfully
   * with the provided base props, even if it does not render any visible content.
   */
  it('renders without throwing', () => {
    expect(() => render(<OtpVerification {...baseProps} />)).not.toThrow();
  });

  /**
   * @test
   * Captures a snapshot of the OtpVerification component with base props
   * and ensures it matches the previously stored snapshot.
   *
   * This helps detect any unexpected UI changes.
   */
  it('matches snapshot', () => {
    const { asFragment } = render(<OtpVerification {...baseProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('calls handleResend and starts timer', () => {
    jest.useFakeTimers();
    render(<OtpVerification {...baseProps} />);
    fireEvent.click(screen.getByText(/Resend Code/i));

    expect(screen.getByText(`${STRINGS.RESEND_CODE} 60 ${STRINGS.SECONDS}`)).toBeInTheDocument();

    // Fast-forward 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(`${STRINGS.RESEND_CODE} 59 ${STRINGS.SECONDS}`)).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('updates value when code is typed', () => {
    render(<OtpVerification {...baseProps} />);
    const input = screen.getByPlaceholderText('000000');
    fireEvent.change(input, { target: { value: '123456' } });
    expect(input).toHaveValue('123456');
  });

  it('does nothing if verify clicked with empty value', () => {
    render(<OtpVerification {...baseProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText(STRINGS.EMAIL_VERIFICATION)).toBeInTheDocument();
  });

  it('switches from email to mobile on verify with value', () => {
    render(<OtpVerification {...baseProps} />);
    const input = screen.getByPlaceholderText('000000');
    fireEvent.change(input, { target: { value: '123456' } });

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText(STRINGS.MOBILE_NUMBER_VERIFICATION)).toBeInTheDocument();
  });
});
