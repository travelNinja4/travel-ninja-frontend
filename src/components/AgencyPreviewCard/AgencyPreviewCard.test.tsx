import { render, screen, fireEvent, within } from '@testing-library/react';
import { AGENCY_PREVIEW } from '@/constants/strings';
import AgencyPreviewCard from './AgencyPreviewCard';

describe('AgencyPreviewCard', () => {
  const filled = {
    name: 'Wanderly Travels',
    tagline: 'Curated journeys across India',
    description: 'Small-group tours across India.',
    destinations: 'Karnataka, Kerala ,, Goa, kerala, Kerala',
  };

  it('shows the filled profile with a chip per destination', () => {
    render(<AgencyPreviewCard {...filled} />);
    expect(screen.getByRole('heading', { name: 'Wanderly Travels' })).toBeInTheDocument();
    expect(screen.getByText(filled.tagline)).toBeInTheDocument();
    expect(screen.getByText(filled.description)).toBeInTheDocument();
    const chips = within(screen.getByRole('list', { name: AGENCY_PREVIEW.DESTINATIONS }));
    // Blank entries and repeats in any case are dropped
    expect(chips.getAllByRole('listitem').map((chip) => chip.textContent)).toEqual([
      'Karnataka',
      'Kerala',
      'Goa',
    ]);
    expect(screen.queryByRole('button', { name: /^Add/ })).not.toBeInTheDocument();
  });

  it('falls back to the initials and the default banner without images', () => {
    render(<AgencyPreviewCard name="Wanderly Travels" />);
    expect(screen.getByText('WT')).toBeInTheDocument();
    expect(screen.getByText(AGENCY_PREVIEW.DEFAULT_BANNER)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows the picked logo and banner', () => {
    render(
      <AgencyPreviewCard name="Wanderly Travels" logoUrl="/logo.png" bannerUrl="/banner.png" />,
    );
    expect(screen.getByRole('img', { name: AGENCY_PREVIEW.LOGO })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: AGENCY_PREVIEW.BANNER })).toBeInTheDocument();
    expect(screen.queryByText('WT')).not.toBeInTheDocument();
    expect(screen.queryByText(AGENCY_PREVIEW.DEFAULT_BANNER)).not.toBeInTheDocument();
  });

  it('prompts for each empty part and reports which one was clicked', () => {
    const onAdd = vi.fn();
    render(<AgencyPreviewCard name="" onAdd={onAdd} />);
    expect(
      screen.getByRole('heading', { name: AGENCY_PREVIEW.NAME_PLACEHOLDER }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: AGENCY_PREVIEW.ADD_TAGLINE }));
    fireEvent.click(screen.getByRole('button', { name: AGENCY_PREVIEW.ADD_DESCRIPTION }));
    fireEvent.click(screen.getByRole('button', { name: AGENCY_PREVIEW.ADD_DESTINATIONS }));
    expect(onAdd.mock.calls).toEqual([['tagline'], ['description'], ['destinations']]);
  });

  it('treats whitespace-only text as empty', () => {
    render(<AgencyPreviewCard name="Wanderly Travels" tagline="  " destinations=" , " />);
    expect(screen.getByRole('button', { name: AGENCY_PREVIEW.ADD_TAGLINE })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: AGENCY_PREVIEW.ADD_DESTINATIONS }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
