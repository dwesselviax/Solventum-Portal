'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { StatusBadge } from '@/components/shared/status-badge';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { ChevronDown, ChevronUp, Calendar, ClipboardList, Package, StickyNote, ExternalLink } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Approved', label: 'Approved' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'On Hold', label: 'On Hold' },
];

const COMPLEXITY_COLORS = {
  Simple: 'bg-[#E8F5E9] text-[#2E7D32]',
  Moderate: 'bg-[#bffde3] text-[#0a7b6b]',
  Complex: 'bg-[#FFEBEE] text-[#C62828]',
};

function ComplexityBadge({ complexity }) {
  return (
    <span
      className={'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ' + (COMPLEXITY_COLORS[complexity] || 'bg-[#F5F5F5] text-[#3c3e3f]')}
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {complexity}
    </span>
  );
}

function ProgressBar({ current, total, className }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className={'flex items-center gap-3 ' + (className || '')}>
      <div className="h-2 flex-1 rounded-full bg-[#e7e7e7]">
        <div
          className="h-2 rounded-full bg-[#0a7b6b] transition-all"
          style={{ width: percentage + '%' }}
        />
      </div>
      <span className="whitespace-nowrap text-xs font-semibold text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
        {current} of {total}
      </span>
    </div>
  );
}

function StageIndicator({ status }) {
  const colors = {
    Completed: 'bg-[#2E7D32]',
    'In Progress': 'bg-[#0a7b6b]',
    'On Hold': 'bg-[#F9A825]',
    Upcoming: 'bg-[#e7e7e7]',
  };
  return <div className={'h-3 w-3 shrink-0 rounded-full ' + (colors[status] || colors.Upcoming)} />;
}

export default function ClarityPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const role = user?.role;

  useEffect(() => {
    if (user && !['orthodontist', 'dso', 'sales_rep'].includes(role)) {
      router.push('/dashboard');
    }
  }, [user, role, router]);

  const [plans, setPlans] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  useEffect(() => {
    import('@/lib/mock-data/treatment-plans').then((mod) => {
      setPlans(mod.treatmentPlans);
      setLoading(false);
    });

    if (role === 'sales_rep') {
      import('@/lib/mock-data/parties').then((mod) => {
        setParties(mod.parties.filter((p) => p.type !== 'manufacturer'));
      });
    }
  }, [role]);

  const filteredPlans = useMemo(() => {
    let result = plans;
    if (role === 'sales_rep' && selectedCustomer) {
      result = result.filter((p) => p.organizationId === selectedCustomer);
    }
    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.caseNumber.toLowerCase().includes(q) ||
          p.patientInitials.toLowerCase().includes(q) ||
          p.treatmentType.toLowerCase().includes(q) ||
          p.organizationName?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [plans, statusFilter, search, role, selectedCustomer]);

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Treatment Plans</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Manage Clarity aligner and bracket treatment plans</p>
        </div>
        <TableSkeleton rows={6} columns={6} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Treatment Plans</h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">Manage Clarity aligner and bracket treatment plans</p>
      </div>

      {/* Sales rep customer selector */}
      {role === 'sales_rep' && (
        <div className="mb-4">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
            View Customer
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="h-10 w-full max-w-md rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <option value="">All Customers</option>
            {parties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Statuses" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
      </FiltersBar>

      {/* Treatment plan cards */}
      <div className="space-y-3">
        {filteredPlans.length === 0 ? (
          <div className="rounded-lg border border-[#e7e7e7] bg-white px-6 py-12 text-center text-sm text-[#3c3e3f] shadow-sm">
            No treatment plans found.
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const isExpanded = expandedId === plan.id;
            const hasAlignerProgress = plan.totalAligners != null && plan.totalAligners > 0;

            return (
              <div key={plan.id} className="rounded-lg border border-[#e7e7e7] bg-white shadow-sm transition-shadow hover:shadow-md">
                {/* Card header / summary row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : plan.id)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left"
                >
                  {/* Patient initials avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#01332b] text-sm font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                    {plan.patientInitials}
                  </div>

                  {/* Main info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                        {plan.caseNumber}
                      </span>
                      <span className="text-xs text-[#3c3e3f]">{plan.treatmentType}</span>
                    </div>
                    {role === 'sales_rep' && (
                      <div className="mt-0.5 text-xs text-[#3c3e3f]">{plan.organizationName}</div>
                    )}
                    {hasAlignerProgress && (
                      <ProgressBar current={plan.currentAligner} total={plan.totalAligners} className="mt-2 max-w-xs" />
                    )}
                  </div>

                  {/* Badges */}
                  <div className="hidden items-center gap-2 sm:flex">
                    <ComplexityBadge complexity={plan.complexity} />
                    <StatusBadge status={plan.status} />
                  </div>

                  {/* Next visit */}
                  <div className="hidden text-right md:block">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Next Visit</div>
                    <div className="text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>
                      {plan.nextVisit ? formatDate(plan.nextVisit) : '--'}
                    </div>
                  </div>

                  {/* Chevron */}
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-[#3c3e3f]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#3c3e3f]" />
                  )}
                </button>

                {/* Open in Clarity Portal - hidden for sales_rep */}
                {role !== 'sales_rep' && (
                  <div className="flex items-center gap-2 px-6 pb-2">
                    <a
                      href={`https://clarity.solventum.com/cases/${plan.caseNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#0a7b6b] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0a7b6b] transition-colors hover:bg-[#bffde3]/30"
                      style={{ fontFamily: 'var(--font-heading)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open in Clarity Portal
                    </a>
                  </div>
                )}

                {/* Mobile badges */}
                <div className="flex items-center gap-2 px-6 pb-3 sm:hidden">
                  <ComplexityBadge complexity={plan.complexity} />
                  <StatusBadge status={plan.status} />
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div className="border-t border-[#e7e7e7] px-6 py-5">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Aligner progress visualization */}
                      {hasAlignerProgress && (
                        <div className="lg:col-span-2">
                          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                            <ClipboardList className="h-4 w-4 text-[#0a7b6b]" />
                            Aligner Progress
                          </h4>
                          <div className="relative">
                            {/* Full progress bar */}
                            <div className="h-4 w-full rounded-full bg-[#e7e7e7]">
                              <div
                                className="relative h-4 rounded-full bg-gradient-to-r from-[#0a7b6b] to-[#05dd4d] transition-all"
                                style={{ width: Math.round((plan.currentAligner / plan.totalAligners) * 100) + '%' }}
                              >
                                {/* Current position marker */}
                                <div className="absolute -right-1.5 -top-1 h-6 w-3 rounded-sm bg-[#01332b] shadow-sm" />
                              </div>
                            </div>
                            {/* Scale labels */}
                            <div className="mt-1 flex justify-between text-[10px] text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                              <span>1</span>
                              <span className="font-bold text-[#01332b]">Current: {plan.currentAligner}</span>
                              <span>{plan.totalAligners}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Treatment stages timeline */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                          <Calendar className="h-4 w-4 text-[#0a7b6b]" />
                          Treatment Stages
                        </h4>
                        <div className="space-y-0">
                          {plan.stages.map((stage, index) => (
                            <div key={index} className="flex gap-3">
                              {/* Timeline line */}
                              <div className="flex flex-col items-center">
                                <StageIndicator status={stage.status} />
                                {index < plan.stages.length - 1 && (
                                  <div className="w-px flex-1 bg-[#e7e7e7]" />
                                )}
                              </div>
                              {/* Stage content */}
                              <div className="pb-4">
                                <div className="text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                                  {stage.name}
                                </div>
                                <div className="mt-0.5 text-xs text-[#3c3e3f]">
                                  {stage.startAligner != null && stage.endAligner != null
                                    ? 'Aligners ' + stage.startAligner + '-' + stage.endAligner
                                    : stage.estimatedDuration || stage.note || ''}
                                  {stage.status !== 'Upcoming' && (
                                    <span className="ml-2 font-semibold text-[#0a7b6b]">{stage.status}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Products used + Dates */}
                      <div className="space-y-5">
                        {/* Products */}
                        <div>
                          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                            <Package className="h-4 w-4 text-[#0a7b6b]" />
                            Products Used
                          </h4>
                          <div className="space-y-1.5">
                            {plan.productsUsed.map((product, i) => (
                              <div key={i} className="flex items-center justify-between rounded-md bg-[#F5F5F5] px-3 py-2">
                                <span className="text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>{product.productName}</span>
                                <span className="text-xs font-semibold text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>x{product.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key dates */}
                        <div>
                          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                            <Calendar className="h-4 w-4 text-[#0a7b6b]" />
                            Key Dates
                          </h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {[
                              { label: 'Start', value: plan.startDate },
                              { label: 'Est. End', value: plan.estimatedEndDate },
                              { label: 'Last Visit', value: plan.lastVisit },
                              { label: 'Next Visit', value: plan.nextVisit },
                            ].map((d) => (
                              <div key={d.label}>
                                <div className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{d.label}</div>
                                <div className="text-sm text-[#01332b]" style={{ fontFamily: 'var(--font-body)' }}>{d.value ? formatDate(d.value) : '--'}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {plan.notes && (
                        <div className="lg:col-span-2">
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                            <StickyNote className="h-4 w-4 text-[#0a7b6b]" />
                            Notes
                          </h4>
                          <p className="rounded-md bg-[#F5F5F5] px-4 py-3 text-sm leading-relaxed text-[#3c3e3f]" style={{ fontFamily: 'var(--font-body)' }}>
                            {plan.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
