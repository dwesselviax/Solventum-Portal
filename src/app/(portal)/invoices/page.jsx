'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoices } from '@/hooks/use-invoices';
import { DataTable } from '@/components/data/data-table';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';

const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Overdue', label: 'Overdue' },
  { value: 'Partial', label: 'Partial' },
];

const COLUMNS = [
  { key: 'biId', label: 'Invoice ID', sortable: true },
  { key: 'invoiceNumber', label: 'Invoice #', sortable: true },
  { key: 'orderId', label: 'Order Ref', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
  { key: 'dueDate', label: 'Due Date', sortable: true, render: (val) => formatDate(val) },
  { key: 'totalAmount', label: 'Amount', sortable: true, render: (val) => formatCurrency(val) },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const { data: invoices, isLoading } = useInvoices({ search, status: statusFilter });
  const router = useRouter();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Invoices</h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">View and manage your invoices</p>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Statuses" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
      </FiltersBar>

      {isLoading ? (
        <TableSkeleton rows={8} columns={6} />
      ) : (
        <DataTable
          columns={COLUMNS}
          data={invoices || []}
          onRowClick={(row) => router.push('/invoices/' + row.biId)}
        />
      )}
    </div>
  );
}
