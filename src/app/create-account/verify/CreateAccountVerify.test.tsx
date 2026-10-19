import type { Mock } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { verifyOtpAction } from '../../../actions/auth';
import CreateAccountVerify from './CreateAccountVerify';

// vi.mock is hoisted above these declarations, so the mocks it uses must be hoisted too
const { mockShowNotification, mockPush } = vi.hoisted(() => ({
  mockShowNotification: vi.fn(),
  mockPush: vi.fn(),
}));

vi.mock('../../../actions/auth', () => ({ verifyOtpAction: vi.fn() }));

vi.mock('../../../providers/NotificationProvider', () => ({
  useNotification: () => ({ showNotification: mockShowNotification }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn(), prefetch: vi.fn() }),
}));

describe('CreateAccountVerify', () => {
  const contact = { email: 'test@example.com', phoneNumber: '+1-1234567890' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const enterCodeAndVerify = async (code: string) => {
    fireEvent.change(screen.getByLabelText('Digit 1 of 6'), { target: { value: code } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /verify and continue/i }));
    });
  };

  it('verifies email OTP and switches to mobile', async () => {
    (verifyOtpAction as Mock).mockResolvedValue({ success: true, data: undefined });
    render(<CreateAccountVerify contact={contact} />);

    await enterCodeAndVerify('123456');

    expect(verifyOtpAction).toHaveBeenCalledWith('email', '123456');
    expect(screen.getByRole('heading', { name: /verify your mobile number/i })).toBeInTheDocument();
  });

  it('verifies mobile OTP and navigates to login', async () => {
    (verifyOtpAction as Mock).mockResolvedValue({ success: true, data: undefined });

    render(<CreateAccountVerify contact={contact} />);
    await enterCodeAndVerify('123456');
    await enterCodeAndVerify('654321');

    expect(verifyOtpAction).toHaveBeenLastCalledWith('mobile', '654321');
    expect(mockShowNotification).toHaveBeenCalledWith(
      'Success!',
      'Account created successfully',
      'success',
    );
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('shows the error and stays on email verification when the code is wrong', async () => {
    (verifyOtpAction as Mock).mockResolvedValue({ success: false, errors: ['Invalid OTP'] });

    render(<CreateAccountVerify contact={contact} />);
    await enterCodeAndVerify('000000');

    expect(mockShowNotification).toHaveBeenCalledWith('Error!', 'Invalid OTP', 'error');
    expect(screen.getByRole('heading', { name: /verify your email/i })).toBeInTheDocument();
  });
});
