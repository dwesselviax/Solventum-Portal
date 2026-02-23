'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useOrders } from '@/hooks/use-orders';
import { useInvoices } from '@/hooks/use-invoices';
import { useQuotes } from '@/hooks/use-quotes';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { ProgressRing } from '@/components/dashboard/progress-ring';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TasksWidget } from '@/components/dashboard/tasks-widget';
import { DashboardSkeleton } from '@/components/shared/loading-skeleton';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import {
  ShoppingCart,
  DollarSign,
  FileText,
  RefreshCw,
  CreditCard,
  AlertTriangle,
  Sparkles,
  FlaskConical,
  Users,
  Headphones,
  RotateCcw,
  Timer,
  ChevronRight,
  Tag,
  CalendarClock,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const HEADING = { fontFamily: 'var(--font-heading)' };

function SectionCard({ title, action, children, className = '' }) {
  return (
    <div className={'rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm ' + className}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-base font-bold text-[#01332b]" style={HEADING}>
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, color = '#0a7b6b' }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-[#e7e7e7] bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-[#05dd4d]"
    >
      <div className="rounded-lg p-2" style={{ backgroundColor: color + '15' }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <span className="text-sm font-bold text-[#01332b]" style={HEADING}>
        {label}
      </span>
    </Link>
  );
}

function TierBadge({ tier }) {
  const colors = {
    Bronze: 'bg-orange-100 text-orange-800',
    Silver: 'bg-gray-100 text-gray-700',
    Gold: 'bg-yellow-50 text-yellow-800 ring-1 ring-yellow-300',
    Platinum: 'bg-gradient bg-[#bffde3] text-[#01332b] ring-1 ring-[#05dd4d]',
  };
  return (
    <span
      className={'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ' + (colors[tier] || colors.Bronze)}
      style={HEADING}
    >
      {tier} Tier
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: invoices } = useInvoices();
  const { data: quotes } = useQuotes();
  const { data: subscriptions } = useSubscriptions();

  const [contracts, setContracts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [parties, setParties] = useState([]);

  useEffect(() => {
    Promise.all([
      import('@/lib/mock-data/contracts'),
      import('@/lib/mock-data/promotions'),
      import('@/lib/mock-data/parties'),
    ]).then(([c, p, pa]) => {
      setContracts(c.contracts);
      setPromotions(p.promotions);
      setParties(pa.parties);
    });
  }, []);

  if (ordersLoading) return <DashboardSkeleton />;

  const role = user?.role;

  // Route to role-specific view
  const View = {
    orthodontist: OrthodontistView,
    dso: OrthodontistView, // DSO uses the same customer-focused view
    sales_rep: SalesRepView,
    ar: ARView,
    csr: CSRView,
    operations: OperationsView,
    ap: APView,
  }[role] || OrthodontistView;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-[#01332b]" style={HEADING}>
          Hi, {user?.firstName || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">
          Welcome to your Solventum Ortho Portal &mdash; here is your overview.
        </p>
      </div>

      <View
        user={user}
        orders={orders || []}
        invoices={invoices || []}
        quotes={quotes || []}
        subscriptions={subscriptions || []}
        contracts={contracts}
        promotions={promotions}
        parties={parties}
      />
    </div>
  );
}

// ===========================================================================
// ORTHODONTIST / DSO VIEW
// ===========================================================================

function OrthodontistView({ user, orders, invoices, subscriptions, contracts, promotions }) {
  // Derive data from the user's organization
  const orgId = user?.organizationId;
  const myContract = contracts.find((c) => c.customerId === orgId) || contracts[0];
  const openBalance = invoices
    .filter((i) => i.status === 'Open' || i.status === 'Overdue' || i.status === 'Partial')
    .reduce((sum, i) => sum + (i.amountDue || 0), 0);
  const openOrders = orders.filter(
    (o) => o.status === 'Submitted' || o.status === 'Confirmed' || o.status === 'Shipped'
  ).length;
  const activeSubs = subscriptions.filter((s) => s.status === 'Active').length;
  const pendingSamples = 2; // mock

  // Tier progress
  const tierPct = myContract
    ? Math.round(
        ((myContract.currentAnnualSpend || 0) /
          (myContract.minimumAnnualCommitment
            ? (myContract.minimumAnnualCommitment * 2 > (myContract.currentAnnualSpend || 0)
                ? myContract.minimumAnnualCommitment * 2
                : 75000)
            : 75000)) *
          100
      )
    : 0;

  // Tier thresholds for progress ring
  const tierThresholds = { Bronze: 12000, Silver: 25000, Gold: 75000, Platinum: null };
  const nextTierName = myContract?.tierLevel === 'Gold' ? 'Platinum' : myContract?.tierLevel === 'Silver' ? 'Gold' : myContract?.tierLevel === 'Bronze' ? 'Silver' : null;
  const nextThreshold = nextTierName ? tierThresholds[nextTierName] : null;
  const actualPct = nextThreshold
    ? Math.min(Math.round(((myContract?.currentAnnualSpend || 0) / nextThreshold) * 100), 99)
    : 100;

  // Spending by category
  const categories = myContract?.specialPricing
    ? [
        { name: 'Ceramic Brackets', amount: 18200, pct: 42 },
        { name: 'Adhesives', amount: 8500, pct: 20 },
        { name: 'Archwires', amount: 6800, pct: 16 },
        { name: 'Aligners', amount: 5400, pct: 13 },
        { name: 'Other Supplies', amount: 3900, pct: 9 },
      ]
    : [];

  // Active promotions for this tier
  const applicablePromos = promotions.filter(
    (p) =>
      p.status === 'Active' &&
      p.eligibleTiers.includes(myContract?.tierLevel || 'Bronze')
  );

  // Contract expiry
  const daysToExpiry = myContract
    ? Math.max(0, Math.round((new Date(myContract.endDate) - new Date()) / 86400000))
    : 0;

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Outstanding Balance"
          value={formatCurrency(openBalance)}
          trend={-8.2}
          trendLabel="vs last month"
          icon={DollarSign}
        />
        <KpiCard
          title="Open Orders"
          value={openOrders}
          trend={12.5}
          trendLabel="vs last month"
          icon={ShoppingCart}
        />
        <KpiCard
          title="Active Subscriptions"
          value={activeSubs}
          trend={5.1}
          trendLabel="vs last month"
          icon={RefreshCw}
        />
        <KpiCard
          title="Pending Samples"
          value={pendingSamples}
          icon={FlaskConical}
        />
      </div>

      {/* DSO Location Breakdown */}
      {user?.role === 'dso' && (
        <SectionCard title="Locations">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Downtown Chicago', orders: 12, plans: 8, spend: '$18,400' },
              { name: 'Schaumburg', orders: 8, plans: 5, spend: '$12,200' },
              { name: 'Naperville', orders: 6, plans: 4, spend: '$9,800' },
              { name: 'Evanston', orders: 4, plans: 3, spend: '$7,100' },
            ].map(loc => (
              <div key={loc.name} className="rounded-lg border border-[#e7e7e7] p-4">
                <p className="text-sm font-bold text-[#01332b]" style={HEADING}>{loc.name}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#3c3e3f]">Orders this month</span>
                    <span className="font-bold text-[#01332b]">{loc.orders}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#3c3e3f]">Active plans</span>
                    <span className="font-bold text-[#01332b]">{loc.plans}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#3c3e3f]">Monthly spend</span>
                    <span className="font-bold text-[#0a7b6b]">{loc.spend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Contract + Tier Progress */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contract status */}
        <div className="lg:col-span-2">
          <SectionCard title="Contract Status">
            {myContract ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <TierBadge tier={myContract.tierLevel} />
                    <StatusBadge status={myContract.status} />
                  </div>
                  <p className="text-sm text-[#3c3e3f]">
                    Contract <span className="font-semibold text-[#01332b]">{myContract.id}</span>
                    {' '}&middot;{' '}
                    {myContract.discountPercentage}% discount &middot;{' '}
                    {myContract.terms} terms
                  </p>
                  <p className="text-xs text-[#3c3e3f]">
                    Expires {formatDate(myContract.endDate)}
                    {daysToExpiry <= 90 && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded bg-[#FFEBEE] px-2 py-0.5 text-[11px] font-bold text-[#C62828]">
                        <AlertTriangle className="h-3 w-3" /> {daysToExpiry} days remaining
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>
                    Annual Spend
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#01332b]" style={HEADING}>
                    {formatCurrency(myContract.currentAnnualSpend)}
                  </p>
                  <p className="text-xs text-[#3c3e3f]">
                    of {formatCurrency(myContract.minimumAnnualCommitment)} commitment
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#3c3e3f]">No active contract found.</p>
            )}
          </SectionCard>
        </div>

        {/* Tier progress ring */}
        <SectionCard title="Tier Progress">
          <div className="flex flex-col items-center justify-center">
            <ProgressRing
              value={actualPct}
              label={nextTierName ? 'to ' + nextTierName : 'Max Tier'}
              sublabel={
                nextThreshold
                  ? formatCurrency(myContract?.currentAnnualSpend) + ' of ' + formatCurrency(nextThreshold)
                  : 'Top tier reached'
              }
            />
          </div>
        </SectionCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <QuickAction href="/orders" icon={ShoppingCart} label="Place Order" color="#0a7b6b" />
        <QuickAction href="/products" icon={FlaskConical} label="Request Sample" color="#19a591" />
        <QuickAction href="/products" icon={Sparkles} label="Clarity Portal" color="#01332b" />
        <QuickAction href="/invoices" icon={FileText} label="View Invoices" color="#1ccf93" />
      </div>

      {/* Spending by category + Promotions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Spending breakdown */}
        <SectionCard title="Spending by Category">
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-[#01332b]" style={HEADING}>{cat.name}</span>
                  <span className="text-sm font-semibold text-[#01332b]" style={HEADING}>
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#F5F5F5]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: cat.pct + '%',
                      background: 'linear-gradient(90deg, #0a7b6b, #05dd4d)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Active promotions */}
        <SectionCard
          title="Active Promotions"
          action={
            <Link href="/products" className="text-sm text-[#0a7b6b] hover:text-[#01332b]" style={HEADING}>
              View All
            </Link>
          }
        >
          {applicablePromos.length > 0 ? (
            <div className="space-y-3">
              {applicablePromos.slice(0, 3).map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-start gap-3 rounded-lg border border-[#e7e7e7] p-3 transition-colors hover:bg-[#bffde3]/20"
                >
                  <div className="rounded-lg bg-[#bffde3]/40 p-2">
                    <Tag className="h-4 w-4 text-[#0a7b6b]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#01332b] truncate" style={HEADING}>
                      {promo.name}
                    </p>
                    <p className="mt-0.5 text-xs text-[#3c3e3f] line-clamp-2">
                      {promo.description.slice(0, 100)}...
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      {promo.discountType === 'percentage' && (
                        <span className="inline-flex rounded bg-[#bffde3] px-2 py-0.5 text-[11px] font-bold text-[#0a7b6b]" style={HEADING}>
                          {promo.discountValue}% OFF
                        </span>
                      )}
                      {promo.discountType === 'free_product' && (
                        <span className="inline-flex rounded bg-[#bffde3] px-2 py-0.5 text-[11px] font-bold text-[#0a7b6b]" style={HEADING}>
                          FREE GIFT
                        </span>
                      )}
                      <span className="text-[11px] text-[#6e6e6e]">
                        Code: {promo.code}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#3c3e3f]">No promotions available for your tier.</p>
          )}
        </SectionCard>
      </div>

      {/* Revenue chart + Monthly Goals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <SectionCard title="Monthly Goals">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <ProgressRing value={73} label="Orders" sublabel="22 of 30" />
            <ProgressRing value={85} label="Revenue" sublabel="$352k of $415k" />
          </div>
        </SectionCard>
      </div>

      {/* Recent orders + Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity orders={orders} />
        <TasksWidget />
      </div>
    </>
  );
}

// ===========================================================================
// SALES REP VIEW
// ===========================================================================

function SalesRepView({ user, orders, invoices, contracts, parties }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Only show customer parties (not Solventum)
  const customerParties = parties.filter((p) => p.type !== 'manufacturer');

  const selectedParty = customerParties.find((p) => p.id === selectedCustomerId);

  // Customer-level contract
  const customerContract = selectedCustomerId
    ? contracts.find((c) => c.customerId === selectedCustomerId)
    : null;

  // Customer-level orders
  const customerOrders = selectedCustomerId
    ? orders.filter((o) => o.customer?.id === selectedCustomerId)
    : [];

  // Customer-level invoices
  const customerInvoices = selectedCustomerId
    ? invoices.filter((i) => i.customer?.id === selectedCustomerId)
    : [];

  const customerOpenBalance = customerInvoices
    .filter((i) => i.status === 'Open' || i.status === 'Overdue' || i.status === 'Partial')
    .reduce((sum, i) => sum + (i.amountDue || 0), 0);

  // Summary metrics
  const totalAccounts = customerParties.length;
  const expiringContracts = contracts.filter((c) => {
    const daysLeft = Math.round((new Date(c.endDate) - new Date()) / 86400000);
    return daysLeft <= 90 && daysLeft > 0 && c.status === 'Active';
  }).length;
  const totalOpenAR = invoices
    .filter((i) => i.status === 'Open' || i.status === 'Overdue' || i.status === 'Partial')
    .reduce((sum, i) => sum + (i.amountDue || 0), 0);

  return (
    <>
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <KpiCard
          title="Total Accounts"
          value={totalAccounts}
          trend={8.0}
          trendLabel="new this quarter"
          icon={Users}
        />
        <KpiCard
          title="Expiring Contracts"
          value={expiringContracts}
          trend={expiringContracts > 0 ? -1 * expiringContracts : 0}
          trendLabel="next 90 days"
          icon={CalendarClock}
        />
        <KpiCard
          title="Total Open AR"
          value={formatCurrency(totalOpenAR)}
          trend={-4.5}
          trendLabel="vs last month"
          icon={DollarSign}
        />
      </div>

      {/* Customer Selector */}
      <SectionCard title="Customer View">
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>
            Select Customer
          </label>
          <select
            className="w-full max-w-md rounded-lg border border-[#e7e7e7] bg-white px-4 py-2.5 text-sm text-[#01332b] shadow-sm focus:border-[#05dd4d] focus:outline-none focus:ring-2 focus:ring-[#05dd4d]/20"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
          >
            <option value="">-- Select a customer --</option>
            {customerParties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.tierLevel || 'No Tier'})
              </option>
            ))}
          </select>
        </div>

        {selectedParty && (
          <div className="mt-4 space-y-4">
            {/* Customer health summary */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e7e7e7]">
                    <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Customer</th>
                    <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Tier</th>
                    <th className="pb-2 pr-4 text-right text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Annual Spend</th>
                    <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Contract Expiry</th>
                    <th className="pb-2 text-right text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Open Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#e7e7e7]/50">
                    <td className="py-3 pr-4">
                      <div>
                        <p className="font-semibold text-[#01332b]" style={HEADING}>{selectedParty.name}</p>
                        <p className="text-xs text-[#3c3e3f]">{selectedParty.primaryContact?.name}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <TierBadge tier={selectedParty.tierLevel || 'Bronze'} />
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold text-[#01332b]" style={HEADING}>
                      {formatCurrency(selectedParty.annualSpend)}
                    </td>
                    <td className="py-3 pr-4 text-[#3c3e3f]">
                      {customerContract ? formatDate(customerContract.endDate) : '--'}
                    </td>
                    <td className="py-3 text-right font-semibold text-[#01332b]" style={HEADING}>
                      {formatCurrency(customerOpenBalance)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Customer recent orders */}
            {customerOrders.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-bold text-[#01332b]" style={HEADING}>Recent Orders</h4>
                <div className="space-y-2">
                  {customerOrders.slice(0, 5).map((o) => (
                    <Link
                      key={o.biId}
                      href={'/orders/' + o.biId}
                      className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-[#bffde3]/30"
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#01332b]" style={HEADING}>{o.biId}</p>
                        <p className="text-xs text-[#3c3e3f]">{o.biName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={o.status} />
                        <span className="text-sm font-semibold text-[#01332b]" style={HEADING}>
                          {formatCurrency(o.pricing?.total)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[#e7e7e7]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!selectedCustomerId && (
          <p className="py-4 text-center text-sm text-[#3c3e3f]">
            Select a customer above to view their account details.
          </p>
        )}
      </SectionCard>

      {/* Customer Health Overview Table */}
      <SectionCard title="Account Portfolio">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e7e7e7]">
                <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Account</th>
                <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Tier</th>
                <th className="pb-2 pr-4 text-right text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Annual Spend</th>
                <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Contract Expiry</th>
                <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Status</th>
                <th className="pb-2 text-right text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Open Balance</th>
              </tr>
            </thead>
            <tbody>
              {customerParties.map((party) => {
                const pContract = contracts.find((c) => c.customerId === party.id);
                const pInvoices = invoices.filter((i) => i.customer?.id === party.id);
                const pBalance = pInvoices
                  .filter((i) => i.status === 'Open' || i.status === 'Overdue' || i.status === 'Partial')
                  .reduce((sum, i) => sum + (i.amountDue || 0), 0);
                return (
                  <tr
                    key={party.id}
                    className="border-b border-[#e7e7e7]/50 transition-colors hover:bg-[#bffde3]/10 cursor-pointer"
                    onClick={() => setSelectedCustomerId(party.id)}
                  >
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-[#01332b]" style={HEADING}>{party.name}</p>
                      <p className="text-xs text-[#3c3e3f]">{party.primaryContact?.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <TierBadge tier={party.tierLevel || 'Bronze'} />
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold text-[#01332b]" style={HEADING}>
                      {formatCurrency(party.annualSpend)}
                    </td>
                    <td className="py-3 pr-4 text-[#3c3e3f]">
                      {pContract ? formatDate(pContract.endDate) : '--'}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={party.accountStatus} />
                    </td>
                    <td className={'py-3 text-right font-semibold ' + (pBalance > 0 ? 'text-[#C62828]' : 'text-[#01332b]')} style={HEADING}>
                      {formatCurrency(pBalance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <QuickAction href="/orders" icon={ShoppingCart} label="Place Order (On Behalf)" color="#0a7b6b" />
        <QuickAction href="/products" icon={FlaskConical} label="Request Sample" color="#19a591" />
        <QuickAction href="/quotes" icon={ClipboardList} label="View Treatment Plans" color="#01332b" />
      </div>

      {/* Revenue chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <TasksWidget />
      </div>
    </>
  );
}

// ===========================================================================
// AR (ACCOUNTS RECEIVABLE) VIEW
// ===========================================================================

function ARView({ invoices, contracts, orders }) {
  // KPI calculations
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + (i.amountDue || 0), 0);

  const openInvoices = invoices.filter(
    (i) => i.status === 'Open' || i.status === 'Overdue' || i.status === 'Partial'
  );
  const openARBalance = openInvoices.reduce((sum, i) => sum + (i.amountDue || 0), 0);

  const paidThisMonth = invoices
    .filter((i) => {
      if (!i.paidDate) return false;
      const paid = new Date(i.paidDate);
      const now = new Date();
      return paid.getMonth() === now.getMonth() && paid.getFullYear() === now.getFullYear();
    })
    .reduce((sum, i) => sum + (i.amountPaid || 0), 0);

  const expiringContracts = contracts.filter((c) => {
    const daysLeft = Math.round((new Date(c.endDate) - new Date()) / 86400000);
    return daysLeft <= 90 && daysLeft > 0;
  }).length;

  // Aging buckets
  const now = new Date();
  const aging = { current: 0, '30': 0, '60': 0, '90+': 0 };
  openInvoices.forEach((inv) => {
    const due = new Date(inv.dueDate);
    const daysOverdue = Math.floor((now - due) / 86400000);
    if (daysOverdue <= 0) aging.current += inv.amountDue || 0;
    else if (daysOverdue <= 30) aging['30'] += inv.amountDue || 0;
    else if (daysOverdue <= 60) aging['60'] += inv.amountDue || 0;
    else aging['90+'] += inv.amountDue || 0;
  });
  const maxAging = Math.max(aging.current, aging['30'], aging['60'], aging['90+'], 1);

  // Recent payments
  const recentPayments = invoices
    .filter((i) => i.paidDate)
    .sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate))
    .slice(0, 6);

  // Expiring contracts details
  const expiringContractsList = contracts
    .filter((c) => {
      const daysLeft = Math.round((new Date(c.endDate) - new Date()) / 86400000);
      return daysLeft <= 90 && daysLeft > 0;
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Overdue"
          value={formatCurrency(totalOverdue)}
          trend={totalOverdue > 0 ? -15.2 : 0}
          trendLabel="vs last month"
          icon={AlertTriangle}
        />
        <KpiCard
          title="Open AR Balance"
          value={formatCurrency(openARBalance)}
          trend={-4.1}
          trendLabel="vs last month"
          icon={DollarSign}
        />
        <KpiCard
          title="Payments This Month"
          value={formatCurrency(paidThisMonth)}
          trend={22.3}
          trendLabel="vs last month"
          icon={CreditCard}
        />
        <KpiCard
          title="Expiring Contracts"
          value={expiringContracts}
          icon={CalendarClock}
        />
      </div>

      {/* Aging Buckets */}
      <SectionCard title="Aging Buckets">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Current', key: 'current', color: '#05dd4d' },
            { label: '1-30 Days', key: '30', color: '#F9A825' },
            { label: '31-60 Days', key: '60', color: '#EF6C00' },
            { label: '90+ Days', key: '90+', color: '#C62828' },
          ].map((bucket) => (
            <div key={bucket.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>
                  {bucket.label}
                </span>
              </div>
              <p className="text-xl font-bold text-[#01332b]" style={HEADING}>
                {formatCurrency(aging[bucket.key])}
              </p>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#F5F5F5]">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: Math.round((aging[bucket.key] / maxAging) * 100) + '%',
                    backgroundColor: bucket.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Recent Payments + Contract Expirations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent payments */}
        <SectionCard
          title="Recent Payments"
          action={
            <Link href="/invoices" className="text-sm text-[#0a7b6b] hover:text-[#01332b]" style={HEADING}>
              View All
            </Link>
          }
        >
          <div className="space-y-3">
            {recentPayments.map((inv) => (
              <Link
                key={inv.biId}
                href={'/invoices/' + inv.biId}
                className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-[#bffde3]/30"
              >
                <div>
                  <p className="text-sm font-semibold text-[#01332b]" style={HEADING}>
                    {inv.invoiceNumber}
                  </p>
                  <p className="text-xs text-[#3c3e3f]">
                    {inv.customer?.name} &middot; Paid {formatDate(inv.paidDate)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-[#2E7D32]" style={HEADING}>
                  {formatCurrency(inv.amountPaid)}
                </span>
              </Link>
            ))}
            {recentPayments.length === 0 && (
              <p className="py-4 text-center text-sm text-[#3c3e3f]">No recent payments.</p>
            )}
          </div>
        </SectionCard>

        {/* Contract expirations */}
        <SectionCard title="Contract Expirations (Next 90 Days)">
          {expiringContractsList.length > 0 ? (
            <div className="space-y-3">
              {expiringContractsList.map((ctr) => {
                const daysLeft = Math.max(
                  0,
                  Math.round((new Date(ctr.endDate) - new Date()) / 86400000)
                );
                return (
                  <div
                    key={ctr.id}
                    className="flex items-center justify-between rounded-md border border-[#e7e7e7] p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#01332b]" style={HEADING}>
                        {ctr.customerName}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <TierBadge tier={ctr.tierLevel} />
                        <span className="text-xs text-[#3c3e3f]">
                          {formatCurrency(ctr.currentAnnualSpend)}/yr
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#C62828]" style={HEADING}>
                        {daysLeft} days
                      </p>
                      <p className="text-xs text-[#3c3e3f]">
                        {formatDate(ctr.endDate)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-[#3c3e3f]">
              No contracts expiring in the next 90 days.
            </p>
          )}
        </SectionCard>
      </div>

      {/* Revenue chart + Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <TasksWidget />
      </div>
    </>
  );
}

// ===========================================================================
// CSR (CUSTOMER SERVICE REP) VIEW
// ===========================================================================

function CSRView({ orders, invoices }) {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    Promise.all([
      import('@/lib/mock-data/service-requests'),
      import('@/lib/mock-data/returns'),
    ]).then(([sr, ret]) => {
      setServiceRequests(sr.serviceRequests || sr.default || []);
      setReturns(ret.returns || ret.default || []);
    });
  }, []);

  // KPI calcs
  const openSRs = serviceRequests.filter(
    (sr) => sr.status === 'Open' || sr.status === 'In Progress' || sr.status === 'Awaiting Parts'
  );
  const ordersNeedingAttention = orders.filter(
    (o) => o.status === 'Submitted' || o.priority === 'High'
  ).length;
  const returnsInProgress = returns.filter(
    (r) => r.status === 'Requested' || r.status === 'Approved' || r.status === 'In Transit' || r.status === 'Inspected'
  ).length;
  const avgResolution = '2.4 days'; // mock

  // Touchless order rate
  const touchlessOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length;
  const totalOrders = orders.length;
  const touchlessRate = totalOrders > 0 ? Math.round((touchlessOrders / totalOrders) * 100) : 0;

  // Service request priority colors
  const priorityColor = {
    Critical: 'text-[#C62828] bg-[#FFEBEE]',
    High: 'text-[#EF6C00] bg-orange-50',
    Standard: 'text-[#0a7b6b] bg-[#bffde3]/40',
    Low: 'text-[#3c3e3f] bg-[#F5F5F5]',
  };

  // Recent returns needing processing
  const pendingReturns = returns
    .filter((r) => r.status !== 'Credited' && r.status !== 'Denied')
    .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Open Service Requests"
          value={openSRs.length}
          trend={openSRs.length > 3 ? -12 : 8}
          trendLabel="vs last week"
          icon={Headphones}
        />
        <KpiCard
          title="Orders Requiring Attention"
          value={ordersNeedingAttention}
          trend={-5.0}
          trendLabel="vs last week"
          icon={AlertTriangle}
        />
        <KpiCard
          title="Returns in Progress"
          value={returnsInProgress}
          icon={RotateCcw}
        />
        <KpiCard
          title="Avg Resolution Time"
          value={avgResolution}
          trend={-18.5}
          trendLabel="faster this month"
          icon={Timer}
        />
        <KpiCard
          title="Touchless Order Rate"
          value={touchlessRate + '%'}
          trend={5.3}
          trendLabel="improving"
          icon={Sparkles}
        />
      </div>

      {/* Open Service Requests Table */}
      <SectionCard
        title="Open Service Requests"
        action={
          <Link href="/support" className="text-sm text-[#0a7b6b] hover:text-[#01332b]" style={HEADING}>
            View All
          </Link>
        }
      >
        {openSRs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e7e7e7]">
                  <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>ID</th>
                  <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Subject</th>
                  <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Customer</th>
                  <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Priority</th>
                  <th className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Status</th>
                  <th className="pb-2 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>Created</th>
                </tr>
              </thead>
              <tbody>
                {openSRs.slice(0, 8).map((sr) => (
                  <tr key={sr.id} className="border-b border-[#e7e7e7]/50 transition-colors hover:bg-[#bffde3]/10">
                    <td className="py-3 pr-4 font-semibold text-[#01332b]" style={HEADING}>
                      {sr.id}
                    </td>
                    <td className="py-3 pr-4 max-w-[200px]">
                      <p className="truncate text-[#01332b]">{sr.subject}</p>
                      <p className="truncate text-xs text-[#3c3e3f]">{sr.productName}</p>
                    </td>
                    <td className="py-3 pr-4 text-[#3c3e3f]">{sr.customer?.name}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ' + (priorityColor[sr.priority] || priorityColor.Standard)}
                        style={HEADING}
                      >
                        {sr.priority}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={sr.status} />
                    </td>
                    <td className="py-3 text-xs text-[#3c3e3f]">
                      {formatDate(sr.requestedDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-[#3c3e3f]">No open service requests.</p>
        )}
      </SectionCard>

      {/* Returns + Quick action */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Returns needing processing */}
        <SectionCard
          title="Returns Needing Processing"
          action={
            <Link href="/returns" className="text-sm text-[#0a7b6b] hover:text-[#01332b]" style={HEADING}>
              View All
            </Link>
          }
        >
          {pendingReturns.length > 0 ? (
            <div className="space-y-3">
              {pendingReturns.slice(0, 5).map((ret) => (
                <div
                  key={ret.id}
                  className="flex items-center justify-between rounded-md border border-[#e7e7e7] p-3 transition-colors hover:bg-[#bffde3]/10"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#01332b]" style={HEADING}>{ret.id}</p>
                      <StatusBadge status={ret.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-[#3c3e3f] truncate">
                      {ret.items?.[0]?.productName} &middot; {ret.customer?.name}
                    </p>
                    <p className="text-xs text-[#3c3e3f]">
                      Type: {ret.type} &middot; Qty: {ret.items?.[0]?.quantity}
                    </p>
                  </div>
                  <div className="ml-3 text-right shrink-0">
                    <p className="text-sm font-semibold text-[#01332b]" style={HEADING}>
                      {formatCurrency((ret.items?.[0]?.unitValue || 0) * (ret.items?.[0]?.quantity || 0))}
                    </p>
                    <p className="text-xs text-[#3c3e3f]">{formatDate(ret.requestDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-[#3c3e3f]">No returns needing processing.</p>
          )}
        </SectionCard>

        {/* Quick actions + Tasks */}
        <div className="space-y-6">
          {/* Quick action */}
          <div className="grid grid-cols-1 gap-4">
            <QuickAction href="/support" icon={Headphones} label="Create Service Request" color="#0a7b6b" />
            <QuickAction href="/returns" icon={RotateCcw} label="Process Return" color="#19a591" />
            <QuickAction href="/orders" icon={ShoppingCart} label="View Orders" color="#01332b" />
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity orders={orders} />
        <TasksWidget />
      </div>
    </>
  );
}

// ===========================================================================
// OPERATIONS VIEW
// ===========================================================================

function OperationsView({ user }) {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    import('@/lib/mock-data/api-partners').then((mod) => {
      setPartners(mod.apiPartners || mod.default || []);
    });
  }, []);

  const activePartners = partners.filter(p => p.status === 'Active').length;
  const pendingPartners = partners.filter(p => p.status === 'Pending').length;
  const totalOrders = partners.reduce((sum, p) => sum + (p.usage?.ordersSubmitted || 0), 0);
  const totalQueries = partners.reduce((sum, p) => sum + (p.usage?.catalogQueries || 0) + (p.usage?.pricingQueries || 0) + (p.usage?.statusLookups || 0), 0);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active Partners" value={activePartners} icon={Users} />
        <KpiCard title="Pending Onboarding" value={pendingPartners} icon={AlertTriangle} />
        <KpiCard title="API Orders (Total)" value={totalOrders.toLocaleString()} icon={ShoppingCart} />
        <KpiCard title="API Queries (Total)" value={totalQueries.toLocaleString()} icon={FileText} />
      </div>

      <SectionCard title="Partner Status">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e7e7e7]">
                {['Partner', 'Status', 'Agreement', 'Orders', 'API Queries', 'Rate Limit'].map(h => (
                  <th key={h} className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id} className="border-b border-[#e7e7e7]/50 hover:bg-[#bffde3]/10">
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-[#01332b]" style={HEADING}>{p.name}</p>
                    <p className="text-xs text-[#3c3e3f]">{p.contact?.email}</p>
                  </td>
                  <td className="py-3 pr-4"><StatusBadge status={p.status} /></td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      p.agreementStatus === 'Signed' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF8E1] text-[#F57F17]'
                    }`} style={HEADING}>{p.agreementStatus}</span>
                  </td>
                  <td className="py-3 pr-4 text-[#01332b] font-semibold" style={HEADING}>{p.usage?.ordersSubmitted?.toLocaleString() || 0}</td>
                  <td className="py-3 pr-4 text-[#3c3e3f]">{((p.usage?.catalogQueries || 0) + (p.usage?.pricingQueries || 0) + (p.usage?.statusLookups || 0)).toLocaleString()}</td>
                  <td className="py-3 pr-4 text-[#3c3e3f]">{p.rateLimit?.requestsPerMinute || 0}/min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <QuickAction href="/partners" icon={Users} label="Manage Partners" color="#0a7b6b" />
        <QuickAction href="/documentation" icon={FileText} label="API Documentation" color="#19a591" />
        <QuickAction href="/support" icon={Headphones} label="Support Tickets" color="#01332b" />
      </div>
    </>
  );
}

// ===========================================================================
// AP (ACCOUNTS PAYABLE) VIEW
// ===========================================================================

function APView({ user, invoices }) {
  const orgId = user?.organizationId;

  // Filter invoices to user's org
  const myInvoices = orgId ? invoices.filter(i => i.customer?.id === orgId) : invoices;
  const openBalance = myInvoices
    .filter(i => i.status === 'Open' || i.status === 'Overdue' || i.status === 'Partial')
    .reduce((sum, i) => sum + (i.amountDue || 0), 0);
  const overdueAmount = myInvoices
    .filter(i => i.status === 'Overdue')
    .reduce((sum, i) => sum + (i.amountDue || 0), 0);
  const paidThisMonth = myInvoices
    .filter(i => {
      if (!i.paidDate) return false;
      const paid = new Date(i.paidDate);
      const now = new Date();
      return paid.getMonth() === now.getMonth() && paid.getFullYear() === now.getFullYear();
    })
    .reduce((sum, i) => sum + (i.amountPaid || 0), 0);
  const totalInvoices = myInvoices.length;

  const recentInvoices = myInvoices
    .sort((a, b) => new Date(b.createdAt || b.biCreatedAt) - new Date(a.createdAt || a.biCreatedAt))
    .slice(0, 8);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Outstanding Balance" value={formatCurrency(openBalance)} icon={DollarSign} />
        <KpiCard title="Overdue Amount" value={formatCurrency(overdueAmount)} trend={overdueAmount > 0 ? -1 : 0} trendLabel="needs attention" icon={AlertTriangle} />
        <KpiCard title="Paid This Month" value={formatCurrency(paidThisMonth)} trend={15.2} trendLabel="vs last month" icon={CreditCard} />
        <KpiCard title="Total Invoices" value={totalInvoices} icon={FileText} />
      </div>

      <SectionCard
        title="Recent Invoices"
        action={<Link href="/invoices" className="text-sm text-[#0a7b6b] hover:text-[#01332b]" style={HEADING}>View All</Link>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e7e7e7]">
                {['Invoice #', 'Date', 'Amount', 'Status', 'Due Date'].map(h => (
                  <th key={h} className="pb-2 pr-4 text-left text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={HEADING}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(inv => (
                <tr key={inv.biId} className="border-b border-[#e7e7e7]/50 hover:bg-[#bffde3]/10">
                  <td className="py-3 pr-4">
                    <Link href={'/invoices/' + inv.biId} className="font-semibold text-[#0a7b6b] hover:text-[#01332b]" style={HEADING}>
                      {inv.invoiceNumber || inv.biId}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-[#3c3e3f]">{formatDate(inv.createdAt || inv.biCreatedAt)}</td>
                  <td className="py-3 pr-4 font-semibold text-[#01332b]" style={HEADING}>{formatCurrency(inv.pricing?.total || inv.amountDue || 0)}</td>
                  <td className="py-3 pr-4"><StatusBadge status={inv.status} /></td>
                  <td className="py-3 pr-4 text-[#3c3e3f]">{formatDate(inv.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-4">
        <QuickAction href="/invoices" icon={FileText} label="View All Invoices" color="#0a7b6b" />
        <QuickAction href="/support" icon={Headphones} label="Contact Support" color="#01332b" />
      </div>
    </>
  );
}
