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

describe('OtpVerification', () => {
  /** Base props for OtpVerification **/
  const baseProps = {
    contact: { email: 'test@example.com', phoneNumber: '+1-1234567890' },
  };

  const enterCode = (code: string) => {
    fireEvent.change(screen.getByLabelText('Digit 1 of 6'), { target: { value: code } });
  };

  const submit = async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /verify and continue/i }));
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<OtpVerification {...baseProps} />);
    expect(screen.getByTestId('OtpVerificationTest')).toBeInTheDocument();
  });

  it('shows the email copy for email verification and the phone number for mobile', () => {
    const { rerender } = render(<OtpVerification {...baseProps} otpType="email" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Verify your email');
    expect(screen.getByText('test@example.com')).toBeInTheDocument();

    rerender(<OtpVerification {...baseProps} otpType="mobile" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Verify your mobile number',
    );
    expect(screen.getByText('+1-1234567890')).toBeInTheDocument();
  });

  it('shows the change link only when a destination is given', () => {
    const { rerender } = render(<OtpVerification {...baseProps} />);
    expect(screen.queryByRole('link', { name: /change email/i })).not.toBeInTheDocument();

    rerender(<OtpVerification {...baseProps} changeContactHref="/create-account" />);
    expect(screen.getByRole('link', { name: /change email/i })).toHaveAttribute(
      'href',
      '/create-account',
    );
  });

  it('submits the entered code with the OTP type', async () => {
    const onSubmit = vi.fn();
    render(<OtpVerification {...baseProps} onSubmit={onSubmit} />);
    enterCode('123456');
    await submit();
    expect(onSubmit).toHaveBeenCalledWith({ otpCode: '123456', otpType: 'email' });
  });

  it('shows an error instead of submitting an incomplete code, and clears it on edit', async () => {
    const onSubmit = vi.fn();
    render(<OtpVerification {...baseProps} onSubmit={onSubmit} />);
    enterCode('12');
    await submit();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter all 6 digits of the code.');

    enterCode('123456');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('resends the code and starts the cooldown', async () => {
    (sendOtpAction as Mock).mockResolvedValue({ success: true, data: undefined });
    render(<OtpVerification {...baseProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /resend code/i }));
    });
    expect(sendOtpAction).toHaveBeenCalledWith('email');
    expect(screen.getByText('Resend code in 60s')).toBeInTheDocument();
    expect(mockShowNotification).toHaveBeenCalledWith(
      'Success!',
      'A new code is on its way.',
      'success',
    );
  });

  it('shows an error and keeps the resend button when resend fails', async () => {
    (sendOtpAction as Mock).mockResolvedValue({ success: false, errors: ['Too many requests'] });
    render(<OtpVerification {...baseProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /resend code/i }));
    });

    expect(mockShowNotification).toHaveBeenCalledWith('Error!', 'Too many requests', 'error');
    expect(screen.getByRole('button', { name: /resend code/i })).toBeInTheDocument();
  });

  it('locks the code input and resend while verifying', () => {
    render(<OtpVerification {...baseProps} loading />);
    expect(screen.getByLabelText('Digit 1 of 6')).toBeDisabled();
    expect(screen.getByRole('button', { name: /resend code/i })).toBeDisabled();
  });
});
