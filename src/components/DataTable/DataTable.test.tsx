import { render, screen, within } from '@testing-library/react';
import type { ColumnDef } from '@tanstack/react-table';
import DataTable from './DataTable';
import { TABLE } from '@/constants/strings';

interface Row {
  id: string;
  name: string;
  amount: number;
}

const columns: ColumnDef<Row, any>[] = [
  { header: 'Name', accessorKey: 'name' },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ getValue }) => `₹${getValue()}`,
    meta: { align: 'end', hideBelow: 'laptop' },
  },
];

const data: Row[] = [
  { id: 'a', name: 'Sneha', amount: 100 },
  { id: 'b', name: 'Vikram', amount: 200 },
];

describe('DataTable', () => {
  it('renders the headers and a row per record', () => {
    render(<DataTable label="Bookings" columns={columns} data={data} />);

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    // header row + two rows
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByText('₹200')).toBeInTheDocument();
  });

  it('applies the column meta to the header and cells', () => {
    render(<DataTable label="Bookings" columns={columns} data={data} />);

    // By text: jsdom applies the stylesheet and is narrower than laptop, so the column is hidden
    expect(screen.getByText('Amount')).toHaveClass('end', 'hideBelowLaptop');
    expect(screen.getByText('₹100')).toHaveClass('end', 'hideBelowLaptop');
  });

  it('shows the count against the total and the pagination', () => {
    render(
      <DataTable
        label="Bookings"
        columns={columns}
        data={data}
        total={8}
        pagination={{ page: 1, pageCount: 2, getHref: (page) => `?page=${page}` }}
      />,
    );

    expect(screen.getByText(`${TABLE.SHOWING} 2 ${TABLE.OF} 8`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '?page=2');
  });

  it('has no pagination without the pagination prop', () => {
    render(<DataTable label="Bookings" columns={columns} data={data} />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no rows', () => {
    render(<DataTable label="Bookings" columns={columns} data={[]} emptyTitle="No bookings" />);

    expect(screen.getByText('No bookings')).toBeInTheDocument();
    expect(screen.getByRole('cell')).toHaveAttribute('colspan', '2');
  });

  it('shows placeholder rows and no footer while loading', () => {
    render(<DataTable label="Bookings" columns={columns} data={data} loading skeletonRows={3} />);

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByRole('row')).toHaveLength(4);
    expect(screen.queryByText('Sneha')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(`${TABLE.LOADING} Bookings`);
    expect(screen.queryByText(new RegExp(TABLE.SHOWING))).not.toBeInTheDocument();
  });
});
