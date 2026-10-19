import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ROUTES, STRINGS } from '@/constants/strings';
import LoginForm from './LoginForm';

const push = vi.fn();
const showNotification = vi.fn();
const loginAction = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/providers/NotificationProvider', () => ({
  useNotification: () => ({ showNotification }),
}));
vi.mock('@/actions/auth', () => ({
  loginAction: (...args: unknown[]) => loginAction(...args),
}));

describe('LoginForm', () => {
  const email = () => screen.getByLabelText(STRINGS.WORK_EMAIL);
  const password = () => screen.getByLabelText(STRINGS.PASSWORD);
  const submit = () => fireEvent.click(screen.getByRole('button', { name: STRINGS.SIGN_IN }));

  const fillValid = () => {
    fireEvent.change(email(), { target: { value: 'ops@wanderlytravels.example' } });
    fireEvent.change(password(), { target: { value: 'secret123' } });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    loginAction.mockResolvedValue({ success: true });
  });

  /**
   * @test
   * Renders the LoginForm component without throwing an error
   * and checks if the LoginFormTest element is present in the document.
   */
  it('renders without crashing', () => {
    render(<LoginForm />);
    expect(screen.getByTestId('LoginFormTest')).toBeInTheDocument();
  });

  it('renders the heading, fields and links from the design', () => {
    render(<LoginForm />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(STRINGS.SIGN_IN_HEADING);
    expect(screen.getByText(STRINGS.SIGN_IN_DESCRIPTION)).toBeInTheDocument();
    expect(email()).toHaveAttribute('type', 'email');
    expect(email()).toHaveAttribute('autocomplete', 'username');
    expect(password()).toHaveAttribute('type', 'password');
    expect(password()).toHaveAttribute('autocomplete', 'current-password');
    expect(screen.getByRole('checkbox', { name: STRINGS.REMEMBER_ME })).not.toBeChecked();
    expect(screen.getByRole('link', { name: STRINGS.FORGOT_PASSWORD_LINK })).toHaveAttribute(
      'href',
      ROUTES.FORGOT_PASSWORD,
    );
    expect(screen.getByRole('link', { name: STRINGS.CREATE_AN_ACCOUNT })).toHaveAttribute(
      'href',
      ROUTES.CREATE_ACCOUNT,
    );
  });

  it('shows validation errors and does not call the API when empty', async () => {
    render(<LoginForm />);
    submit();

    expect(await screen.findByText('Please enter email address')).toBeInTheDocument();
    expect(screen.getByText('Please enter valid password')).toBeInTheDocument();
    expect(email()).toHaveAttribute('aria-invalid', 'true');
    expect(loginAction).not.toHaveBeenCalled();
  });

  it('rejects an invalid email', async () => {
    render(<LoginForm />);
    fireEvent.change(email(), { target: { value: 'not-an-email' } });
    fireEvent.change(password(), { target: { value: 'secret123' } });
    submit();

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(loginAction).not.toHaveBeenCalled();
  });

  it('logs in without remember me by default', async () => {
    render(<LoginForm />);
    fillValid();
    submit();

    await waitFor(() =>
      expect(loginAction).toHaveBeenCalledWith({
        email: 'ops@wanderlytravels.example',
        password: 'secret123',
        rememberMe: false,
      }),
    );
  });

  it('logs in with remember me ticked, then goes to the dashboard', async () => {
    render(<LoginForm />);
    fillValid();
    fireEvent.click(screen.getByRole('checkbox', { name: STRINGS.REMEMBER_ME }));
    submit();

    await waitFor(() => expect(push).toHaveBeenCalledWith(ROUTES.DASHBOARD));
    expect(loginAction).toHaveBeenCalledWith({
      email: 'ops@wanderlytravels.example',
      password: 'secret123',
      rememberMe: true,
    });
    expect(showNotification).toHaveBeenCalledWith(
      STRINGS.SUCCESS,
      STRINGS.LOGGED_IN_SUCCESSFUL,
      'success',
    );
  });

  it('trims spaces around the email', async () => {
    render(<LoginForm />);
    fireEvent.change(email(), { target: { value: '  ops@wanderlytravels.example ' } });
    fireEvent.change(password(), { target: { value: 'secret123' } });
    submit();

    await waitFor(() =>
      expect(loginAction).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'ops@wanderlytravels.example' }),
      ),
    );
  });

  it('shows each server error as a toast and stays on the page', async () => {
    loginAction.mockResolvedValue({ success: false, errors: ['Invalid credentials', 'Locked'] });
    render(<LoginForm />);
    fillValid();
    submit();

    await waitFor(() => expect(showNotification).toHaveBeenCalledTimes(2));
    expect(showNotification).toHaveBeenCalledWith(STRINGS.ERROR, 'Invalid credentials', 'error');
    expect(push).not.toHaveBeenCalled();
  });

  it('disables the form while signing in', async () => {
    let resolve: (value: { success: boolean }) => void = () => {};
    loginAction.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<LoginForm />);
    fillValid();
    submit();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: STRINGS.SIGN_IN })).toBeDisabled(),
    );
    expect(email()).toBeDisabled();
    expect(password()).toBeDisabled();

    resolve({ success: true });
    await waitFor(() => expect(push).toHaveBeenCalled());
  });
});
