import { customersHref, parseCustomersQuery } from './customersQuery';

describe('parseCustomersQuery', () => {
  it('reads the page, search and city', () => {
    expect(parseCustomersQuery({ page: '3', city: ' Chennai ', q: ' sneha ' })).toEqual({
      page: 3,
      search: 'sneha',
      city: 'Chennai',
    });
  });

  it('falls back to page 1 and no filter for missing or invalid values', () => {
    expect(parseCustomersQuery({})).toEqual({ page: 1 });
    for (const page of ['0', '-2', '1.5', 'abc', '']) {
      expect(parseCustomersQuery({ page }).page).toBe(1);
    }
    expect(parseCustomersQuery({ q: '   ', city: '' })).toEqual({ page: 1 });
  });

  it('reads the first of repeated params', () => {
    expect(parseCustomersQuery({ city: ['Delhi', 'Mumbai'] }).city).toBe('Delhi');
  });

  it('cuts very long values', () => {
    expect(parseCustomersQuery({ q: 'a'.repeat(500) }).search).toHaveLength(100);
    expect(parseCustomersQuery({ city: 'a'.repeat(500) }).city).toHaveLength(100);
  });
});

describe('customersHref', () => {
  it('leaves out page 1 and unset filters', () => {
    expect(customersHref({})).toBe('/customers');
    expect(customersHref({ page: 1 })).toBe('/customers');
  });

  it('builds the query string', () => {
    expect(customersHref({ page: 2, city: 'New Delhi', search: 'rao' })).toBe(
      '/customers?page=2&city=New+Delhi&q=rao',
    );
  });

  it('round-trips through parseCustomersQuery', () => {
    const query = { page: 4, city: 'Chennai', search: 'a&b' };
    const params = Object.fromEntries(new URL(customersHref(query), 'http://x').searchParams);
    expect(parseCustomersQuery(params)).toEqual(query);
  });
});
