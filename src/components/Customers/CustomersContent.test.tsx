import { Suspense } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import CustomersContent from './CustomersContent';
import { MOCK_CITIES, MOCK_CUSTOMERS } from './Customers.mocks';
import { CUSTOMERS } from '@/constants/strings';
import type { CustomerPage, CustomerSearch } from '@/constants/types';

const push = vi.fn();
const replace = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace }) }));

const page = (overrides: Partial<CustomerPage> = {}): CustomerPage => ({
  customers: MOCK_CUSTOMERS,
  page: 1,
  total: MOCK_CUSTOMERS.length,
  pageCount: 1,
  ...overrides,
});

// Resolves the promises inside act, so CustomersContent has rendered when this returns
const renderCustomers = async (
  customerPage: Partial<CustomerPage> = {},
  filters?: CustomerSearch,
  cities = MOCK_CITIES,
) => {
  await act(async () => {
    render(
      <Suspense>
        <CustomersContent
          customersPromise={Promise.resolve(page(customerPage))}
          citiesPromise={Promise.resolve(cities)}
          filters={filters}
        />
      </Suspense>,
    );
  });
};

const cityLabels = () => {
  fireEvent.click(screen.getByRole('combobox', { name: CUSTOMERS.CITY_FILTER }));
  return within(screen.getByRole('listbox'))
    .getAllByRole('option')
    .map((option) => option.textContent);
};

describe('CustomersContent', () => {
  beforeEach(() => {
    push.mockClear();
    replace.mockClear();
  });

  it('shows a row per customer with their contact, spend and last trip', async () => {
    await renderCustomers();

    const row = screen.getByText('Sneha Krishnan').closest('tr')!;
    expect(within(row).getByText('sneha.k@example.com')).toBeInTheDocument();
    expect(within(row).getByText('+91 98111 22334')).toBeInTheDocument();
    expect(within(row).getByText('₹69,000')).toBeInTheDocument();
    expect(within(row).getByText('Chennai')).toBeInTheDocument();
    expect(within(row).getByText('2')).toBeInTheDocument();
    expect(within(row).getByText('Coorg Weekend Escape')).toBeInTheDocument();
    expect(within(row).getByText('15 Aug 2026')).toBeInTheDocument();
    expect(screen.getByText(`Showing 5 of 5`)).toBeInTheDocument();
  });

  it('opens the customer’s details in a drawer from View, and closes it', async () => {
    await renderCustomers();

    fireEvent.click(screen.getByRole('button', { name: 'View Meera Patel' }));

    const drawer = screen.getByRole('dialog', { name: CUSTOMERS.DETAILS_TITLE });
    expect(within(drawer).getByText('MP')).toBeInTheDocument();
    expect(within(drawer).getByRole('heading', { name: 'Meera Patel' })).toBeInTheDocument();
    expect(within(drawer).getByText('meera.patel@example.com')).toBeInTheDocument();
    expect(within(drawer).getByText('+91 98333 44556')).toBeInTheDocument();
    expect(within(drawer).getByText('₹1,21,000')).toBeInTheDocument();
    expect(within(drawer).getByText('Kerala Backwaters Experience')).toBeInTheDocument();
    expect(within(drawer).getByText('12 Aug 2026')).toBeInTheDocument();

    fireEvent.click(within(drawer).getByRole('button', { name: 'Close' }));
    expect(drawer).not.toHaveAttribute('open');
    expect(screen.queryByTestId('CustomerDetailsTest')).not.toBeInTheDocument();
  });

  it('shows a dash for a customer without a city', async () => {
    await renderCustomers();

    const row = screen.getByText('Fatima Sheikh').closest('tr')!;
    expect(within(row).getByText(CUSTOMERS.NOT_AVAILABLE)).toBeInTheDocument();
  });

  it('lists "All cities" then the cities from the API', async () => {
    await renderCustomers();

    expect(cityLabels()).toEqual([CUSTOMERS.ALL_CITIES, ...MOCK_CITIES]);
  });

  it('filters by the chosen city from page 1, keeping the search', async () => {
    await renderCustomers({ page: 2, pageCount: 2 }, { search: 'sha' });

    fireEvent.click(screen.getByRole('combobox', { name: CUSTOMERS.CITY_FILTER }));
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'Mumbai' }));

    expect(push).toHaveBeenCalledWith('/customers?city=Mumbai&q=sha', { scroll: false });
  });

  it('clears the city with "All cities"', async () => {
    await renderCustomers({}, { city: 'Mumbai' });

    fireEvent.click(screen.getByRole('combobox', { name: CUSTOMERS.CITY_FILTER }));
    fireEvent.click(
      within(screen.getByRole('listbox')).getByRole('option', { name: CUSTOMERS.ALL_CITIES }),
    );

    expect(push).toHaveBeenCalledWith('/customers', { scroll: false });
  });

  it('matches the city from the URL without regard to case', async () => {
    await renderCustomers({}, { city: 'chennai' });

    expect(screen.getByRole('combobox', { name: CUSTOMERS.CITY_FILTER })).toHaveValue('Chennai');
    expect(cityLabels()).toEqual([CUSTOMERS.ALL_CITIES, ...MOCK_CITIES]);
  });

  it('keeps a city from the URL that the list does not have', async () => {
    await renderCustomers({ customers: [], total: 0 }, { city: 'Pune' });

    expect(screen.getByRole('combobox', { name: CUSTOMERS.CITY_FILTER })).toHaveValue('Pune');
    expect(cityLabels()).toEqual([CUSTOMERS.ALL_CITIES, ...MOCK_CITIES, 'Pune']);
  });

  it('searches by replacing the URL once typing pauses', async () => {
    vi.useFakeTimers();
    try {
      await renderCustomers({}, { city: 'Chennai' });

      fireEvent.change(screen.getByRole('searchbox'), { target: { value: ' sneha ' } });
      expect(replace).not.toHaveBeenCalled();
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(replace).toHaveBeenCalledWith('/customers?city=Chennai&q=sneha', { scroll: false });
    } finally {
      vi.useRealTimers();
    }
  });

  it('links each page of the pagination with the current filters', async () => {
    await renderCustomers({ total: 25, pageCount: 3 }, { city: 'Chennai' });

    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'href',
      '/customers?page=2&city=Chennai',
    );
  });

  it.each([
    [{}, undefined, CUSTOMERS.EMPTY_TITLE],
    [{}, { search: 'zz' }, CUSTOMERS.NO_MATCHES_TITLE],
    [{ page: 3 }, undefined, CUSTOMERS.PAGE_EMPTY_TITLE],
  ])('explains an empty page %#', async (overrides, filters, title) => {
    await renderCustomers({ customers: [], total: 0, ...overrides }, filters);

    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
