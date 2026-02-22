'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { toast } from 'sonner';
import {
  Building2, Phone, Mail, CreditCard, ShoppingCart, FileText,
  Receipt, ScrollText, Headphones, Search, TrendingUp, Plus, X,
} from 'lucide-react';

const TIER_COLORS = {
  Bronze: 'bg-amber-100 text-amber-800',
  Silver: 'bg-gray-100 text-gray-700',
  Gold: 'bg-yellow-100 text-yellow-800',
  Platinum: 'bg-purple-100 text-purple-800',
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'orders', label: 'Orders & Quotes', icon: ShoppingCart },
  { id: 'invoices', label: 'Invoices & Billing', icon: Receipt },
  { id: 'contracts', label: 'Contracts & Pricing', icon: ScrollText },
  { id: 'service', label: 'Service & Support', icon: Headphones },
];

function TierBadge({ tier }) {
  if (!tier) return null;
  return (
    <span
      className={'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ' + (TIER_COLORS[tier] || 'bg-[#F5F5F5] text-[#3c3e3f]')}
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {tier}
    </span>
  );
}

function TypeBadge({ type }) {
  const labels = {
    orthodontic_practice: 'Practice',
    dso: 'DSO',
  };
  return (
    <span
      className="inline-flex items-center rounded-full bg-[#bffde3] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0a7b6b]"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {labels[type] || type}
    </span>
  );
}

function SectionTitle({ children, icon: Icon }) {
  return (
    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
      {Icon && <Icon className="h-4 w-4 text-[#0a7b6b]" />}
      {children}
    </h4>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{label}</div>
      <div className="mt-1 text-xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-[#3c3e3f]">{sub}</div>}
    </div>
  );
}

function MiniTable({ columns, data, emptyText }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e7e7e7]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e7e7e7] bg-[#F5F5F5]">
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-sm text-[#3c3e3f]">{emptyText || 'No data.'}</td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="border-b border-[#e7e7e7] last:border-b-0 transition-colors hover:bg-[#F5F5F5]">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-3 py-2.5 text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const role = user?.role;

  useEffect(() => {
    if (user && !['sales_rep', 'ar', 'csr'].includes(role)) {
      router.push('/dashboard');
    }
  }, [user, role, router]);

  const [parties, setParties] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([
      import('@/lib/mock-data/parties'),
      import('@/lib/mock-data/orders'),
      import('@/lib/mock-data/quotes'),
      import('@/lib/mock-data/invoices'),
      import('@/lib/mock-data/contracts'),
      import('@/lib/mock-data/promotions'),
      import('@/lib/mock-data/service-requests'),
    ]).then(([p, o, q, i, c, pr, sr]) => {
      setParties(p.parties.filter((party) => party.type !== 'manufacturer'));
      setOrders(o.orders);
      setQuotes(q.quotes);
      setInvoices(i.invoices);
      setContracts(c.contracts);
      setPromotions(pr.promotions);
      setServiceRequests(sr.serviceRequests);
      setLoading(false);
    });
  }, []);

  const filteredParties = useMemo(() => {
    if (!customerSearch) return parties;
    const q = customerSearch.toLowerCase();
    return parties.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [parties, customerSearch]);

  const customer = useMemo(
    () => parties.find((p) => p.id === selectedCustomerId),
    [parties, selectedCustomerId]
  );

  // Filtered data for selected customer
  const customerOrders = useMemo(
    () => orders.filter((o) => o.customer?.id === selectedCustomerId),
    [orders, selectedCustomerId]
  );
  const customerQuotes = useMemo(
    () => quotes.filter((q) => q.customer?.id === selectedCustomerId),
    [quotes, selectedCustomerId]
  );
  const customerInvoices = useMemo(
    () => invoices.filter((inv) => inv.customer?.id === selectedCustomerId),
    [invoices, selectedCustomerId]
  );
  const customerContracts = useMemo(
    () => contracts.filter((c) => c.customerId === selectedCustomerId),
    [contracts, selectedCustomerId]
  );
  const customerServiceRequests = useMemo(
    () => serviceRequests.filter((sr) => sr.customer?.id === selectedCustomerId),
    [serviceRequests, selectedCustomerId]
  );

  // Aging breakdown for invoices
  const agingBreakdown = useMemo(() => {
    const now = new Date();
    const aging = { current: 0, days30: 0, days60: 0, days90: 0 };
    customerInvoices
      .filter((inv) => inv.status !== 'Paid')
      .forEach((inv) => {
        const due = new Date(inv.dueDate);
        const daysPastDue = Math.floor((now - due) / (1000 * 60 * 60 * 24));
        if (daysPastDue <= 0) aging.current += inv.amountDue;
        else if (daysPastDue <= 30) aging.days30 += inv.amountDue;
        else if (daysPastDue <= 60) aging.days60 += inv.amountDue;
        else aging.days90 += inv.amountDue;
      });
    return aging;
  }, [customerInvoices]);

  const totalBalance = useMemo(
    () => customerInvoices.filter((inv) => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amountDue, 0),
    [customerInvoices]
  );

  // Active promotions for customer tier
  const customerPromotions = useMemo(() => {
    if (!customer) return [];
    return promotions.filter(
      (p) => p.status === 'Active' && p.eligibleTiers.includes(customer.tierLevel)
    );
  }, [promotions, customer]);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Customers</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Customer 360 view</p>
        </div>
        <TableSkeleton rows={6} columns={5} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Customers</h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">Customer 360 -- complete account view</p>
      </div>

      {/* Customer selector */}
      <div className="mb-6">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
          Select Customer
        </label>
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3c3e3f]" />
          <select
            value={selectedCustomerId}
            onChange={(e) => { setSelectedCustomerId(e.target.value); setActiveTab('overview'); }}
            className="h-10 w-full rounded-md border border-[#e7e7e7] bg-white pl-9 pr-3 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <option value="">Choose a customer...</option>
            {filteredParties.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
            ))}
          </select>
        </div>
      </div>

      {!customer ? (
        <div className="rounded-lg border border-[#e7e7e7] bg-white px-6 py-16 text-center shadow-sm">
          <Building2 className="mx-auto h-12 w-12 text-[#e7e7e7]" />
          <p className="mt-3 text-sm text-[#3c3e3f]">Select a customer above to view their 360-degree account details.</p>
        </div>
      ) : (
        <>
          {/* Header card */}
          <div className="mb-6 rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {customer.name}
                  </h2>
                  <TypeBadge type={customer.type} />
                  <TierBadge tier={customer.tierLevel} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#3c3e3f]">
                  {customer.primaryContact && (
                    <>
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {customer.primaryContact.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {customer.primaryContact.phone}
                      </span>
                    </>
                  )}
                </div>
                {customer.primaryContact && (
                  <div className="mt-1 text-sm text-[#3c3e3f]">
                    Primary Contact: <span className="font-semibold text-[#01332b]">{customer.primaryContact.name}</span>
                    {customer.primaryContact.title && <span> -- {customer.primaryContact.title}</span>}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-sm text-[#3c3e3f]">
                  <CreditCard className="h-3.5 w-3.5" />
                  Payment Terms: <span className="font-semibold text-[#01332b]">{customer.paymentTerms || '--'}</span>
                </div>
                <div className="mt-1 text-xs text-[#3c3e3f]">
                  Credit Limit: {formatCurrency(customer.creditLimit)} | Status: {customer.creditStatus || '--'}
                </div>
              </div>
            </div>

            {/* Tier progress */}
            {customer.tierProgress != null && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-[#3c3e3f]">
                  <span style={{ fontFamily: 'var(--font-heading)' }}>Tier Progress</span>
                  <span className="font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>{customer.tierProgress}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-[#e7e7e7]">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#0a7b6b] to-[#05dd4d] transition-all"
                    style={{ width: customer.tierProgress + '%' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tab buttons */}
          <div className="mb-6 flex flex-wrap gap-1 rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    'flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition-colors ' +
                    (isActive
                      ? 'bg-white text-[#01332b] shadow-sm'
                      : 'text-[#3c3e3f] hover:text-[#01332b]')
                  }
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <Icon className={'h-4 w-4 ' + (isActive ? 'text-[#0a7b6b]' : '')} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
            {activeTab === 'overview' && (
              <OverviewTab
                customer={customer}
                customerOrders={customerOrders}
                customerQuotes={customerQuotes}
                customerInvoices={customerInvoices}
                customerServiceRequests={customerServiceRequests}
                totalBalance={totalBalance}
              />
            )}
            {activeTab === 'orders' && (
              <OrdersQuotesTab orders={customerOrders} quotes={customerQuotes} />
            )}
            {activeTab === 'invoices' && (
              <InvoicesBillingTab invoices={customerInvoices} agingBreakdown={agingBreakdown} totalBalance={totalBalance} />
            )}
            {activeTab === 'contracts' && (
              <ContractsPricingTab contracts={customerContracts} promotions={customerPromotions} />
            )}
            {activeTab === 'service' && (
              <ServiceSupportTab serviceRequests={customerServiceRequests} customerName={customer.name} />
            )}
          </div>
        </>
      )}
    </div>
  );
}


/* ===== Tab Components ===== */

function OverviewTab({ customer, customerOrders, customerQuotes, customerInvoices, customerServiceRequests, totalBalance }) {
  const recentOrders = customerOrders.slice(0, 5);
  const openItems =
    customerOrders.filter((o) => !['Delivered', 'Invoiced', 'Cancelled'].includes(o.status)).length +
    customerQuotes.filter((q) => !['Converted', 'Rejected'].includes(q.status)).length +
    customerInvoices.filter((i) => i.status !== 'Paid').length +
    customerServiceRequests.filter((sr) => sr.status !== 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Annual Spend" value={formatCurrency(customer.annualSpend)} sub={'Tier: ' + (customer.tierLevel || 'N/A')} />
        <StatCard label="Total Balance" value={formatCurrency(totalBalance)} sub={customerInvoices.filter((i) => i.status === 'Overdue').length + ' overdue'} />
        <StatCard label="Total Orders" value={customerOrders.length} sub={customerOrders.filter((o) => o.status === 'Shipped' || o.status === 'Confirmed').length + ' active'} />
        <StatCard label="Open Items" value={openItems} sub="orders, quotes, invoices, service" />
      </div>

      <div>
        <SectionTitle icon={ShoppingCart}>Recent Orders</SectionTitle>
        <MiniTable
          columns={[
            { key: 'biId', label: 'Order ID', render: (v) => <span className="font-semibold text-[#0a7b6b]">{v}</span> },
            { key: 'biName', label: 'Description' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'biCreatedAt', label: 'Date', render: (v) => formatDate(v) },
            { key: 'total', label: 'Total', render: (_, row) => formatCurrency(row.pricing?.total) },
          ]}
          data={recentOrders}
          emptyText="No orders found for this customer."
        />
      </div>
    </div>
  );
}

function OrdersQuotesTab({ orders, quotes }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle icon={ShoppingCart}>Orders</SectionTitle>
        <MiniTable
          columns={[
            { key: 'biId', label: 'Order ID', render: (v) => <span className="font-semibold text-[#0a7b6b]">{v}</span> },
            { key: 'biName', label: 'Description' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'biCreatedAt', label: 'Created', render: (v) => formatDate(v) },
            { key: 'total', label: 'Total', render: (_, row) => formatCurrency(row.pricing?.total) },
          ]}
          data={orders}
          emptyText="No orders for this customer."
        />
      </div>

      <div>
        <SectionTitle icon={FileText}>Quotes</SectionTitle>
        <MiniTable
          columns={[
            { key: 'biId', label: 'Quote ID', render: (v) => <span className="font-semibold text-[#0a7b6b]">{v}</span> },
            { key: 'biName', label: 'Description' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'validUntil', label: 'Valid Until', render: (v) => formatDate(v) },
            { key: 'total', label: 'Total', render: (_, row) => formatCurrency(row.pricing?.total) },
          ]}
          data={quotes}
          emptyText="No quotes for this customer."
        />
      </div>
    </div>
  );
}

function InvoicesBillingTab({ invoices, agingBreakdown, totalBalance }) {
  return (
    <div className="space-y-6">
      {/* Aging breakdown */}
      <div>
        <SectionTitle icon={Receipt}>Aging Summary</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          <StatCard label="Current" value={formatCurrency(agingBreakdown.current)} />
          <StatCard label="1-30 Days" value={formatCurrency(agingBreakdown.days30)} />
          <StatCard label="31-60 Days" value={formatCurrency(agingBreakdown.days60)} />
          <StatCard label="61-90+ Days" value={formatCurrency(agingBreakdown.days90)} />
          <StatCard label="Total Balance" value={formatCurrency(totalBalance)} />
        </div>
      </div>

      <div>
        <SectionTitle icon={Receipt}>Invoice List</SectionTitle>
        <MiniTable
          columns={[
            { key: 'biId', label: 'Invoice ID', render: (v) => <span className="font-semibold text-[#0a7b6b]">{v}</span> },
            { key: 'invoiceNumber', label: 'Invoice #' },
            { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
            { key: 'dueDate', label: 'Due Date', render: (v) => formatDate(v) },
            { key: 'totalAmount', label: 'Amount', render: (v) => formatCurrency(v) },
            { key: 'amountDue', label: 'Balance', render: (v) => formatCurrency(v) },
          ]}
          data={invoices}
          emptyText="No invoices for this customer."
        />
      </div>
    </div>
  );
}

function ContractsPricingTab({ contracts, promotions }) {
  return (
    <div className="space-y-6">
      {contracts.length === 0 ? (
        <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] px-6 py-8 text-center text-sm text-[#3c3e3f]">
          No contracts on file for this customer.
        </div>
      ) : (
        contracts.map((contract) => (
          <div key={contract.id} className="rounded-lg border border-[#e7e7e7] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{contract.id}</span>
                  <StatusBadge status={contract.status} />
                  <TierBadge tier={contract.tierLevel} />
                </div>
                <div className="mt-1 text-xs text-[#3c3e3f]">
                  Type: <span className="capitalize font-semibold">{contract.type}</span> | Terms: {contract.terms} | Auto-Renew: {contract.autoRenew ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {contract.discountPercentage}% discount
                </div>
                <div className="text-xs text-[#3c3e3f]">
                  {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                </div>
              </div>
            </div>

            {/* Spend progress */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                <span>Annual Spend vs. Minimum</span>
                <span>{formatCurrency(contract.currentAnnualSpend)} / {formatCurrency(contract.minimumAnnualCommitment)}</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-[#e7e7e7]">
                <div
                  className="h-2 rounded-full bg-[#0a7b6b] transition-all"
                  style={{ width: Math.min(100, Math.round((contract.currentAnnualSpend / contract.minimumAnnualCommitment) * 100)) + '%' }}
                />
              </div>
            </div>

            {/* Special pricing table */}
            {contract.specialPricing && contract.specialPricing.length > 0 && (
              <div className="mt-4">
                <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Special Pricing
                </h5>
                <MiniTable
                  columns={[
                    { key: 'productName', label: 'Product' },
                    { key: 'listPrice', label: 'List Price', render: (v) => formatCurrency(v) },
                    { key: 'contractPrice', label: 'Contract Price', render: (v) => <span className="font-semibold text-[#0a7b6b]">{formatCurrency(v)}</span> },
                    {
                      key: 'savings', label: 'Savings', render: (_, row) => {
                        const pct = Math.round(((row.listPrice - row.contractPrice) / row.listPrice) * 100);
                        return <span className="text-[#2E7D32]">{pct}%</span>;
                      },
                    },
                  ]}
                  data={contract.specialPricing}
                />
              </div>
            )}

            {contract.notes && (
              <p className="mt-3 rounded-md bg-[#F5F5F5] px-3 py-2 text-xs text-[#3c3e3f]" style={{ fontFamily: 'var(--font-body)' }}>
                {contract.notes}
              </p>
            )}
          </div>
        ))
      )}

      {/* Active promotions */}
      {promotions.length > 0 && (
        <div>
          <SectionTitle>Active Promotions</SectionTitle>
          <div className="space-y-3">
            {promotions.map((promo) => (
              <div key={promo.id} className="flex items-start justify-between gap-4 rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
                <div>
                  <div className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{promo.name}</div>
                  <p className="mt-0.5 text-xs text-[#3c3e3f]">{promo.description.slice(0, 120)}...</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#3c3e3f]">
                    <span>Code: <span className="font-bold text-[#0a7b6b]">{promo.code}</span></span>
                    <span>Valid until {formatDate(promo.validUntil)}</span>
                  </div>
                </div>
                <div className="shrink-0 rounded-lg bg-[#01332b] px-3 py-1.5 text-sm font-bold text-[#05dd4d]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {promo.discountType === 'percentage'
                    ? promo.discountValue + '% OFF'
                    : promo.discountType === 'free_product'
                      ? 'FREE GIFT'
                      : formatCurrency(promo.discountValue) + ' OFF'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceSupportTab({ serviceRequests, customerName }) {
  function handleCreateTicket() {
    toast.success('Service ticket created for ' + customerName + '. A representative will follow up within 24 hours.');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle icon={Headphones}>Service Requests</SectionTitle>
        <button
          onClick={handleCreateTicket}
          className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
          style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}
        >
          <Plus className="h-4 w-4" /> Create Ticket
        </button>
      </div>

      {serviceRequests.length === 0 ? (
        <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] px-6 py-8 text-center text-sm text-[#3c3e3f]">
          No service requests for this customer.
        </div>
      ) : (
        <div className="space-y-3">
          {serviceRequests.map((sr) => (
            <div key={sr.id} className="rounded-lg border border-[#e7e7e7] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>{sr.id}</span>
                    <StatusBadge status={sr.status} />
                    <span className={'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ' +
                      (sr.priority === 'Critical' ? 'bg-red-100 text-red-800' : sr.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-[#F5F5F5] text-[#3c3e3f]')}
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {sr.priority}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{sr.subject}</div>
                  <div className="mt-0.5 text-xs text-[#3c3e3f]">
                    {sr.type} | Product: {sr.productName} | Serial: {sr.serialNumber}
                  </div>
                </div>
                <div className="text-right text-xs text-[#3c3e3f]">
                  <div>Requested: {formatDate(sr.requestedDate)}</div>
                  {sr.scheduledDate && <div>Scheduled: {formatDate(sr.scheduledDate)}</div>}
                  {sr.assignedTechnician && <div className="mt-1 font-semibold text-[#01332b]">Tech: {sr.assignedTechnician.name}</div>}
                </div>
              </div>
              {sr.notes && (
                <p className="mt-2 rounded-md bg-[#F5F5F5] px-3 py-2 text-xs text-[#3c3e3f]" style={{ fontFamily: 'var(--font-body)' }}>
                  {sr.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
