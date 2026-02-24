'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useOrders } from '@/hooks/use-orders';
import { DataTable } from '@/components/data/data-table';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Plus } from 'lucide-react';
import { OrderForm } from '@/components/forms/order-form';

const STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Invoiced', label: 'Invoiced' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const COLUMNS = [
  { key: 'biId', label: 'Order ID', sortable: true },
  { key: 'biName', label: 'Description', sortable: true },
  { key: 'customerName', label: 'Customer', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
  { key: 'biCreatedAt', label: 'Date', sortable: true, render: (val) => formatDate(val) },
  { key: 'total', label: 'Total', sortable: true, render: (_, row) => formatCurrency(row.pricing?.total) },
];

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [localOrders, setLocalOrders] = useState([]);
  const { data: orders, isLoading } = useOrders({ search, status: statusFilter });
  const queryClient = useQueryClient();
  const router = useRouter();

  function handleOrderCreated(newOrder) {
    setLocalOrders((prev) => [newOrder, ...prev]);
    // Also invalidate the query so a re-fetch would include the new order if backed by a real API
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  }

  // Merge server-fetched orders with locally-created ones
  const allOrders = [...localOrders, ...(orders || [])];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Orders</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Manage and track your orders</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
          style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}
        >
          <Plus className="h-4 w-4" /> New Order
        </button>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Statuses" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
      </FiltersBar>

      {isLoading ? (
        <TableSkeleton rows={8} columns={6} />
      ) : (
        <DataTable
          columns={COLUMNS}
          data={allOrders}
          onRowClick={(row) => router.push('/orders/' + row.biId)}
        />
      )}

      <OrderForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}
