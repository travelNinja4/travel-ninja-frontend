import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ROUTES, STRINGS } from '@/constants/strings';
import ForgotPasswordForm from './ForgotPasswordForm';

const push = vi.fn();
const showNotification = vi.fn();
const forgotPasswordAction = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/providers/NotificationProvider', () => ({
  useNotification: () => ({ showNotification }),
}));
vi.mock('@/actions/auth', () => ({
  forgotPasswordAction: (...args: unknown[]) => forgotPasswordAction(...args),
}));

describe('ForgotPasswordForm', () => {
  const email = () => screen.getByLabelText(STRINGS.WORK_EMAIL);
  const submit = () =>
    fireEvent.click(screen.getByRole('button', { name: STRINGS.SEND_RESET_LINK }));

  beforeEach(() => {
    vi.clearAllMocks();
    forgotPasswordAction.mockResolvedValue({ success: true });
  });

  it('renders the heading, field and back link from the design', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      STRINGS.RESET_YOUR_PASSWORD,
    );
    expect(screen.getByText(STRINGS.RESET_YOUR_PASSWORD_DESCRIPTION)).toBeInTheDocument();
    expect(email()).toHaveAttribute('placeholder', STRINGS.AGENCY_EMAIL_PLACEHOLDER);
    expect(screen.getByRole('link', { name: STRINGS.BACK_TO_SIGN_IN })).toHaveAttribute(
      'href',
      ROUTES.LOGIN,
    );
  });

  it('shows validation errors and does not call the API for an invalid email', async () => {
    render(<ForgotPasswordForm />);

    submit();
    expect(await screen.findByText('Please enter email address')).toBeInTheDocument();

    fireEvent.change(email(), { target: { value: 'not-an-email' } });
    submit();
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(forgotPasswordAction).not.toHaveBeenCalled();
  });

  it('sends the trimmed email, confirms and returns to sign in', async () => {
    render(<ForgotPasswordForm />);

    fireEvent.change(email(), { target: { value: '  ops@youragency.com ' } });
    submit();

    await waitFor(() => expect(push).toHaveBeenCalledWith(ROUTES.LOGIN));
    expect(forgotPasswordAction).toHaveBeenCalledWith({ email: 'ops@youragency.com' });
    expect(showNotification).toHaveBeenCalledWith(
      STRINGS.SUCCESS,
      STRINGS.RESET_LINK_INSTRUCTIONS,
      'success',
    );
  });

  it('shows each API error and stays on the page', async () => {
    forgotPasswordAction.mockResolvedValue({ success: false, errors: ['User not found'] });
    render(<ForgotPasswordForm />);

    fireEvent.change(email(), { target: { value: 'ops@youragency.com' } });
    submit();

    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith(STRINGS.ERROR, 'User not found', 'error'),
    );
    expect(push).not.toHaveBeenCalled();
  });
});
