'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DetailCard } from '@/components/detail/detail-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Calendar, Award, TrendingUp, ChevronDown, ChevronUp, Plus, Clock, RotateCcw, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const TIER_BADGE_COLORS = {
  Bronze: { bg: '#EFEBE9', text: '#5D4037' },
  Silver: { bg: '#F5F5F5', text: '#616161' },
  Gold: { bg: '#FFF8E1', text: '#F57F17' },
  Platinum: { bg: '#E8EAF6', text: '#283593' },
};

const TIER_OPTIONS = ['Bronze', 'Silver', 'Gold', 'Platinum'];

function TierBadge({ tier }) {
  if (!tier) return null;
  const colors = TIER_BADGE_COLORS[tier] || { bg: '#F5F5F5', text: '#3c3e3f' };
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
      style={{ fontFamily: 'var(--font-heading)', backgroundColor: colors.bg, color: colors.text }}
    >
      {tier}
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

export default function ContractsPage() {
  const { user } = useAuthStore();
  const role = user?.role;
  const isInternal = role === 'sales_rep' || role === 'ar';
  const isExternal = role === 'orthodontist' || role === 'dso';

  const [contractsData, setContractsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('pricing');

  // Dialog states
  const [priceChangeOpen, setPriceChangeOpen] = useState(false);
  const [renewalOpen, setRenewalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  // Price change form
  const [pcProductId, setPcProductId] = useState('');
  const [pcNewPrice, setPcNewPrice] = useState('');
  const [pcEffectiveDate, setPcEffectiveDate] = useState('');
  const [pcNotes, setPcNotes] = useState('');

  // Renewal form
  const [renewalTier, setRenewalTier] = useState('');
  const [renewalNotes, setRenewalNotes] = useState('');
  const [renewalAtRenewal, setRenewalAtRenewal] = useState(true);

  useEffect(() => {
    import('@/lib/mock-data/contracts').then((mod) => {
      const data = mod.contracts.map((c) => ({
        ...c,
        scheduledChanges: [...(c.scheduledChanges || [])],
        renewal: c.renewal ? { ...c.renewal } : null,
      }));
      setContractsData(data);
      setLoading(false);
    });
  }, []);

  // Filter contracts for external roles
  const visibleContracts = useMemo(() => {
    let list = contractsData;
    if (isExternal && user?.organizationId) {
      list = list.filter((c) => c.customerId === user.organizationId);
    }
    if (statusFilter) {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.customerName.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [contractsData, isExternal, user, statusFilter, search]);

  // Summary stats
  const stats = useMemo(() => {
    const active = contractsData.filter((c) => c.status === 'Active').length;
    const pending = contractsData.filter((c) => c.status === 'Pending').length;
    const totalSpend = contractsData.reduce((sum, c) => sum + (c.currentAnnualSpend || 0), 0);
    const pendingChanges = contractsData.reduce((sum, c) => sum + (c.scheduledChanges?.filter((sc) => sc.status === 'Pending').length || 0), 0);
    return { active, pending, totalSpend, pendingChanges };
  }, [contractsData]);

  // Helpers for checking expiring-soon contracts
  function isExpiringSoon(contract) {
    if (!contract.endDate) return false;
    const end = new Date(contract.endDate);
    const now = new Date();
    const diff = (end - now) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 60;
  }

  // Toggle expand
  function handleRowClick(contractId) {
    if (expandedId === contractId) {
      setExpandedId(null);
    } else {
      setExpandedId(contractId);
      setActiveTab('pricing');
    }
  }

  // Open price change dialog
  function openPriceChange(contract) {
    setSelectedContract(contract);
    setPcProductId('');
    setPcNewPrice('');
    setPcEffectiveDate('');
    setPcNotes('');
    setPriceChangeOpen(true);
  }

  // Submit price change
  function handleSubmitPriceChange() {
    if (!selectedContract || !pcProductId || !pcNewPrice || !pcEffectiveDate) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const effectiveDate = new Date(pcEffectiveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (effectiveDate <= today) {
      toast.error('Effective date must be in the future.');
      return;
    }

    const product = selectedContract.specialPricing.find((p) => p.productId === pcProductId);
    if (!product) return;

    const newChange = {
      id: 'SC-' + String(Date.now()).slice(-6),
      productId: pcProductId,
      productName: product.productName,
      currentPrice: product.contractPrice,
      newPrice: parseFloat(pcNewPrice),
      effectiveDate: pcEffectiveDate,
      status: 'Pending',
      createdBy: user?.name || 'Unknown',
      notes: pcNotes,
    };

    setContractsData((prev) =>
      prev.map((c) =>
        c.id === selectedContract.id
          ? { ...c, scheduledChanges: [...c.scheduledChanges, newChange] }
          : c
      )
    );

    toast.success('Price change scheduled for ' + product.productName + ' effective ' + formatDate(pcEffectiveDate) + '.');
    setPriceChangeOpen(false);
  }

  // Remove a scheduled change
  function handleBackOutChange(contractId, changeId) {
    setContractsData((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? { ...c, scheduledChanges: c.scheduledChanges.filter((sc) => sc.id !== changeId) }
          : c
      )
    );
    toast.success('Scheduled price change removed.');
  }

  // Open renewal dialog
  function openRenewal(contract) {
    setSelectedContract(contract);
    setRenewalTier(contract.tierLevel || '');
    setRenewalNotes('');
    setRenewalAtRenewal(true);
    setRenewalOpen(true);
  }

  // Submit renewal config
  function handleSubmitRenewal() {
    if (!selectedContract) return;

    setContractsData((prev) =>
      prev.map((c) =>
        c.id === selectedContract.id
          ? {
              ...c,
              renewal: {
                ...c.renewal,
                autoRenew: true,
                proposedTier: renewalTier,
                renewalNotes: renewalNotes,
                effectiveAtRenewal: renewalAtRenewal,
              },
            }
          : c
      )
    );

    toast.success('Renewal configuration updated for ' + selectedContract.customerName + '.');
    setRenewalOpen(false);
  }

  // Get selected product for price change dialog
  const selectedPcProduct = useMemo(() => {
    if (!selectedContract || !pcProductId) return null;
    return selectedContract.specialPricing.find((p) => p.productId === pcProductId);
  }, [selectedContract, pcProductId]);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Contracts</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Manage pricing contracts, scheduled changes, and renewals</p>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg border border-[#e7e7e7] bg-[#F5F5F5]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Contracts</h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">Manage pricing contracts, scheduled changes, and renewals</p>
      </div>

      {/* Stats row */}
      {isInternal && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0a7b6b]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Active Contracts</span>
            </div>
            <div className="mt-1 text-xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.active}</div>
          </div>
          <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#F9A825]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Pending</span>
            </div>
            <div className="mt-1 text-xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.pending}</div>
          </div>
          <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#0a7b6b]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Total Annual Spend</span>
            </div>
            <div className="mt-1 text-xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(stats.totalSpend)}</div>
          </div>
          <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#F57F17]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Pending Changes</span>
            </div>
            <div className="mt-1 text-xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{stats.pendingChanges}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect
          label="All Statuses"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'Active', label: 'Active' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Expired', label: 'Expired' },
            { value: 'Cancelled', label: 'Cancelled' },
          ]}
        />
      </FiltersBar>

      {/* Contracts table */}
      <div className="overflow-x-auto rounded-lg border border-[#e7e7e7] bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e7e7e7] bg-[#F5F5F5]">
              <th className="w-8 px-3 py-3" />
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Contract ID</th>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Customer</th>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Type</th>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Tier</th>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Status</th>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Start Date</th>
              <th className="px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>End Date</th>
              <th className="px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Annual Spend</th>
              <th className="px-3 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Discount %</th>
            </tr>
          </thead>
          <tbody>
            {visibleContracts.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-12 text-center text-sm text-[#3c3e3f]">
                  No contracts found.
                </td>
              </tr>
            ) : (
              visibleContracts.map((contract) => {
                const isExpanded = expandedId === contract.id;
                const expiring = isExpiringSoon(contract);
                return (
                  <ContractRow
                    key={contract.id}
                    contract={contract}
                    isExpanded={isExpanded}
                    expiring={expiring}
                    isInternal={isInternal}
                    onToggle={() => handleRowClick(contract.id)}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onOpenPriceChange={() => openPriceChange(contract)}
                    onBackOutChange={(changeId) => handleBackOutChange(contract.id, changeId)}
                    onOpenRenewal={() => openRenewal(contract)}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Schedule Price Change Dialog */}
      <Dialog open={priceChangeOpen} onOpenChange={setPriceChangeOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-heading)' }}>Schedule Price Change</DialogTitle>
            <DialogDescription>
              Schedule a future price adjustment for {selectedContract?.customerName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Product selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Product</Label>
              <Select value={pcProductId} onValueChange={setPcProductId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select product..." />
                </SelectTrigger>
                <SelectContent>
                  {(selectedContract?.specialPricing || []).map((p) => (
                    <SelectItem key={p.productId} value={p.productId}>{p.productName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current price (read-only) */}
            {selectedPcProduct && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Current Contract Price</Label>
                <Input value={formatCurrency(selectedPcProduct.contractPrice)} disabled className="bg-[#F5F5F5]" />
              </div>
            )}

            {/* New price */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>New Price</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={pcNewPrice}
                onChange={(e) => setPcNewPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>

            {/* Effective date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Effective Date</Label>
              <Input
                type="date"
                value={pcEffectiveDate}
                onChange={(e) => setPcEffectiveDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Notes</Label>
              <Textarea
                value={pcNotes}
                onChange={(e) => setPcNotes(e.target.value)}
                placeholder="Reason for price adjustment..."
                rows={3}
              />
            </div>

            {/* Preview diff */}
            {selectedPcProduct && pcNewPrice && (
              <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Change Preview</div>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <span className="text-[#C62828] line-through">{formatCurrency(selectedPcProduct.contractPrice)}</span>
                  <span className="text-[#3c3e3f]">-&gt;</span>
                  <span className="font-bold text-[#2E7D32]">{formatCurrency(parseFloat(pcNewPrice))}</span>
                </div>
                {pcEffectiveDate && (
                  <div className="mt-1 text-xs text-[#3c3e3f]">
                    Effective: {formatDate(pcEffectiveDate)}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <button
              onClick={() => setPriceChangeOpen(false)}
              className="rounded-md border border-[#e7e7e7] px-4 py-2 text-sm font-bold text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitPriceChange}
              className="rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#087a69]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Schedule Change
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renewal Configuration Dialog */}
      <Dialog open={renewalOpen} onOpenChange={setRenewalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-heading)' }}>Configure Renewal</DialogTitle>
            <DialogDescription>
              Set renewal parameters for {selectedContract?.customerName}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Current renewal info */}
            {selectedContract?.renewal && (
              <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Current Renewal</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[#3c3e3f]">Next Renewal:</span>{' '}
                    <span className="font-semibold text-[#01332b]">{formatDate(selectedContract.renewal.nextRenewalDate)}</span>
                  </div>
                  <div>
                    <span className="text-[#3c3e3f]">Period:</span>{' '}
                    <span className="font-semibold capitalize text-[#01332b]">{selectedContract.renewal.period}</span>
                  </div>
                </div>
              </div>
            )}

            {/* New tier */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>New Tier</Label>
              <Select value={renewalTier} onValueChange={setRenewalTier}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tier..." />
                </SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((tier) => (
                    <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pricing notes */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>New Pricing Notes</Label>
              <Textarea
                value={renewalNotes}
                onChange={(e) => setRenewalNotes(e.target.value)}
                placeholder="Notes about new pricing terms..."
                rows={3}
              />
            </div>

            {/* Effective at renewal checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="effective-at-renewal"
                checked={renewalAtRenewal}
                onChange={(e) => setRenewalAtRenewal(e.target.checked)}
                className="h-4 w-4 rounded border-[#e7e7e7] text-[#0a7b6b] focus:ring-[#0a7b6b]"
              />
              <label htmlFor="effective-at-renewal" className="text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>
                Apply changes effective at renewal date
              </label>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setRenewalOpen(false)}
              className="rounded-md border border-[#e7e7e7] px-4 py-2 text-sm font-bold text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRenewal}
              className="rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#087a69]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Save Renewal Config
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


/* ===== Contract Row Component ===== */

function ContractRow({
  contract,
  isExpanded,
  expiring,
  isInternal,
  onToggle,
  activeTab,
  onTabChange,
  onOpenPriceChange,
  onBackOutChange,
  onOpenRenewal,
}) {
  const pendingCount = contract.scheduledChanges?.filter((sc) => sc.status === 'Pending').length || 0;

  return (
    <>
      {/* Main row */}
      <tr
        onClick={onToggle}
        className={'border-b border-[#e7e7e7] cursor-pointer transition-colors hover:bg-[#F5F5F5]' + (isExpanded ? ' bg-[#F5F5F5]' : '') + (expiring ? ' border-l-4 border-l-amber-400' : '')}
      >
        <td className="px-3 py-3 text-center">
          {isExpanded ? (
            <ChevronUp className="mx-auto h-4 w-4 text-[#3c3e3f]" />
          ) : (
            <ChevronDown className="mx-auto h-4 w-4 text-[#3c3e3f]" />
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-sm font-semibold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>
          {contract.id}
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700">{pendingCount}</span>
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>
          <div className="flex items-center gap-2">
            {contract.customerName}
            {expiring && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
          </div>
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-sm capitalize text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>{contract.type}</td>
        <td className="whitespace-nowrap px-3 py-3"><TierBadge tier={contract.tierLevel} /></td>
        <td className="whitespace-nowrap px-3 py-3"><StatusBadge status={contract.status} /></td>
        <td className="whitespace-nowrap px-3 py-3 text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>{formatDate(contract.startDate)}</td>
        <td className="whitespace-nowrap px-3 py-3 text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>
          <span className={expiring ? 'font-semibold text-amber-600' : ''}>{formatDate(contract.endDate)}</span>
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
          {formatCurrency(contract.currentAnnualSpend)}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-right text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
          {contract.discountPercentage}%
        </td>
      </tr>

      {/* Expanded detail */}
      {isExpanded && (
        <tr>
          <td colSpan={10} className="border-b border-[#e7e7e7] bg-white px-0 py-0">
            <div className="px-6 py-6">
              {/* Summary card */}
              <DetailCard title="Contract Summary" className="mb-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Customer</div>
                    <div className="mt-1 text-sm font-semibold text-[#01332b]">{contract.customerName}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Tier & Discount</div>
                    <div className="mt-1 flex items-center gap-2">
                      <TierBadge tier={contract.tierLevel} />
                      <span className="text-sm font-semibold text-[#01332b]">{contract.discountPercentage}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Contract Period</div>
                    <div className="mt-1 text-sm text-[#01332b]">{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Payment Terms</div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-[#01332b]">
                      <span>{contract.terms}</span>
                      <span className="text-xs text-[#3c3e3f]">
                        Auto-Renew: <span className={'font-semibold ' + (contract.autoRenew ? 'text-[#2E7D32]' : 'text-[#C62828]')}>{contract.autoRenew ? 'On' : 'Off'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spend progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                    <span>Annual Spend vs. Minimum Commitment</span>
                    <span>{formatCurrency(contract.currentAnnualSpend)} / {formatCurrency(contract.minimumAnnualCommitment)}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-[#e7e7e7]">
                    <div
                      className="h-2 rounded-full bg-[#0a7b6b] transition-all"
                      style={{ width: Math.min(100, Math.round((contract.currentAnnualSpend / contract.minimumAnnualCommitment) * 100)) + '%' }}
                    />
                  </div>
                </div>

                {contract.notes && (
                  <p className="mt-3 rounded-md bg-[#F5F5F5] px-3 py-2 text-xs text-[#3c3e3f]" style={{ fontFamily: 'var(--font-body)' }}>
                    {contract.notes}
                  </p>
                )}
              </DetailCard>

              {/* Tab buttons */}
              <div className="mb-4 flex gap-1 rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-1">
                {[
                  { id: 'pricing', label: 'Pricing Schedule', icon: TrendingUp },
                  { id: 'renewal', label: 'Renewal', icon: RefreshCw },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={(e) => { e.stopPropagation(); onTabChange(tab.id); }}
                      className={
                        'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-colors ' +
                        (isActive
                          ? 'bg-white text-[#01332b] shadow-sm'
                          : 'text-[#3c3e3f] hover:text-[#01332b]')
                      }
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      <Icon className={'h-4 w-4 ' + (isActive ? 'text-[#0a7b6b]' : '')} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              {activeTab === 'pricing' && (
                <PricingTab
                  contract={contract}
                  isInternal={isInternal}
                  onOpenPriceChange={onOpenPriceChange}
                  onBackOutChange={onBackOutChange}
                />
              )}
              {activeTab === 'renewal' && (
                <RenewalTab
                  contract={contract}
                  isInternal={isInternal}
                  onOpenRenewal={onOpenRenewal}
                />
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}


/* ===== Pricing Tab ===== */

function PricingTab({ contract, isInternal, onOpenPriceChange, onBackOutChange }) {
  const pendingChanges = (contract.scheduledChanges || []).filter((sc) => sc.status === 'Pending');

  return (
    <div className="space-y-4">
      {/* Header with action button */}
      <div className="flex items-center justify-between">
        <SectionTitle icon={Award}>Special Pricing</SectionTitle>
        {isInternal && (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenPriceChange(); }}
            className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}
          >
            <Plus className="h-4 w-4" /> Schedule Price Change
          </button>
        )}
      </div>

      {/* Current pricing table */}
      <MiniTable
        columns={[
          { key: 'productName', label: 'Product' },
          { key: 'listPrice', label: 'List Price', render: (v) => formatCurrency(v) },
          { key: 'contractPrice', label: 'Contract Price', render: (v) => <span className="font-semibold text-[#0a7b6b]">{formatCurrency(v)}</span> },
          {
            key: 'savings', label: 'Discount %', render: (_, row) => {
              const pct = Math.round(((row.listPrice - row.contractPrice) / row.listPrice) * 100);
              return <span className="text-[#2E7D32]">{pct}%</span>;
            },
          },
        ]}
        data={contract.specialPricing || []}
        emptyText="No special pricing configured."
      />

      {/* Pending changes queue */}
      {pendingChanges.length > 0 && (
        <div>
          <SectionTitle icon={Clock}>Pending Price Changes</SectionTitle>
          <div className="space-y-2">
            {pendingChanges.map((change) => (
              <div
                key={change.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{change.id}</span>
                    <StatusBadge status={change.status} />
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {change.productName}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="text-[#C62828] line-through">{formatCurrency(change.currentPrice)}</span>
                    <span className="text-[#3c3e3f]">-&gt;</span>
                    <span className="font-bold text-[#2E7D32]">{formatCurrency(change.newPrice)}</span>
                  </div>
                  <div className="mt-1 text-xs text-[#3c3e3f]">
                    Effective: {formatDate(change.effectiveDate)} | Created by: {change.createdBy}
                  </div>
                  {change.notes && (
                    <div className="mt-1 text-xs italic text-[#3c3e3f]">{change.notes}</div>
                  )}
                </div>
                {isInternal && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onBackOutChange(change.id); }}
                    className="flex items-center gap-1.5 rounded-md border border-[#C62828]/30 px-3 py-1.5 text-xs font-bold text-[#C62828] transition-colors hover:bg-[#FFEBEE]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                    title="Remove scheduled change"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Back Out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


/* ===== Renewal Tab ===== */

function RenewalTab({ contract, isInternal, onOpenRenewal }) {
  const renewal = contract.renewal;

  if (!renewal) {
    return (
      <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] px-6 py-8 text-center text-sm text-[#3c3e3f]">
        No renewal information available.
      </div>
    );
  }

  // Check if renewal is coming up
  const now = new Date();
  const renewalDate = new Date(renewal.nextRenewalDate);
  const daysUntilRenewal = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24));
  const isRenewalSoon = daysUntilRenewal > 0 && daysUntilRenewal <= 90;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionTitle icon={RotateCcw}>Renewal Information</SectionTitle>
        {isInternal && (
          <button
            onClick={(e) => { e.stopPropagation(); onOpenRenewal(); }}
            className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}
          >
            <RefreshCw className="h-4 w-4" /> Configure Renewal
          </button>
        )}
      </div>

      <DetailCard>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Next Renewal</div>
            <div className={'mt-1 text-sm font-semibold ' + (isRenewalSoon ? 'text-amber-600' : 'text-[#01332b]')}>
              {formatDate(renewal.nextRenewalDate)}
              {isRenewalSoon && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  <AlertTriangle className="h-3 w-3" />
                  {daysUntilRenewal} days
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Renewal Period</div>
            <div className="mt-1 text-sm font-semibold capitalize text-[#01332b]">{renewal.period}</div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Auto-Renew</div>
            <div className="mt-1">
              <span className={'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ' + (renewal.autoRenew ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFEBEE] text-[#C62828]')} style={{ fontFamily: 'var(--font-heading)' }}>
                {renewal.autoRenew ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Stack Window</div>
            <div className="mt-1 text-sm font-semibold text-[#01332b]">{renewal.stackWindow}</div>
          </div>
        </div>

        {/* Show proposed changes if configured */}
        {renewal.proposedTier && (
          <div className="mt-4 rounded-lg border border-[#0a7b6b]/20 bg-[#bffde3]/20 p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>Renewal Configuration</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-[#3c3e3f]">Proposed Tier:</span>{' '}
                <TierBadge tier={renewal.proposedTier} />
              </div>
              <div>
                <span className="text-[#3c3e3f]">Effective at Renewal:</span>{' '}
                <span className="font-semibold text-[#01332b]">{renewal.effectiveAtRenewal ? 'Yes' : 'No'}</span>
              </div>
            </div>
            {renewal.renewalNotes && (
              <div className="mt-2 text-xs italic text-[#3c3e3f]">{renewal.renewalNotes}</div>
            )}
          </div>
        )}
      </DetailCard>
    </div>
  );
}
