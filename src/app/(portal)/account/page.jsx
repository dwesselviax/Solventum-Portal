'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DetailCard } from '@/components/detail/detail-card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { User, Mail, Building2, MapPin, Shield, Bell, Award, Tag, TrendingUp, Calendar, Users, ChevronRight } from 'lucide-react';
import { useTeamStore } from '@/stores/team-store';
import { seedMembers } from '@/lib/mock-data/account-members';
import Link from 'next/link';

export default function AccountPage() {
  const { user } = useAuthStore();
  const initials = user ? (user.firstName?.[0] || '') + (user.lastName?.[0] || '') : 'U';
  const isCustomerRole = ['orthodontist', 'dso'].includes(user?.role);

  const [contract, setContract] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const { initialize: initTeam, getMembers } = useTeamStore();

  // Initialize team store
  useEffect(() => {
    initTeam(seedMembers);
  }, [initTeam]);

  const orgId = user?.organizationId;
  const teamMembers = orgId ? getMembers(orgId) : [];
  const activeTeamCount = teamMembers.filter((m) => m.status === 'active').length;
  const pendingTeamCount = teamMembers.filter((m) => m.status === 'pending').length;

  const roleLabels = {
    orthodontist: 'Orthodontist',
    dso: 'DSO Administrator',
    sales_rep: 'Sales Representative',
    ar: 'Accounts Receivable',
    csr: 'Customer Service',
  };

  // Load contract data for customer roles
  useEffect(() => {
    if (!isCustomerRole || !user?.organizationId) return;
    import('@/lib/mock-data/contracts').then(({ contracts }) => {
      const active = contracts.find(
        (c) => c.customerId === user.organizationId && c.status === 'Active'
      );
      setContract(active || null);
    });
  }, [isCustomerRole, user?.organizationId]);

  // Load active promotions for customer roles
  useEffect(() => {
    if (!isCustomerRole) return;
    import('@/lib/mock-data/promotions').then(({ promotions: promoData }) => {
      const now = new Date();
      const active = promoData.filter((p) => {
        if (p.status !== 'Active') return false;
        const validFrom = new Date(p.validFrom);
        const validUntil = new Date(p.validUntil);
        return now >= validFrom && now <= validUntil;
      });
      setPromotions(active);
    });
  }, [isCustomerRole]);

  // Tier color mapping
  const tierColors = {
    Bronze: { bg: 'bg-[#EFEBE9]', text: 'text-[#5D4037]', border: 'border-[#BCAAA4]' },
    Silver: { bg: 'bg-[#F5F5F5]', text: 'text-[#616161]', border: 'border-[#BDBDBD]' },
    Gold: { bg: 'bg-[#FFF8E1]', text: 'text-[#F57F17]', border: 'border-[#FFD54F]' },
    Platinum: { bg: 'bg-[#E8EAF6]', text: 'text-[#283593]', border: 'border-[#7986CB]' },
  };

  // Compute tier progress percentage
  const tierProgress = contract ? Math.min(100, Math.round((contract.currentAnnualSpend / contract.minimumAnnualCommitment) * 100)) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>My Account</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm text-center">
          <Avatar className="mx-auto h-20 w-20">
            <AvatarFallback className="bg-[#05dd4d] text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{initials}</AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{user?.name}</h2>
          <p className="text-sm text-[#3c3e3f]">{roleLabels[user?.role] || user?.role}</p>
          <p className="mt-1 text-sm text-[#0a7b6b]">{user?.organization}</p>

          {/* Contract tier badge in profile card */}
          {contract && (
            <div className="mt-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${tierColors[contract.tierLevel]?.bg || ''} ${tierColors[contract.tierLevel]?.text || ''} ${tierColors[contract.tierLevel]?.border || ''}`} style={{ fontFamily: 'var(--font-heading)' }}>
                <Award className="h-3.5 w-3.5" /> {contract.tierLevel} Tier
              </span>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <DetailCard title="Profile Information">
            <div className="space-y-4">
              <div className="flex items-center gap-3"><User className="h-5 w-5 text-[#3c3e3f]" /><div><p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Full Name</p><p className="text-sm text-[#01332b]">{user?.name}</p></div></div>
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-[#3c3e3f]" /><div><p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Email</p><p className="text-sm text-[#01332b]">{user?.email}</p></div></div>
              <div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-[#3c3e3f]" /><div><p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Organization</p><p className="text-sm text-[#01332b]">{user?.organization}</p></div></div>
              <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-[#3c3e3f]" /><div><p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Role</p><p className="text-sm text-[#01332b]">{roleLabels[user?.role] || user?.role}</p></div></div>
              {user?.territory && <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-[#3c3e3f]" /><div><p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Territory</p><p className="text-sm text-[#01332b]">{user?.territory}</p></div></div>}
            </div>
          </DetailCard>

          {/* Contract Status Summary — only for orthodontist/dso */}
          {isCustomerRole && contract && (
            <DetailCard title="Contract Status">
              <div className="space-y-5">
                {/* Tier and dates row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <Award className="mt-0.5 h-5 w-5 text-[#0a7b6b]" />
                    <div>
                      <p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Contract Tier</p>
                      <span className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${tierColors[contract.tierLevel]?.bg || ''} ${tierColors[contract.tierLevel]?.text || ''} ${tierColors[contract.tierLevel]?.border || ''}`} style={{ fontFamily: 'var(--font-heading)' }}>
                        {contract.tierLevel}
                      </span>
                      <p className="mt-0.5 text-xs text-[#3c3e3f]">{contract.discountPercentage}% discount</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-[#0a7b6b]" />
                    <div>
                      <p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Start Date</p>
                      <p className="text-sm text-[#01332b]">{formatDate(contract.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-5 w-5 text-[#0a7b6b]" />
                    <div>
                      <p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>End Date</p>
                      <p className="text-sm text-[#01332b]">{formatDate(contract.endDate)}</p>
                      {contract.autoRenew && <p className="text-[10px] text-[#0a7b6b] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Auto-renews</p>}
                    </div>
                  </div>
                </div>

                {/* Spend and commitment */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="mt-0.5 h-5 w-5 text-[#0a7b6b]" />
                    <div>
                      <p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Annual Spend</p>
                      <p className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(contract.currentAnnualSpend)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="mt-0.5 h-5 w-5 text-[#3c3e3f]" />
                    <div>
                      <p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Annual Commitment</p>
                      <p className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(contract.minimumAnnualCommitment)}</p>
                    </div>
                  </div>
                </div>

                {/* Tier progress indicator */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Tier Progress</p>
                    <p className="text-xs font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>{tierProgress}%</p>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e7e7e7]">
                    <div
                      className="h-full rounded-full bg-[#05dd4d] transition-all duration-500"
                      style={{ width: `${tierProgress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[#3c3e3f]">
                    {formatCurrency(contract.currentAnnualSpend)} of {formatCurrency(contract.minimumAnnualCommitment)} minimum commitment
                  </p>
                </div>

                {/* Payment terms */}
                <div className="flex items-center justify-between rounded-md border border-[#F5F5F5] bg-[#FAFAFA] px-4 py-2">
                  <span className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Payment Terms</span>
                  <span className="text-sm font-bold text-[#01332b]">{contract.terms}</span>
                </div>
              </div>
            </DetailCard>
          )}

          {/* Active Promotions — only for orthodontist/dso */}
          {isCustomerRole && promotions.length > 0 && (
            <DetailCard title="Active Promotions">
              <div className="space-y-3">
                {promotions.map((promo) => (
                  <div key={promo.id} className="flex items-start gap-3 rounded-md border border-[#FFD54F] bg-[#FFFDE7] p-3">
                    <Tag className="mt-0.5 h-4 w-4 shrink-0 text-[#F57F17]" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{promo.name}</p>
                        {promo.discountType === 'percentage' && (
                          <span className="rounded-full bg-[#FFF8E1] px-2 py-0.5 text-[10px] font-bold text-[#F57F17]" style={{ fontFamily: 'var(--font-heading)' }}>
                            {promo.discountValue}% OFF
                          </span>
                        )}
                        {promo.discountType === 'free_product' && (
                          <span className="rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#2E7D32]" style={{ fontFamily: 'var(--font-heading)' }}>
                            FREE GIFT
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-[#3c3e3f]">{promo.description}</p>
                      <div className="mt-1 flex items-center gap-3">
                        {promo.code && (
                          <span className="text-xs text-[#3c3e3f]">
                            Code: <span className="font-mono font-bold text-[#F57F17]">{promo.code}</span>
                          </span>
                        )}
                        <span className="text-xs text-[#3c3e3f]">
                          Valid until {formatDate(promo.validUntil)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DetailCard>
          )}

          {/* Team Summary — only for orthodontist/dso */}
          {isCustomerRole && (
            <DetailCard title="Team Members">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EAF6]">
                    <Users className="h-5 w-5 text-[#283593]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{activeTeamCount} Active</p>
                    {pendingTeamCount > 0 && (
                      <p className="text-xs text-[#F57F17]">{pendingTeamCount} pending invite{pendingTeamCount !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
                <Link
                  href="/account/team"
                  className="flex items-center gap-1 text-sm font-bold text-[#0a7b6b] transition-colors hover:text-[#01332b]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Manage Team <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </DetailCard>
          )}

          <DetailCard title="Notification Preferences">
            <div className="space-y-3">
              {['Order status updates', 'Shipment notifications', 'Invoice reminders', 'Product updates', 'Promotion alerts'].map((pref) => (
                <div key={pref} className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-[#3c3e3f]" /><span className="text-sm text-[#01332b]">{pref}</span></div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-[#e7e7e7] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#05dd4d] peer-checked:after:translate-x-full" />
                  </label>
                </div>
              ))}
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}
