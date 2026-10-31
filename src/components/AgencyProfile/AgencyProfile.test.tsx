import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { AGENCY_PREVIEW, AGENCY_PROFILE } from '@/constants/strings';
import type { AgencyProfileValues } from '@/constants/types';
import AgencyProfile from './AgencyProfile';
import { MOCK_STATES, mockGetDistricts } from './AgencyProfile.mocks';

describe('AgencyProfile', () => {
  // A partly filled profile; the tests pick the state
  const setup = (
    profile: Partial<AgencyProfileValues> = {
      name: 'Wanderly Travels',
      street: '12 MG Road',
      city: 'Bengaluru',
    },
  ) => {
    const onSave = vi.fn();
    const getDistricts = vi.fn(mockGetDistricts);
    render(
      <AgencyProfile
        profile={profile}
        states={MOCK_STATES}
        getDistricts={getDistricts}
        onSave={onSave}
      />,
    );
    return { onSave, getDistricts };
  };

  const field = (label: string) => screen.getByLabelText(label, { exact: false });
  const save = () => fireEvent.click(screen.getByRole('button', { name: AGENCY_PROFILE.SAVE }));
  const pick = (label: string, option: string) => {
    fireEvent.click(field(label));
    fireEvent.click(screen.getByRole('option', { name: option }));
  };

  it('renders the header, welcome banner and both cards', () => {
    setup();
    expect(
      screen.getByRole('heading', { level: 1, name: AGENCY_PROFILE.TITLE }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: `${AGENCY_PROFILE.WELCOME}, Wanderly Travels` }),
    ).toBeInTheDocument();
    [AGENCY_PROFILE.IDENTITY, AGENCY_PROFILE.CONTACT].forEach((name) =>
      expect(screen.getByRole('region', { name })).toBeInTheDocument(),
    );
  });

  it('shows the initials until a logo is picked', () => {
    setup();
    // In the Logo field and on the preview card
    expect(screen.getAllByText('WT')).toHaveLength(2);
    expect(screen.getByText(AGENCY_PROFILE.LOGO_HINT)).toBeInTheDocument();
  });

  it('counts the filled items and the tagline length', () => {
    setup();
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '17');
    expect(screen.getByText('1 of 6')).toBeInTheDocument();

    fireEvent.change(field(AGENCY_PROFILE.TAGLINE), { target: { value: 'Slow travel' } });
    expect(screen.getByText('11 / 60')).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuenow', '33');
  });

  it('takes destinations as plain text and counts them towards the profile', async () => {
    const { onSave } = setup();
    fireEvent.change(field(AGENCY_PROFILE.DESTINATIONS), {
      target: { value: 'Karnataka, Kerala' },
    });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '33');

    pick(AGENCY_PROFILE.STATE, 'Karnataka');
    save();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ destinations: 'Karnataka, Kerala' }),
    );
  });

  it('saves with every field empty', async () => {
    const { onSave } = setup({});
    save();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it('needs valid contact details to save', async () => {
    const { onSave } = setup({});
    fireEvent.change(field(AGENCY_PROFILE.WEBSITE), { target: { value: 'wandertrails' } });
    fireEvent.change(field(AGENCY_PROFILE.PIN), { target: { value: '5600' } });
    save();

    expect(await screen.findByText(AGENCY_PROFILE.INVALID_WEBSITE)).toBeInTheDocument();
    expect(screen.getByText(AGENCY_PROFILE.INVALID_PIN)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows the registered email and phone read-only', () => {
    setup({ email: 'hello@wandertrails.in', phone: '+91-9876543210' });
    expect(field(AGENCY_PROFILE.EMAIL)).toHaveAttribute('readonly');
    expect(field(AGENCY_PROFILE.EMAIL)).toHaveValue('hello@wandertrails.in');
    expect(field(AGENCY_PROFILE.PHONE)).toHaveAttribute('readonly');
    expect(screen.getAllByText(AGENCY_PROFILE.FROM_REGISTRATION)).toHaveLength(2);
  });

  it('loads the picked state’s districts and clears the district when the state changes', async () => {
    const { onSave, getDistricts } = setup();
    expect(field(AGENCY_PROFILE.DISTRICT)).toBeDisabled();

    pick(AGENCY_PROFILE.STATE, 'Karnataka');
    expect(getDistricts).toHaveBeenCalledWith(1);
    await waitFor(() => expect(field(AGENCY_PROFILE.DISTRICT)).toBeEnabled());
    fireEvent.click(field(AGENCY_PROFILE.DISTRICT));
    fireEvent.click(await screen.findByRole('option', { name: 'Mysuru' }));

    pick(AGENCY_PROFILE.STATE, 'Kerala');
    expect(getDistricts).toHaveBeenLastCalledWith(2);
    fireEvent.click(field(AGENCY_PROFILE.DISTRICT));
    expect(await screen.findByRole('option', { name: 'Ernakulam' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Mysuru' })).not.toBeInTheDocument();

    save();
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ state: '2', district: '' }));
  });

  it('loads the districts of a saved state on open', async () => {
    const { getDistricts } = setup({ name: 'Wanderly Travels', state: '1', district: '11' });
    expect(getDistricts).toHaveBeenCalledWith(1);
    await waitFor(() => expect(field(AGENCY_PROFILE.DISTRICT)).toHaveValue('Bengaluru Urban'));
  });

  it('shows why the districts could not load', async () => {
    const onSave = vi.fn();
    render(
      <AgencyProfile
        profile={{ name: 'Wanderly Travels' }}
        states={MOCK_STATES}
        getDistricts={async () => ({ success: false, errors: ['Districts unavailable'] })}
        onSave={onSave}
      />,
    );
    pick(AGENCY_PROFILE.STATE, 'Kerala');
    expect(await screen.findByText('Districts unavailable')).toBeInTheDocument();
  });

  it('updates the preview as fields change and focuses an empty field from its prompt', () => {
    setup();
    const preview = within(screen.getByRole('region', { name: AGENCY_PREVIEW.TITLE }));

    fireEvent.click(preview.getByRole('button', { name: AGENCY_PREVIEW.ADD_TAGLINE }));
    expect(field(AGENCY_PROFILE.TAGLINE)).toHaveFocus();

    fireEvent.change(field(AGENCY_PROFILE.TAGLINE), { target: { value: 'Slow travel' } });
    expect(preview.getByText('Slow travel')).toBeInTheDocument();
    expect(
      preview.queryByRole('button', { name: AGENCY_PREVIEW.ADD_TAGLINE }),
    ).not.toBeInTheDocument();
  });

  it('saves a half-done profile with the entered values', async () => {
    const { onSave } = setup();
    pick(AGENCY_PROFILE.STATE, 'Karnataka');
    fireEvent.change(field(AGENCY_PROFILE.CITY), { target: { value: ' Mysuru ' } });
    fireEvent.change(field(AGENCY_PROFILE.PIN), { target: { value: '560025' } });
    save();

    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Wanderly Travels',
        state: '1',
        city: 'Mysuru',
        pin: '560025',
        tagline: '',
      }),
    );
  });
});
