'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { useAuthStore } from '@/stores/auth-store';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { formatCurrency } from '@/lib/utils/format';
import { exportProductsPriceListCSV } from '@/lib/utils/csv-export';
import { fetchParties } from '@/lib/api/parties';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const DIVISION_OPTIONS = [
  { value: 'CMF', label: 'CMF' },
  { value: 'Endoscopy', label: 'Endoscopy' },
  { value: 'Healthcare Systems, MedSurg', label: 'Healthcare Systems' },
  { value: 'Instruments', label: 'Instruments' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Neurovascular', label: 'Neurovascular' },
  { value: 'Performance Solutions', label: 'Performance Solutions' },
  { value: 'Reconstructive', label: 'Reconstructive' },
  { value: 'Spine', label: 'Spine' },
  { value: 'Sustainability Solutions', label: 'Sustainability Solutions' },
  { value: 'Trauma & Extremities', label: 'Trauma & Extremities' },
];

export default function PriceListPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { data: products, isLoading } = useProducts({ search, division });

  const isSalesRep = user?.role === 'sales_rep';

  // Redirect medical professionals
  useEffect(() => {
    if (user?.role === 'medical_professional') {
      router.replace('/products');
    }
  }, [user?.role, router]);

  // Load customers for sales reps
  useEffect(() => {
    if (!isSalesRep) return;
    fetchParties().then((parties) => {
      const filtered = parties.filter((p) => p.type !== 'manufacturer');
      setCustomers(filtered);
    });
  }, [isSalesRep]);

  // Auto-set customer for non-sales-rep roles
  const customerName = useMemo(() => {
    if (isSalesRep) {
      const match = customers.find((c) => c.id === selectedCustomer);
      return match?.name || null;
    }
    return user?.organization || null;
  }, [isSalesRep, selectedCustomer, customers, user?.organization]);

  if (user?.role === 'medical_professional') return null;

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleExport = () => {
    if (!products?.length) {
      toast.error('No products to export');
      return;
    }
    if (isSalesRep && !selectedCustomer) {
      toast.error('Please select a customer first');
      return;
    }
    exportProductsPriceListCSV(products, customerName);
    toast.success('Price list downloaded');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Price List</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">
            {customerName ? `Pricing for ${customerName}` : 'Export product pricing as CSV'}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isLoading || (isSalesRep && !selectedCustomer)}
          className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#087a69] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Download className="h-4 w-4" />
          Export Price List
        </button>
      </div>

      {isSalesRep && (
        <div className="mb-4">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
            Customer
          </label>
          <select
            value={selectedCustomer || ''}
            onChange={(e) => setSelectedCustomer(e.target.value || null)}
            className="h-10 w-full max-w-md rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <option value="">Select a customer…</option>
            {customerOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Divisions" value={division} onChange={setDivision} options={DIVISION_OPTIONS} />
      </FiltersBar>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#e7e7e7] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e7e7e7] bg-[#F5F5F5]">
                {['Product ID', 'Product Name', 'Division', 'Category', 'SKU', 'List Price', 'Your Price', 'Availability'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products || []).map((p) => (
                <tr key={p.maId} className="border-b border-[#F5F5F5] last:border-b-0 hover:bg-[#FAFAFA]">
                  <td className="px-4 py-3 font-mono text-xs text-[#3c3e3f]">{p.maId}</td>
                  <td className="px-4 py-3 font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{p.maName}</td>
                  <td className="px-4 py-3 text-[#3c3e3f]">{p.division}</td>
                  <td className="px-4 py-3 text-[#3c3e3f]">{p.category}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#3c3e3f]">{p.sku}</td>
                  <td className="px-4 py-3 text-[#3c3e3f]">{formatCurrency(p.listPrice)}</td>
                  <td className="px-4 py-3 font-bold text-[#01332b]">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3 text-[#3c3e3f]">{p.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!products || products.length === 0) && (
            <div className="py-12 text-center text-[#3c3e3f]">No products found matching your criteria.</div>
          )}
        </div>
      )}
    </div>
  );
}
