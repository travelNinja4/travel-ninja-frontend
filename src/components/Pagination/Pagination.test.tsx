import { render, screen, within } from '@testing-library/react';
import Pagination, { getPageItems } from './Pagination';

const getHref = (page: number) => `/tours?page=${page}`;

describe('getPageItems', () => {
  it('lists every page when there are few', () => {
    expect(getPageItems(1, 1)).toEqual([1]);
    expect(getPageItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('collapses the middle of a long range around the current page', () => {
    expect(getPageItems(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
  });

  it('keeps the window wide near either end', () => {
    expect(getPageItems(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(getPageItems(20, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });
});

describe('Pagination', () => {
  it('marks the current page and links the others', () => {
    render(<Pagination page={2} pageCount={3} getHref={getHref} />);

    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(within(nav).getByText('2')).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Page 1' })).toHaveAttribute(
      'href',
      '/tours?page=1',
    );
    expect(within(nav).getByRole('link', { name: 'Page 3' })).toHaveAttribute(
      'href',
      '/tours?page=3',
    );
    expect(within(nav).queryByRole('link', { name: 'Page 2' })).not.toBeInTheDocument();
  });

  it('shows a single current page', () => {
    render(<Pagination page={1} pageCount={1} getHref={getHref} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByText('1')).toHaveAttribute('aria-current', 'page');
  });
});
