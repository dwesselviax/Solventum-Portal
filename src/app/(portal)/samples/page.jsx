'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { StatusBadge } from '@/components/shared/status-badge';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { toast } from 'sonner';
import { ChevronDown, ChevronUp, Send, Package } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Denied', label: 'Denied' },
];

const TYPE_LABELS = {
  evaluation: 'Evaluation',
  patient_trial: 'Patient Trial',
};

export default function SamplesPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const role = user?.role;

  // Redirect unauthorized roles
  useEffect(() => {
    if (user && !['orthodontist', 'dso', 'sales_rep'].includes(role)) {
      router.push('/dashboard');
    }
  }, [user, role, router]);

  const [samples, setSamples] = useState([]);
  const [sampleableIds, setSampleableIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([{ productId: '', quantity: 1 }]);
  const [sampleType, setSampleType] = useState('Evaluation');
  const [useDefault, setUseDefault] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({ street: '', suite: '', city: '', state: '', zip: '' });
  const [notes, setNotes] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  useEffect(() => {
    Promise.all([
      import('@/lib/mock-data/samples'),
      import('@/lib/mock-data/products'),
    ]).then(([samplesModule, productsModule]) => {
      setSamples(samplesModule.samples);
      setSampleableIds(samplesModule.sampleableProducts);
      setProducts(productsModule.products || productsModule.allProducts || []);
      setLoading(false);
    });

    if (role === 'sales_rep') {
      import('@/lib/mock-data/parties').then((mod) => {
        setParties(mod.parties.filter((p) => p.type !== 'manufacturer'));
      });
    }
  }, [role]);

  const sampleableProducts = useMemo(
    () => products.filter((p) => sampleableIds.includes(p.maId)),
    [products, sampleableIds]
  );

  const filteredSamples = useMemo(() => {
    let result = samples;
    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) =>
        s.items.some((p) => p.productName.toLowerCase().includes(q)) ||
        s.id.toLowerCase().includes(q) ||
        s.requestedBy?.organization?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [samples, statusFilter, search]);

  function addProductRow() {
    setSelectedProducts((prev) => [...prev, { productId: '', quantity: 1 }]);
  }

  function removeProductRow(index) {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  }

  function updateProductRow(index, field, value) {
    setSelectedProducts((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validProducts = selectedProducts.filter((p) => p.productId);
    if (validProducts.length === 0) {
      toast.error('Please select at least one product.');
      return;
    }

    const customerParty = role === 'sales_rep' ? parties.find((p) => p.id === selectedCustomer) : null;
    const newSample = {
      id: 'SMP-' + String(samples.length + 1).padStart(3, '0'),
      requestedBy: {
        userId: user?.uid || 'USR-001',
        name: user?.name || '',
        organization: role === 'sales_rep' ? (customerParty?.name || '') : (user?.organization || ''),
        organizationId: role === 'sales_rep' ? selectedCustomer : (user?.organizationId || ''),
      },
      requestedAt: new Date().toISOString(),
      status: 'Pending',
      type: sampleType === 'Patient Trial' ? 'patient_trial' : 'evaluation',
      items: validProducts.map((p) => {
        const product = sampleableProducts.find((sp) => sp.maId === p.productId);
        return {
          productId: p.productId,
          productName: product?.maName || p.productId,
          quantity: p.quantity,
        };
      }),
      shippingAddress: useDefault ? null : shippingAddress,
      trackingNumber: null,
      carrier: null,
      deliveredAt: null,
      approvedBy: null,
      notes: notes || null,
    };

    setSamples((prev) => [newSample, ...prev]);
    toast.success('Sample request submitted successfully!');
    setFormOpen(false);
    setSelectedProducts([{ productId: '', quantity: 1 }]);
    setSampleType('Evaluation');
    setUseDefault(true);
    setShippingAddress({ street: '', suite: '', city: '', state: '', zip: '' });
    setNotes('');
    setSelectedCustomer('');
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Samples</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Request product samples for evaluation or patient trials</p>
        </div>
        <TableSkeleton rows={6} columns={5} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Samples</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Request product samples for evaluation or patient trials</p>
        </div>
      </div>

      {/* --- Request Form (Collapsible) --- */}
      <div className="mb-6 rounded-lg border border-[#e7e7e7] bg-white shadow-sm">
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex w-full items-center justify-between px-6 py-4 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#bffde3]">
              <Package className="h-5 w-5 text-[#0a7b6b]" />
            </div>
            <span className="text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
              New Sample Request
            </span>
          </div>
          {formOpen ? (
            <ChevronUp className="h-5 w-5 text-[#3c3e3f]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#3c3e3f]" />
          )}
        </button>

        {formOpen && (
          <form onSubmit={handleSubmit} className="border-t border-[#e7e7e7] px-6 py-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Sales rep: customer selector */}
              {role === 'sales_rep' && (
                <div className="lg:col-span-2">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Customer
                  </label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    required
                    className="h-10 w-full max-w-md rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <option value="">Select customer...</option>
                    {parties.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Product rows */}
              <div className="lg:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Products
                </label>
                <div className="space-y-2">
                  {selectedProducts.map((row, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <select
                        value={row.productId}
                        onChange={(e) => updateProductRow(index, 'productId', e.target.value)}
                        className="h-10 flex-1 rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        <option value="">Select product...</option>
                        {sampleableProducts.map((p) => (
                          <option key={p.maId} value={p.maId}>{p.maName}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={row.quantity}
                        onChange={(e) => updateProductRow(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="h-10 w-20 rounded-md border border-[#e7e7e7] bg-white px-3 text-center text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                        style={{ fontFamily: 'var(--font-body)' }}
                      />
                      {selectedProducts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProductRow(index)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addProductRow}
                    className="text-sm font-semibold text-[#0a7b6b] hover:text-[#087a69]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    + Add another product
                  </button>
                </div>
              </div>

              {/* Sample type */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Sample Type
                </label>
                <div className="flex items-center gap-6">
                  {['Evaluation', 'Patient Trial'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sampleType"
                        value={type}
                        checked={sampleType === type}
                        onChange={(e) => setSampleType(e.target.value)}
                        className="h-4 w-4 accent-[#0a7b6b]"
                      />
                      <span className="text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipping address */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Shipping Address
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useDefault}
                    onChange={(e) => setUseDefault(e.target.checked)}
                    className="h-4 w-4 accent-[#0a7b6b]"
                  />
                  <span className="text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>Use default shipping address</span>
                </label>
              </div>

              {!useDefault && (
                <div className="lg:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Street address"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress((a) => ({ ...a, street: e.target.value }))}
                    className="h-10 rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] placeholder:text-[#999] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                  <input
                    type="text"
                    placeholder="Suite / Unit"
                    value={shippingAddress.suite}
                    onChange={(e) => setShippingAddress((a) => ({ ...a, suite: e.target.value }))}
                    className="h-10 rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] placeholder:text-[#999] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress((a) => ({ ...a, city: e.target.value }))}
                    className="h-10 rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] placeholder:text-[#999] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress((a) => ({ ...a, state: e.target.value }))}
                      className="h-10 w-24 rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] placeholder:text-[#999] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                    <input
                      type="text"
                      placeholder="ZIP"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress((a) => ({ ...a, zip: e.target.value }))}
                      className="h-10 flex-1 rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] placeholder:text-[#999] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="lg:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Purpose of the sample request, evaluation goals, patient details (optional)..."
                  rows={3}
                  className="w-full rounded-md border border-[#e7e7e7] bg-white px-3 py-2 text-sm text-[#01332b] placeholder:text-[#999] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}
              >
                <Send className="h-4 w-4" /> Submit Request
              </button>
            </div>
          </form>
        )}
      </div>

      {/* --- Filters --- */}
      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Statuses" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
      </FiltersBar>

      {/* --- Request History Table --- */}
      <div className="overflow-hidden rounded-lg border border-[#e7e7e7] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e7e7e7] bg-[#F5F5F5]">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Date</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Request ID</th>
                {role === 'sales_rep' && (
                  <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Customer</th>
                )}
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Products</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Type</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Tracking</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.length === 0 ? (
                <tr>
                  <td colSpan={role === 'sales_rep' ? 7 : 6} className="px-4 py-12 text-center text-sm text-[#3c3e3f]">
                    No sample requests found.
                  </td>
                </tr>
              ) : (
                filteredSamples.map((sample) => (
                  <tr key={sample.id} className="border-b border-[#e7e7e7] transition-colors hover:bg-[#F5F5F5]">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>
                      {formatDate(sample.requestedAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {sample.id}
                    </td>
                    {role === 'sales_rep' && (
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>
                        {sample.requestedBy?.organization}
                      </td>
                    )}
                    <td className="max-w-[280px] px-4 py-3 text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>
                      <div className="space-y-0.5">
                        {sample.items.map((p, i) => (
                          <div key={i} className="truncate">
                            {p.productName} <span className="text-[#3c3e3f]">x{p.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>
                      {TYPE_LABELS[sample.type] || sample.type}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={sample.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                      {sample.trackingNumber ? (
                        <span className="font-medium text-[#0a7b6b]">{sample.carrier}: {sample.trackingNumber.slice(0, 12)}...</span>
                      ) : (
                        <span className="text-[#3c3e3f]">--</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
