'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { DataTable } from '@/components/data/data-table';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Paused', label: 'Paused' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const COLUMNS = [
  { key: 'biId', label: 'Subscription ID', sortable: true },
  { key: 'biName', label: 'Product', sortable: true },
  { key: 'frequency', label: 'Frequency', sortable: true },
  { key: 'quantity', label: 'Qty', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
  { key: 'nextDelivery', label: 'Next Delivery', sortable: true, render: (val) => formatDate(val) },
  { key: 'startDate', label: 'Start Date', sortable: true, render: (val) => formatDate(val) },
];

export default function SubscriptionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const { data: subscriptions, isLoading } = useSubscriptions({ search, status: statusFilter });
  const router = useRouter();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Subscriptions</h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">Manage your recurring subscriptions</p>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Statuses" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
      </FiltersBar>

      {isLoading ? <TableSkeleton rows={6} columns={7} /> : (
        <DataTable columns={COLUMNS} data={subscriptions || []} onRowClick={(row) => router.push('/subscriptions/' + row.biId)} />
      )}
    </div>
  );
}
