import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { STRINGS } from '@/constants/strings';
import OtpVerification from './OtpVerification';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/auth';
import { useNotification } from '../../providers/NotificationProvider';

describe('Home', () => {
  /** Base props for OtpVerification **/
  const baseProps = {};

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('handles OTP resend and sets timer', async () => {
    (authService.sendOtp as jest.Mock).mockResolvedValue({});
    render(<OtpVerification />);
    const resendBtn = screen.getByText(/RESEND CODE/i);
    await act(async () => {
      fireEvent.click(resendBtn);
    });
    expect(authService.sendOtp).toHaveBeenCalled();
    expect(screen.getByText(/RESEND CODE IN 60 SECONDS/i)).toBeInTheDocument();
  });

  it('verifies email OTP and switches to mobile', async () => {
    (authService.verifyOtp as jest.Mock).mockResolvedValue({});
    render(<OtpVerification />);
    const input = screen.getByPlaceholderText('000000');
    fireEvent.change(input, { target: { value: '123456' } });
    const verifyBtn = screen.getByText(/VERIFY EMAIL/i);
    await act(async () => {
      fireEvent.click(verifyBtn);
    });
    expect(authService.verifyOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      otpCode: '123456',
    });
    expect(screen.getByText(/MOBILE NUMBER VERIFICATION/i)).toBeInTheDocument();
  });

  it('verifies mobile OTP and navigates to login', async () => {
    (authService.verifyOtp as jest.Mock).mockResolvedValue({});

    // Spy on hooks to access the internal mock functions
    const showNotificationSpy = jest.spyOn(
      require('../../providers/NotificationProvider'),
      'useNotification',
    );
    const pushSpy = jest.spyOn(require('next/navigation'), 'useRouter');

    // Make sure the spies return the same mocks used in the component
    const mockShowNotification = jest.fn();
    const mockPush = jest.fn();

    showNotificationSpy.mockReturnValue({ showNotification: mockShowNotification });
    pushSpy.mockReturnValue({ push: mockPush, replace: jest.fn(), prefetch: jest.fn() });

    render(<OtpVerification />);

    // Step 1: verify email to switch to mobile
    const emailInput = screen.getByPlaceholderText('000000');
    fireEvent.change(emailInput, { target: { value: '123456' } });
    await act(async () => fireEvent.click(screen.getByText(/VERIFY EMAIL/i)));

    // Step 2: verify mobile OTP
    const mobileInput = screen.getByPlaceholderText('000000');
    fireEvent.change(mobileInput, { target: { value: '654321' } });
    await act(async () => fireEvent.click(screen.getByText(/VERIFY MOBILE NUMBER/i)));

    expect(authService.verifyOtp).toHaveBeenCalled();
    expect(mockShowNotification).toHaveBeenCalledWith(
      'Success!',
      'Account created successfully',
      'success',
    );
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
