import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ROUTES, STRINGS } from '@/constants/strings';
import { Country } from '@/constants/types';
import CreateAccountForm from './CreateAccountForm';

const push = vi.fn();
const showNotification = vi.fn();
const registerAction = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/providers/NotificationProvider', () => ({
  useNotification: () => ({ showNotification }),
}));
vi.mock('@/actions/auth', () => ({
  registerAction: (...args: unknown[]) => registerAction(...args),
}));

const countries: Country[] = [
  { name: 'United States', code: '+1 (US)', length: 10 },
  { name: 'India', code: '+91 (IN)', length: 10 },
];

describe('CreateAccountForm', () => {
  // Labels end with a required "*", and "Password" is also part of "Confirm password"
  const field = (label: string) => screen.getByLabelText(new RegExp(`^${label}`));
  const change = (label: string, value: string) =>
    fireEvent.change(field(label), { target: { value } });
  const submit = () =>
    fireEvent.click(screen.getByRole('button', { name: STRINGS.CREATE_ACCOUNT }));

  const fillValid = () => {
    change(STRINGS.AGENCY_NAME, 'Wanderly Travels');
    change(STRINGS.CONTACT_PERSON_NAME, 'Asha Rao');
    change(STRINGS.BUSINESS_EMAIL, 'ops@youragency.com');
    change(STRINGS.MOBILE_NUMBER, '9876543210');
    change(STRINGS.PASSWORD, 'Secret@123');
    change(STRINGS.CONFIRM_PASSWORD, 'Secret@123');
    fireEvent.click(screen.getByRole('checkbox'));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    registerAction.mockResolvedValue({ success: true });
  });

  it('renders the heading, India as the default country and the sign in link', () => {
    render(<CreateAccountForm countries={countries} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      STRINGS.CREATE_ACCOUNT_HEADING,
    );
    expect(screen.getByRole('combobox')).toHaveValue('India');
    expect(screen.getByText('+91')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: STRINGS.SIGN_IN })).toHaveAttribute(
      'href',
      ROUTES.LOGIN,
    );
  });

  it('shows validation errors and does not call the API when empty', async () => {
    render(<CreateAccountForm countries={countries} />);

    submit();
    expect(await screen.findByText('Agency name is required')).toBeInTheDocument();
    expect(screen.getByText('You must accept the terms')).toBeInTheDocument();
    expect(registerAction).not.toHaveBeenCalled();
  });

  it('rejects mismatched passwords and a short mobile number', async () => {
    render(<CreateAccountForm countries={countries} />);

    fillValid();
    change(STRINGS.MOBILE_NUMBER, '98765');
    change(STRINGS.CONFIRM_PASSWORD, 'Secret@124');
    submit();

    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(screen.getByText('Mobile number must be 10 digits')).toBeInTheDocument();
    expect(registerAction).not.toHaveBeenCalled();
  });

  it('registers the agency and moves on to verification', async () => {
    render(<CreateAccountForm countries={countries} />);

    fillValid();
    submit();

    await waitFor(() => expect(push).toHaveBeenCalledWith(ROUTES.VERIFY));
    expect(registerAction).toHaveBeenCalledWith({
      fullName: 'Asha Rao',
      agencyName: 'Wanderly Travels',
      email: 'ops@youragency.com',
      password: 'Secret@123',
      country: 'India',
      phoneNumber: '+91-9876543210',
      termStatus: true,
      role: 'agency',
    });
  });

  it('shows each API error and stays on the page', async () => {
    registerAction.mockResolvedValue({ success: false, errors: ['Email already registered'] });
    render(<CreateAccountForm countries={countries} />);

    fillValid();
    submit();

    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith(
        STRINGS.ERROR,
        'Email already registered',
        'error',
      ),
    );
    expect(push).not.toHaveBeenCalled();
  });
});
