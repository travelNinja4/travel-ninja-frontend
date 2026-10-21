import { parseToursQuery, toursHref } from './toursQuery';

describe('parseToursQuery', () => {
  it('reads the page, search and filters', () => {
    expect(parseToursQuery({ page: '3', status: 'draft', category: '6', q: ' goa ' })).toEqual({
      page: 3,
      search: 'goa',
      status: 'draft',
      categoryId: 6,
    });
    expect(parseToursQuery({ status: 'archived' }).status).toBe('archived');
  });

  it('falls back to page 1 and no filter for missing or invalid values', () => {
    expect(parseToursQuery({})).toEqual({ page: 1 });
    for (const page of ['0', '-2', '1.5', 'abc', '']) {
      expect(parseToursQuery({ page }).page).toBe(1);
    }
    for (const status of ['deleted', 'toString', '']) {
      expect(parseToursQuery({ status }).status).toBeUndefined();
    }
    for (const category of ['0', '-1', '2.5', 'beach']) {
      expect(parseToursQuery({ category }).categoryId).toBeUndefined();
    }
    expect(parseToursQuery({ q: '   ' }).search).toBeUndefined();
  });

  it('cuts very long search terms', () => {
    expect(parseToursQuery({ q: 'a'.repeat(500) }).search).toHaveLength(100);
  });

  it('uses the first value of a repeated param', () => {
    expect(parseToursQuery({ page: ['2', '5'] }).page).toBe(2);
  });
});

describe('toursHref', () => {
  it('builds the tours URL, leaving out defaults', () => {
    expect(toursHref({})).toBe('/tours');
    expect(toursHref({ page: 1 })).toBe('/tours');
    expect(toursHref({ page: 2 })).toBe('/tours?page=2');
    expect(toursHref({ page: 4, status: 'published' })).toBe('/tours?page=4&status=published');
    expect(toursHref({ status: 'draft' })).toBe('/tours?status=draft');
    expect(toursHref({ categoryId: 6, search: 'north goa' })).toBe('/tours?category=6&q=north+goa');
  });

  it('reads back what it builds', () => {
    const query = { page: 2, search: 'goa & co', status: 'draft' as const, categoryId: 3 };
    const params = new URL(toursHref(query), 'http://x').searchParams;
    expect(parseToursQuery(Object.fromEntries(params))).toEqual(query);
  });
});
