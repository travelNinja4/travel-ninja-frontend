import Customers from '@/components/Customers';
import { customerService } from '@/server/customerService';
import { parseCustomersQuery } from '@/utils/customersQuery';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { page, ...filters } = parseCustomersQuery(await searchParams);
  // Not awaited, so the header renders without waiting for the API. Both requests run in parallel.
  const customers = customerService.searchCustomers({ page, ...filters });
  // Missing cities shouldn't take the customers down with them: fall back to "All cities" only
  const cities = customerService.getCities().catch(() => []);
  return <Customers customers={customers} cities={cities} filters={filters} />;
}
