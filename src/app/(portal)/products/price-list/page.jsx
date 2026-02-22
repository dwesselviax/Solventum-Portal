'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { useAuthStore } from '@/stores/auth-store';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { fetchParties } from '@/lib/api/parties';
import { Download, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORY_OPTIONS = [
  { value: 'Brackets & Tubes', label: 'Brackets & Tubes' },
  { value: 'Bonding', label: 'Bonding' },
  { value: 'Clarity Aligners', label: 'Clarity Aligners' },
  { value: 'Archwires', label: 'Archwires' },
  { value: 'Auxiliaries', label: 'Auxiliaries' },
  { value: 'Instruments', label: 'Instruments' },
  { value: 'Prevention', label: 'Prevention' },
];

export default function PriceListPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [promotionsMap, setPromotionsMap] = useState({});
  const { data: products, isLoading } = useProducts({ search, division: category });

  const isSalesRep = user?.role === 'sales_rep';
  const isCustomerRole = ['orthodontist', 'dso'].includes(user?.role);

  // Redirect csr role (no price list access)
  useEffect(() => {
    if (user?.role === 'csr') {
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

  // Load contracts
  useEffect(() => {
    import('@/lib/mock-data/contracts').then(({ contracts: contractsData }) => {
      setContracts(contractsData.filter((c) => c.status === 'Active'));
    });
  }, []);

  // Load promotions
  useEffect(() => {
    import('@/lib/mock-data/promotions').then(({ promotions }) => {
      const now = new Date();
      const map = {};
      promotions.forEach((promo) => {
        if (promo.status !== 'Active') return;
        const validFrom = new Date(promo.validFrom);
        const validUntil = new Date(promo.validUntil);
        if (now < validFrom || now > validUntil) return;
        promo.eligibleProducts.forEach((pid) => {
          if (!map[pid]) map[pid] = [];
          map[pid].push(promo);
        });
      });
      setPromotionsMap(map);
    });
  }, []);

  // Resolve the active contract based on role
  const activeContract = useMemo(() => {
    if (isCustomerRole && user?.organizationId) {
      return contracts.find((c) => c.customerId === user.organizationId) || null;
    }
    if (isSalesRep && selectedCustomer) {
      return contracts.find((c) => c.customerId === selectedCustomer) || null;
    }
    return null;
  }, [isCustomerRole, isSalesRep, user?.organizationId, selectedCustomer, contracts]);

  // Build contract pricing lookup
  const contractPricingMap = useMemo(() => {
    if (!activeContract) return {};
    const map = {};
    activeContract.specialPricing.forEach((sp) => {
      map[sp.productId] = sp.contractPrice;
    });
    return map;
  }, [activeContract]);

  // Check for contract expiration within 90 days
  const contractExpirationWarning = useMemo(() => {
    if (!activeContract) return null;
    const endDate = new Date(activeContract.endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry <= 90 && daysUntilExpiry > 0) {
      return { daysUntilExpiry, endDate: activeContract.endDate, tierLevel: activeContract.tierLevel };
    }
    return null;
  }, [activeContract]);

  // Auto-set customer for non-sales-rep roles
  const customerName = useMemo(() => {
    if (isSalesRep) {
      const match = customers.find((c) => c.id === selectedCustomer);
      return match?.name || null;
    }
    return user?.organization || null;
  }, [isSalesRep, selectedCustomer, customers, user?.organization]);

  if (user?.role === 'ar' || user?.role === 'csr') return null;

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

    // Custom CSV export with contract price column
    const headers = ['Product ID', 'Product Name', 'Category', 'SKU', 'List Price', 'Contract Price', 'Contract/Tier', 'Availability'];
    const escapeField = (value) => {
      const str = value == null ? '' : String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };
    const rows = products.map((p) => {
      const cPrice = contractPricingMap[p.maId];
      const tierLabel = activeContract ? `${activeContract.tierLevel} -${activeContract.discountPercentage}%` : '';
      return [
        p.maId,
        p.maName,
        p.division,
        p.sku,
        p.listPrice != null ? p.listPrice.toFixed(2) : '',
        cPrice != null ? cPrice.toFixed(2) : '',
        tierLabel,
        p.availability || '',
      ].map(escapeField).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const safeName = (customerName || 'Customer').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Price_List_${safeName}_${date}.csv`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

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

      {/* Contract expiration warning banner */}
      {contractExpirationWarning && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-[#FFD54F] bg-[#FFFDE7] p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#F57F17]" />
          <div>
            <p className="text-sm font-bold text-[#F57F17]" style={{ fontFamily: 'var(--font-heading)' }}>
              Contract Expiring Soon
            </p>
            <p className="mt-0.5 text-sm text-[#3c3e3f]">
              Your {contractExpirationWarning.tierLevel} tier contract expires on {formatDate(contractExpirationWarning.endDate)} ({contractExpirationWarning.daysUntilExpiry} days remaining). Contact your sales representative to discuss renewal options.
            </p>
          </div>
        </div>
      )}

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
            <option value="">Select a customer...</option>
            {customerOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Categories" value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
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
                {['Product ID', 'Product Name', 'Category', 'SKU', 'List Price', 'Contract/Tier', 'Contract Price', 'Availability'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products || []).map((p) => {
                const cPrice = contractPricingMap[p.maId];
                const hasPromo = !!promotionsMap[p.maId];
                const tierLabel = activeContract ? `${activeContract.tierLevel} -${activeContract.discountPercentage}%` : null;

                return (
                  <tr key={p.maId} className={`border-b border-[#F5F5F5] last:border-b-0 ${hasPromo ? 'bg-[#FFFDE7]' : 'hover:bg-[#FAFAFA]'}`}>
                    <td className="px-4 py-3 font-mono text-xs text-[#3c3e3f]">{p.maId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{p.maName}</span>
                        {hasPromo && (
                          <span className="rounded-full bg-[#FFF8E1] px-1.5 py-0.5 text-[9px] font-bold text-[#F57F17]" style={{ fontFamily: 'var(--font-heading)' }}>PROMO</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#3c3e3f]">{p.division}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#3c3e3f]">{p.sku}</td>
                    <td className="px-4 py-3 text-[#3c3e3f]">{formatCurrency(p.listPrice)}</td>
                    <td className="px-4 py-3">
                      {tierLabel ? (
                        <span className="rounded-full bg-[#bffde3] px-2 py-0.5 text-[10px] font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {tierLabel}
                        </span>
                      ) : (
                        <span className="text-xs text-[#e7e7e7]">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-[#01332b]">
                      {cPrice != null ? formatCurrency(cPrice) : <span className="font-normal text-[#3c3e3f]">{formatCurrency(p.price)}</span>}
                    </td>
                    <td className="px-4 py-3 text-[#3c3e3f]">{p.availability}</td>
                  </tr>
                );
              })}
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
