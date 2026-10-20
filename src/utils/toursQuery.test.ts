import { parseToursQuery, toursHref } from './toursQuery';

describe('parseToursQuery', () => {
  it('reads the page and status', () => {
    expect(parseToursQuery({ page: '3', status: 'draft' })).toEqual({ page: 3, status: 'draft' });
  });

  it('falls back to page 1 and all statuses for missing or invalid values', () => {
    expect(parseToursQuery({})).toEqual({ page: 1, status: undefined });
    for (const page of ['0', '-2', '1.5', 'abc', '']) {
      expect(parseToursQuery({ page }).page).toBe(1);
    }
    expect(parseToursQuery({ status: 'archived' }).status).toBeUndefined();
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
  });
});
