import { fireEvent, render, screen } from '@testing-library/react';
import SecuritySettings from './SecuritySettings';
import { MOCK_SESSIONS } from './SecuritySettings.mocks';

describe('SecuritySettings', () => {
  it('renders the password fields', () => {
    render(<SecuritySettings sessions={MOCK_SESSIONS} />);
    expect(screen.getByLabelText('Current password')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update password' })).toBeInTheDocument();
  });

  it('lists every session and marks the current one', () => {
    render(<SecuritySettings sessions={MOCK_SESSIONS} />);
    // Header row + one row per session
    expect(screen.getAllByRole('row')).toHaveLength(MOCK_SESSIONS.length + 1);
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('offers Revoke on every session but the current one', () => {
    const onRevoke = vi.fn();
    render(<SecuritySettings sessions={MOCK_SESSIONS} onRevoke={onRevoke} />);
    const revokeButtons = screen.getAllByRole('button', { name: 'Revoke' });
    expect(revokeButtons).toHaveLength(MOCK_SESSIONS.length - 1);

    fireEvent.click(revokeButtons[0]);
    expect(onRevoke).toHaveBeenCalledWith(MOCK_SESSIONS[1]);
  });

  it('shows a message when there are no sessions', () => {
    render(<SecuritySettings sessions={[]} />);
    expect(screen.getByText('No other devices are signed in.')).toBeInTheDocument();
  });
});
