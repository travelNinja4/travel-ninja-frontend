import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { verifyOtpAction } from '../../../actions/auth';
import CreateAccountVerify from './CreateAccountVerify';

const mockShowNotification = jest.fn();
const mockPush = jest.fn();

jest.mock('../../../providers/NotificationProvider', () => ({
  useNotification: () => ({ showNotification: mockShowNotification }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), prefetch: jest.fn() }),
}));

describe('CreateAccountVerify', () => {
  const contact = { email: 'test@example.com', phoneNumber: '+1-1234567890' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const enterCodeAndVerify = async (code: string, buttonText: RegExp) => {
    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: code } });
    await act(async () => {
      fireEvent.click(screen.getByText(buttonText));
    });
  };

  it('verifies email OTP and switches to mobile', async () => {
    (verifyOtpAction as jest.Mock).mockResolvedValue({ success: true, data: undefined });
    render(<CreateAccountVerify contact={contact} />);

    await enterCodeAndVerify('123456', /VERIFY EMAIL/i);

    expect(verifyOtpAction).toHaveBeenCalledWith('email', '123456');
    expect(screen.getByText(/MOBILE NUMBER VERIFICATION/i)).toBeInTheDocument();
  });

  it('verifies mobile OTP and navigates to login', async () => {
    (verifyOtpAction as jest.Mock).mockResolvedValue({ success: true, data: undefined });

    render(<CreateAccountVerify contact={contact} />);
    await enterCodeAndVerify('123456', /VERIFY EMAIL/i);
    await enterCodeAndVerify('654321', /VERIFY MOBILE NUMBER/i);

    expect(verifyOtpAction).toHaveBeenLastCalledWith('mobile', '654321');
    expect(mockShowNotification).toHaveBeenCalledWith(
      'Success!',
      'Account created successfully',
      'success',
    );
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('shows the error and stays on email verification when the code is wrong', async () => {
    (verifyOtpAction as jest.Mock).mockResolvedValue({ success: false, errors: ['Invalid OTP'] });

    render(<CreateAccountVerify contact={contact} />);
    await enterCodeAndVerify('000000', /VERIFY EMAIL/i);

    expect(mockShowNotification).toHaveBeenCalledWith('Error!', 'Invalid OTP', 'error');
    expect(screen.getByText(/EMAIL VERIFICATION/i)).toBeInTheDocument();
  });
});
