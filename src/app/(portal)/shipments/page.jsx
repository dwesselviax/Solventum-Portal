'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/data/data-table';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { ExternalLink } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'Processing', label: 'Processing' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'In Transit', label: 'In Transit' },
  { value: 'Delivered', label: 'Delivered' },
];

const COLUMNS = [
  { key: 'id', label: 'Shipment ID', sortable: true },
  { key: 'orderId', label: 'Order', sortable: true },
  { key: 'carrier', label: 'Carrier', sortable: true },
  { key: 'trackingNumber', label: 'Tracking #', sortable: true, render: (val) => (
    <span className="font-mono text-xs text-[#0a7b6b]">{val}</span>
  ) },
  { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
  { key: 'estimatedDelivery', label: 'Est. Delivery', sortable: true, render: (val) => formatDate(val) },
];

export default function ShipmentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    import('@/lib/mock-data/shipments').then((mod) => {
      let result = [...(mod.shipments || [])];
      if (statusFilter) result = result.filter((s) => s.status === statusFilter);
      if (search) {
        const q = search.toLowerCase();
        result = result.filter((s) => s.id?.toLowerCase().includes(q) || s.trackingNumber?.toLowerCase().includes(q) || s.orderId?.toLowerCase().includes(q));
      }
      setData(result);
      setLoading(false);
    });
  }, [search, statusFilter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Shipments</h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">Track your shipments and deliveries</p>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Statuses" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
      </FiltersBar>

      {loading ? <TableSkeleton rows={8} columns={6} /> : <DataTable columns={COLUMNS} data={data} onRowClick={(row) => router.push('/shipments/' + row.id)} />}
    </div>
  );
}
