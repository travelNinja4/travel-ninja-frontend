import { Suspense } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import ToursContent from './ToursContent';
import { MOCK_TOURS } from '../TourCard/TourCard.mocks';
import { MOCK_FILTER_OPTIONS } from './Tours.mocks';
import { TOURS } from '@/constants/strings';
import type { TourPage, TourSearch } from '@/constants/types';

const push = vi.fn();
const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace }) }));

const page = (overrides: Partial<TourPage> = {}): TourPage => ({
  tours: MOCK_TOURS,
  page: 1,
  total: MOCK_TOURS.length,
  pageCount: 1,
  ...overrides,
});

// Resolves the promises inside act, so ToursContent has rendered when this returns
const renderTours = async (tourPage: Partial<TourPage> = {}, filters?: TourSearch) => {
  const props = {
    filterOptionsPromise: Promise.resolve(MOCK_FILTER_OPTIONS),
    filters,
  };
  let rerender: ReturnType<typeof render>['rerender'] = () => {};
  await act(async () => {
    ({ rerender } = render(
      <Suspense>
        <ToursContent toursPromise={Promise.resolve(page(tourPage))} {...props} />
      </Suspense>,
    ));
  });
  // Renders again as a navigation would, with new filters from the URL
  return async (nextFilters: TourSearch) => {
    await act(async () => {
      rerender(
        <Suspense>
          <ToursContent
            toursPromise={Promise.resolve(page(tourPage))}
            {...props}
            filters={nextFilters}
          />
        </Suspense>,
      );
    });
  };
};

const cardTitles = () =>
  screen.queryAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);

const optionLabels = (filterLabel: string) => {
  fireEvent.click(screen.getByRole('combobox', { name: filterLabel }));
  return within(screen.getByRole('listbox'))
    .getAllByRole('option')
    .map((option) => option.textContent);
};

const choose = (filterLabel: string, optionLabel: string) => {
  fireEvent.click(screen.getByRole('combobox', { name: filterLabel }));
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: optionLabel }));
};

const pagination = () => screen.getByRole('navigation', { name: 'Pagination' });

describe('ToursContent', () => {
  beforeEach(() => {
    push.mockClear();
    replace.mockClear();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it('shows the page of tours against the total from the API', async () => {
    await renderTours({ total: 23, pageCount: 3 });

    expect(cardTitles()).toEqual(MOCK_TOURS.map((tour) => tour.title));
    expect(screen.getByText('Showing 8 of 23')).toBeInTheDocument();
  });

  it('offers the API statuses and categories', async () => {
    await renderTours();

    expect(optionLabels(TOURS.STATUS_FILTER)).toEqual([
      TOURS.ALL_STATUSES,
      ...MOCK_FILTER_OPTIONS.tour_status.map((option) => option.label),
    ]);
    fireEvent.keyDown(screen.getByRole('combobox', { name: TOURS.STATUS_FILTER }), {
      key: 'Escape',
    });
    expect(optionLabels(TOURS.CATEGORY_FILTER)).toEqual([
      TOURS.ALL_CATEGORIES,
      ...MOCK_FILTER_OPTIONS.tour_category.map((option) => option.label),
    ]);
  });

  it('searches from page 1 once typing pauses, keeping the filters', async () => {
    await renderTours({ page: 3 }, { status: 'draft' });

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: ' goa ' } });
    expect(replace).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(300));
    expect(replace).toHaveBeenCalledWith('/tours?status=draft&q=goa', { scroll: false });
    expect(push).not.toHaveBeenCalled();
  });

  it('loads the chosen status from page 1, keeping the search', async () => {
    await renderTours({ page: 3 }, { search: 'goa' });

    choose(TOURS.STATUS_FILTER, 'Archived');
    expect(push).toHaveBeenCalledWith('/tours?status=archived&q=goa', { scroll: false });

    choose(TOURS.STATUS_FILTER, TOURS.ALL_STATUSES);
    expect(push).toHaveBeenLastCalledWith('/tours?q=goa', { scroll: false });
  });

  it('filters by category id', async () => {
    await renderTours({}, { status: 'published' });

    choose(TOURS.CATEGORY_FILTER, 'Beach');
    expect(push).toHaveBeenCalledWith('/tours?status=published&category=6', { scroll: false });
  });

  it('shows the filters from the URL', async () => {
    await renderTours({}, { search: 'goa', status: 'draft', categoryId: 6 });

    expect(screen.getByRole('searchbox')).toHaveValue('goa');
    expect(screen.getByRole('combobox', { name: TOURS.STATUS_FILTER })).toHaveValue('Draft');
    expect(screen.getByRole('combobox', { name: TOURS.CATEGORY_FILTER })).toHaveValue('Beach');
  });

  it('resets the search box when the URL search changes from elsewhere', async () => {
    const navigate = await renderTours({}, { search: 'goa' });

    await navigate({});
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('keeps typed text when its own search lands', async () => {
    const navigate = await renderTours();

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'goa ' } });
    act(() => vi.advanceTimersByTime(300));
    await navigate({ search: 'goa' });

    expect(screen.getByRole('searchbox')).toHaveValue('goa ');
  });

  it('shows a no-matches message when filters match nothing', async () => {
    await renderTours({ tours: [], total: 0, pageCount: 0 }, { categoryId: 2 });
    expect(screen.getByText(TOURS.NO_MATCHES_TITLE)).toBeInTheDocument();
  });

  it('links to every page, keeping the filters', async () => {
    await renderTours({ total: 23, pageCount: 3 }, { status: 'published', search: 'goa' });

    expect(within(pagination()).getByText('1')).toHaveAttribute('aria-current', 'page');
    expect(within(pagination()).getByRole('link', { name: 'Page 3' })).toHaveAttribute(
      'href',
      '/tours?page=3&status=published&q=goa',
    );
  });

  it('links back to earlier pages from a later one', async () => {
    await renderTours({ page: 2, total: 12, pageCount: 2 });

    expect(within(pagination()).getByText('2')).toHaveAttribute('aria-current', 'page');
    expect(within(pagination()).getByRole('link', { name: 'Page 1' })).toHaveAttribute(
      'href',
      '/tours',
    );
    expect(within(pagination()).queryByRole('link', { name: 'Page 3' })).not.toBeInTheDocument();
  });

  it('explains an empty page past the last one', async () => {
    await renderTours({ tours: [], page: 4, total: 12, pageCount: 2 });
    expect(screen.getByText(TOURS.PAGE_EMPTY_TITLE)).toBeInTheDocument();
  });

  it('shows the empty state when the agency has no tours', async () => {
    await renderTours({ tours: [], total: 0, pageCount: 0 });
    expect(screen.getByText(TOURS.EMPTY_TITLE)).toBeInTheDocument();
  });
});
