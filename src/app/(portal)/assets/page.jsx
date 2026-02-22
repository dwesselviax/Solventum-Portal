'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/data/data-table';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'In Service', label: 'In Service' },
  { value: 'Returned', label: 'Returned' },
  { value: 'Retired', label: 'Retired' },
];

const COLUMNS = [
  { key: 'id', label: 'Asset ID', sortable: true },
  { key: 'productName', label: 'Device', sortable: true },
  { key: 'serialNumber', label: 'Serial #', sortable: true },
  { key: 'location', label: 'Location', sortable: true, render: (val) => {
    if (!val || typeof val !== 'object') return val || '—';
    return [val.facility, val.department, val.room].filter(Boolean).join(', ');
  }},
  { key: 'installDate', label: 'Install Date', sortable: true, render: (val) => formatDate(val) },
  { key: 'warrantyStatus', label: 'Warranty', sortable: true, render: (val) => <StatusBadge status={val} /> },
  { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
];

export default function AssetsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    import('@/lib/mock-data/assets').then((mod) => {
      let result = [...(mod.assets || [])];
      if (statusFilter) result = result.filter((a) => a.status === statusFilter);
      if (search) {
        const s = search.toLowerCase();
        result = result.filter((a) => a.productName?.toLowerCase().includes(s) || a.serialNumber?.toLowerCase().includes(s) || a.id?.toLowerCase().includes(s));
      }
      setData(result);
      setLoading(false);
    });
  }, [search, statusFilter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Assets & Devices</h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">Track serialized capital assets and medical devices</p>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Statuses" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
      </FiltersBar>

      {loading ? <TableSkeleton rows={8} columns={7} /> : (
        <DataTable columns={COLUMNS} data={data} onRowClick={(row) => router.push('/assets/' + row.id)} />
      )}
    </div>
  );
}
