import { Suspense } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import ToursContent from './ToursContent';
import { MOCK_TOURS } from '../TourCard/TourCard.mocks';
import { TOURS, TOUR_CATEGORIES } from '@/constants/strings';
import type { TourPage, TourStatusFilter } from '@/constants/types';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

// Resolves the tours promise inside act, so ToursContent has rendered when this returns
const renderTours = async (tourPage: Partial<TourPage> = {}, status?: TourStatusFilter) => {
  const value: TourPage = { tours: MOCK_TOURS, page: 1, hasNextPage: false, ...tourPage };
  await act(async () => {
    render(
      <Suspense>
        <ToursContent toursPromise={Promise.resolve(value)} status={status} />
      </Suspense>,
    );
  });
};

const cardTitles = () =>
  screen.queryAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);

const choose = (filterLabel: string, optionLabel: string) => {
  fireEvent.click(screen.getByRole('combobox', { name: filterLabel }));
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: optionLabel }));
};

const pagination = () => screen.getByRole('navigation', { name: 'Pagination' });

describe('ToursContent', () => {
  beforeEach(() => {
    push.mockClear();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('shows every tour on the page with no filters', async () => {
    await renderTours();

    expect(cardTitles()).toEqual(MOCK_TOURS.map((tour) => tour.title));
    expect(screen.getByText('Showing 8 of 8')).toBeInTheDocument();
  });

  it('searches titles and destinations once typing pauses', async () => {
    await renderTours();

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'karnataka' } });
    expect(cardTitles()).toHaveLength(MOCK_TOURS.length);

    act(() => vi.advanceTimersByTime(300));
    expect(cardTitles()).toEqual(['Coorg Weekend Escape', 'Hampi Heritage Trail']);
    expect(screen.getByText('Showing 2 of 8')).toBeInTheDocument();
  });

  it('loads the chosen status from page 1', async () => {
    await renderTours({ page: 3 });

    choose(TOURS.STATUS_FILTER, 'Draft');
    expect(push).toHaveBeenCalledWith('/tours?status=draft', { scroll: false });

    choose(TOURS.STATUS_FILTER, TOURS.ALL_STATUSES);
    expect(push).toHaveBeenLastCalledWith('/tours', { scroll: false });
  });

  it('offers the API categories and filters the page by them', async () => {
    await renderTours();

    fireEvent.click(screen.getByRole('combobox', { name: TOURS.CATEGORY_FILTER }));
    expect(
      within(screen.getByRole('listbox'))
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual([TOURS.ALL_CATEGORIES, ...TOUR_CATEGORIES]);

    fireEvent.click(screen.getByRole('option', { name: 'Beach' }));
    expect(cardTitles()).toEqual(['Andaman Island Getaway', 'Goa Coastal Escape']);
  });

  it('shows a no-matches message when the filters hide every tour', async () => {
    await renderTours();

    choose(TOURS.CATEGORY_FILTER, 'Relaxation');

    expect(cardTitles()).toEqual([]);
    expect(screen.getByText(TOURS.NO_MATCHES_TITLE)).toBeInTheDocument();
  });

  it('links to the next page when there is one, keeping the status', async () => {
    await renderTours({ hasNextPage: true }, 'published');

    expect(within(pagination()).getByText('1')).toHaveAttribute('aria-current', 'page');
    expect(within(pagination()).getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'href',
      '/tours?page=2&status=published',
    );
  });

  it('links back to earlier pages from a later one', async () => {
    await renderTours({ page: 2 });

    expect(within(pagination()).getByText('2')).toHaveAttribute('aria-current', 'page');
    expect(within(pagination()).getByRole('link', { name: 'Page 1' })).toHaveAttribute(
      'href',
      '/tours',
    );
    expect(within(pagination()).queryByRole('link', { name: 'Page 3' })).not.toBeInTheDocument();
  });

  it('explains an empty page past the last one', async () => {
    await renderTours({ tours: [], page: 4 });
    expect(screen.getByText(TOURS.PAGE_EMPTY_TITLE)).toBeInTheDocument();
  });

  it('shows the empty state when the agency has no tours', async () => {
    await renderTours({ tours: [] });
    expect(screen.getByText(TOURS.EMPTY_TITLE)).toBeInTheDocument();
  });
});
