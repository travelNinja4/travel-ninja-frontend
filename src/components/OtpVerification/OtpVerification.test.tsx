import type { Mock } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { sendOtpAction } from '../../actions/auth';
import OtpVerification from './OtpVerification';

// vi.mock is hoisted above this declaration, so the mock it uses must be hoisted too
const { mockShowNotification } = vi.hoisted(() => ({ mockShowNotification: vi.fn() }));

vi.mock('../../actions/auth', () => ({ sendOtpAction: vi.fn() }));

vi.mock('../../providers/NotificationProvider', () => ({
  useNotification: () => ({ showNotification: mockShowNotification }),
}));

describe('Home', () => {
  /** Base props for OtpVerification **/
  const baseProps = {
    contact: { email: 'test@example.com', phoneNumber: '+1-1234567890' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('shows the email for email verification and the phone number for mobile', () => {
    const { rerender } = render(<OtpVerification {...baseProps} otpType="email" />);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    rerender(<OtpVerification {...baseProps} otpType="mobile" />);
    expect(screen.getByText('+1-1234567890')).toBeInTheDocument();
    expect(screen.getByText(/VERIFY MOBILE NUMBER/i)).toBeInTheDocument();
  });

  it('handles OTP resend and sets timer', async () => {
    (sendOtpAction as Mock).mockResolvedValue({ success: true, data: undefined });
    render(<OtpVerification {...baseProps} />);
    await act(async () => {
      fireEvent.click(screen.getByText(/RESEND CODE/i));
    });
    expect(sendOtpAction).toHaveBeenCalledWith('email');
    expect(screen.getByText(/RESEND CODE IN 60 SECONDS/i)).toBeInTheDocument();
  });

  it('shows an error and keeps the resend link when resend fails', async () => {
    (sendOtpAction as Mock).mockResolvedValue({
      success: false,
      errors: ['Too many requests'],
    });

    render(<OtpVerification {...baseProps} />);
    await act(async () => {
      fireEvent.click(screen.getByText(/RESEND CODE/i));
    });

    expect(mockShowNotification).toHaveBeenCalledWith('Error!', 'Too many requests', 'error');
    expect(screen.getByText(/RESEND CODE/i)).toBeInTheDocument();
  });

  it('submits the entered code with the OTP type', async () => {
    const onSubmit = vi.fn();
    render(<OtpVerification {...baseProps} onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '123456' } });
    await act(async () => {
      fireEvent.click(screen.getByText(/VERIFY EMAIL/i));
    });
    expect(onSubmit).toHaveBeenCalledWith({ otpCode: '123456', otpType: 'email' });
  });

  it('does not submit when no code is entered', async () => {
    const onSubmit = vi.fn();
    render(<OtpVerification {...baseProps} onSubmit={onSubmit} />);
    await act(async () => {
      fireEvent.click(screen.getByText(/VERIFY EMAIL/i));
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
