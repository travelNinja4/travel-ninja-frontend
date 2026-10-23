import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import DataTable from './DataTable';
import StatusBadge from '../StatusBadge';
import Typography from '../Typography';

interface Booking {
  reference: string;
  customer: string;
  tour: string;
  departure: string;
  travelers: number;
  amount: number;
  payment: 'paid' | 'pending';
  status: 'confirmed' | 'pending';
}

const LABELS = { paid: 'Paid', pending: 'Pending', confirmed: 'Confirmed' };

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const columns: ColumnDef<Booking, any>[] = [
  {
    header: 'Reference',
    accessorKey: 'reference',
    cell: ({ getValue }) => (
      <Typography variant="title-sm" style={{ color: 'var(--color-brand)' }}>
        {getValue()}
      </Typography>
    ),
  },
  { header: 'Customer', accessorKey: 'customer' },
  { header: 'Tour', accessorKey: 'tour' },
  { header: 'Departure', accessorKey: 'departure', meta: { hideBelow: 'laptop' } },
  { header: 'Travelers', accessorKey: 'travelers', meta: { hideBelow: 'laptop' } },
  { header: 'Amount', accessorKey: 'amount', cell: ({ getValue }) => inr.format(getValue()) },
  {
    header: 'Payment',
    accessorKey: 'payment',
    cell: ({ row }) => (
      <StatusBadge status={row.original.payment}>{LABELS[row.original.payment]}</StatusBadge>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <StatusBadge status={row.original.status}>{LABELS[row.original.status]}</StatusBadge>
    ),
  },
  {
    id: 'actions',
    header: () => null,
    cell: () => <MoreHorizontal size={18} aria-label="Actions" />,
    meta: { align: 'end', width: '3.5rem' },
  },
];

const bookings: Booking[] = [
  ['TN-2026-1042', 'Sneha Krishnan', 'Kerala Backwaters Experience', '22 Nov 2026', 2, 44000],
  ['TN-2026-1041', 'Vikram Shah', 'Coorg Weekend Escape', '14 Nov 2026', 2, 25000],
  ['TN-2026-1040', 'Meera Patel', 'Rajasthan Cultural Journey', '18 Dec 2026', 2, 77000],
  ['TN-2026-1039', 'Aditya Rao', 'Hampi Heritage Trail', '5 Dec 2026', 1, 14900],
  ['TN-2026-1038', 'Fatima Sheikh', 'Meghalaya Explorer', '10 Jan 2027', 2, 55000],
].map(([reference, customer, tour, departure, travelers, amount], index) => ({
  reference: reference as string,
  customer: customer as string,
  tour: tour as string,
  departure: departure as string,
  travelers: travelers as number,
  amount: amount as number,
  payment: index === 1 ? 'pending' : 'paid',
  status: index === 1 ? 'pending' : 'confirmed',
}));

const meta = {
  title: 'components/DataTable',
  component: DataTable<Booking>,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
    skeletonRows: { control: { type: 'number', min: 1 } },
  },
  args: {
    label: 'Bookings',
    columns,
    data: bookings,
    total: 8,
    getRowId: (booking: Booking) => booking.reference,
    pagination: { page: 1, pageCount: 2, getHref: (page: number) => `?page=${page}` },
  },
} satisfies Meta<typeof DataTable<Booking>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: { data: [], total: 0, pagination: undefined },
};
