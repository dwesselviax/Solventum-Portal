'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { DetailCard } from '@/components/detail/detail-card';
import { formatDate, formatNumber } from '@/lib/utils/format';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Plus, Key, Shield, BarChart3, Send, Eye, EyeOff, RefreshCw, ChevronDown, ChevronUp, Copy, FileText, ExternalLink, Zap, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  Active: 'bg-[#E8F5E9] text-[#2E7D32]',
  Pending: 'bg-[#FFF8E1] text-[#F57F17]',
  Suspended: 'bg-[#FFEBEE] text-[#C62828]',
};

const KEY_STATUS_COLORS = {
  Active: 'bg-[#E8F5E9] text-[#2E7D32]',
  Revoked: 'bg-[#FFEBEE] text-[#C62828]',
};

function PartnerStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_COLORS[status] || 'bg-[#F5F5F5] text-[#3c3e3f]'}`}
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {status}
    </span>
  );
}

function KeyStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${KEY_STATUS_COLORS[status] || 'bg-[#F5F5F5] text-[#3c3e3f]'}`}
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {status}
    </span>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-md bg-[#F5F5F5] px-3 py-2 text-center">
      <p className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
        {formatNumber(value)}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
        {label}
      </p>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
            {formatNumber(value)}
          </p>
        </div>
        {Icon && (
          <div className="rounded-lg bg-[#bffde3]/40 p-2">
            <Icon className="h-5 w-5 text-[#01332b]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PartnersPage() {
  const { user } = useAuthStore();
  const [partners, setPartners] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [revealedClientIds, setRevealedClientIds] = useState({});
  const [editedPermissions, setEditedPermissions] = useState({});
  const [editedRateLimits, setEditedRateLimits] = useState({});

  // Add partner form state
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    permissions: [],
    requestsPerMinute: '60',
    requestsPerDay: '30000',
    notes: '',
  });

  useEffect(() => {
    import('@/lib/mock-data/api-partners').then((mod) => {
      setPartners(mod.apiPartners || []);
      setAllPermissions(mod.API_PERMISSIONS || []);
      setLoading(false);
    });
  }, []);

  // Role guard
  if (user?.role !== 'operations') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="rounded-lg border border-[#FFEBEE] bg-[#FFEBEE]/50 p-8 text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-[#C62828]" />
          <h2 className="text-xl font-bold text-[#C62828]" style={{ fontFamily: 'var(--font-heading)' }}>Access Denied</h2>
          <p className="mt-2 text-sm text-[#3c3e3f]">You do not have permission to access API Partner Management. This page is restricted to the Operations team.</p>
        </div>
      </div>
    );
  }

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleClientIdReveal = (partnerId) => {
    setRevealedClientIds((prev) => ({ ...prev, [partnerId]: !prev[partnerId] }));
  };

  const maskClientId = (clientId, partnerId) => {
    if (!clientId) return '--';
    if (revealedClientIds[partnerId]) return clientId;
    return clientId.substring(0, 8) + '...';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleGenerateKey = (partnerId) => {
    toast.success(`New API key generated for partner ${partnerId}`);
  };

  const handleRegenerateKey = (partnerId, keyId) => {
    toast.success(`API key ${keyId} regenerated successfully`);
  };

  const handleRevokeKey = (partnerId, keyId) => {
    toast.success(`API key ${keyId} has been revoked`);
  };

  const handleSendAgreement = (partnerId) => {
    toast.success('Partnership agreement sent successfully');
  };

  const handleSavePermissions = (partnerId) => {
    toast.success('Permissions updated successfully');
  };

  const handleSaveRateLimits = (partnerId) => {
    toast.success('Rate limits updated successfully');
  };

  const getPartnerPermissions = (partner) => {
    return editedPermissions[partner.id] || partner.permissions;
  };

  const togglePermission = (partnerId, permId, currentPerms) => {
    const updated = currentPerms.includes(permId)
      ? currentPerms.filter((p) => p !== permId)
      : [...currentPerms, permId];
    setEditedPermissions((prev) => ({ ...prev, [partnerId]: updated }));
  };

  const getPartnerRateLimits = (partner) => {
    return editedRateLimits[partner.id] || partner.rateLimit;
  };

  const updateRateLimit = (partnerId, field, value) => {
    setEditedRateLimits((prev) => ({
      ...prev,
      [partnerId]: {
        ...(prev[partnerId] || partners.find((p) => p.id === partnerId)?.rateLimit || {}),
        [field]: parseInt(value) || 0,
      },
    }));
  };

  const toggleFormPermission = (permId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      permissions: [],
      requestsPerMinute: '60',
      requestsPerDay: '30000',
      notes: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Partner "${formData.name}" created successfully`);
    setDialogOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#05dd4d] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>API Partners</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Manage partner integrations, API keys, and usage</p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Plus className="h-4 w-4" /> Add Partner
        </button>
      </div>

      {/* Partner cards grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {partners.map((partner) => {
          const isExpanded = expandedId === partner.id;
          const perms = getPartnerPermissions(partner);
          const limits = getPartnerRateLimits(partner);

          return (
            <div
              key={partner.id}
              className="rounded-lg border border-[#e7e7e7] bg-white p-5 shadow-sm"
            >
              {/* Card header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#bffde3]/40">
                    <Globe className="h-5 w-5 text-[#01332b]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      {partner.name}
                    </h3>
                    <p className="text-xs text-[#3c3e3f]">
                      {partner.id} &middot; Created {formatDate(partner.createdAt)}
                    </p>
                  </div>
                </div>
                <PartnerStatusBadge status={partner.status} />
              </div>

              {/* Agreement indicator */}
              <div className="mt-3 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-[#3c3e3f]" />
                <span className="text-xs text-[#3c3e3f]">
                  Agreement: <span className="font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{partner.agreementStatus}</span>
                  {partner.agreementDate && <> &middot; {formatDate(partner.agreementDate)}</>}
                </span>
              </div>

              {/* Usage summary */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                <MiniMetric label="Orders" value={partner.usage.ordersSubmitted} />
                <MiniMetric label="Catalog" value={partner.usage.catalogQueries} />
                <MiniMetric label="Pricing" value={partner.usage.pricingQueries} />
                <MiniMetric label="Status" value={partner.usage.statusLookups} />
              </div>

              {/* Contact info */}
              <div className="mt-3 text-xs text-[#3c3e3f]">
                <span className="font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{partner.contact.name}</span>
                {' '}&middot; {partner.contact.email} &middot; {partner.contact.phone}
              </div>

              {/* Expand/collapse toggle */}
              <button
                onClick={() => toggleExpanded(partner.id)}
                className="mt-4 flex w-full items-center justify-center gap-1 rounded-md border border-[#e7e7e7] py-2 text-xs font-bold uppercase tracking-wider text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" /> Collapse Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" /> View Details
                  </>
                )}
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="mt-4 space-y-5 border-t border-[#e7e7e7] pt-5">

                  {/* (a) Credentials section */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <Key className="h-4 w-4" /> Credentials
                    </h4>

                    {/* Client ID */}
                    <div className="mb-3 flex items-center gap-2 rounded-md bg-[#F5F5F5] px-3 py-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Client ID:</span>
                      <code className="flex-1 text-xs font-mono text-[#01332b]">{maskClientId(partner.clientId, partner.id)}</code>
                      {partner.clientId && (
                        <>
                          <button
                            onClick={() => toggleClientIdReveal(partner.id)}
                            className="rounded p-1 text-[#3c3e3f] hover:bg-[#e7e7e7]"
                            title={revealedClientIds[partner.id] ? 'Hide' : 'Reveal'}
                          >
                            {revealedClientIds[partner.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(partner.clientId)}
                            className="rounded p-1 text-[#3c3e3f] hover:bg-[#e7e7e7]"
                            title="Copy"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* API Keys table */}
                    {partner.apiKeys.length > 0 && (
                      <div className="overflow-x-auto rounded-lg border border-[#e7e7e7]">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#e7e7e7] bg-[#F5F5F5]">
                              {['Name', 'Created', 'Last Used', 'Status', 'Actions'].map((h) => (
                                <th key={h} className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {partner.apiKeys.map((key) => (
                              <tr key={key.id} className="border-b border-[#F5F5F5] last:border-b-0">
                                <td className="px-3 py-2 font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{key.name}</td>
                                <td className="px-3 py-2 text-xs text-[#3c3e3f]">{formatDate(key.created)}</td>
                                <td className="px-3 py-2 text-xs text-[#3c3e3f]">{formatDate(key.lastUsed)}</td>
                                <td className="px-3 py-2"><KeyStatusBadge status={key.status} /></td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-1">
                                    {key.status === 'Active' && (
                                      <>
                                        <button
                                          onClick={() => handleRegenerateKey(partner.id, key.id)}
                                          className="rounded p-1 text-[#0a7b6b] hover:bg-[#bffde3]/40"
                                          title="Regenerate"
                                        >
                                          <RefreshCw className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleRevokeKey(partner.id, key.id)}
                                          className="rounded p-1 text-[#C62828] hover:bg-[#FFEBEE]"
                                          title="Revoke"
                                        >
                                          <X className="h-3.5 w-3.5" />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <button
                      onClick={() => handleGenerateKey(partner.id)}
                      className="mt-2 flex items-center gap-1.5 rounded-md border border-[#0a7b6b] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0a7b6b] transition-colors hover:bg-[#0a7b6b] hover:text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      <Plus className="h-3 w-3" /> Generate New Key
                    </button>
                  </div>

                  {/* (b) Agreement section */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FileText className="h-4 w-4" /> Agreement
                    </h4>
                    <div className="flex items-center gap-4 rounded-md bg-[#F5F5F5] px-3 py-2">
                      <div className="text-xs">
                        <span className="font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Status: </span>
                        <span className="font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{partner.agreementStatus}</span>
                      </div>
                      {partner.agreementDate && (
                        <div className="text-xs">
                          <span className="font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Signed: </span>
                          <span className="text-[#01332b]">{formatDate(partner.agreementDate)}</span>
                        </div>
                      )}
                      <div className="flex-1" />
                      <button
                        onClick={() => handleSendAgreement(partner.id)}
                        className="flex items-center gap-1.5 rounded-md bg-[#0a7b6b] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        <Send className="h-3 w-3" />
                        {partner.agreementStatus === 'Signed' ? 'Resend Agreement' : 'Send Agreement'}
                      </button>
                    </div>
                  </div>

                  {/* (c) Usage dashboard */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <BarChart3 className="h-4 w-4" /> Usage Dashboard
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <MetricCard label="Orders Submitted" value={partner.usage.ordersSubmitted} icon={Zap} />
                      <MetricCard label="Catalog Queries" value={partner.usage.catalogQueries} icon={Globe} />
                      <MetricCard label="Pricing Queries" value={partner.usage.pricingQueries} icon={BarChart3} />
                      <MetricCard label="Status Lookups" value={partner.usage.statusLookups} icon={Shield} />
                    </div>
                  </div>

                  {/* (d) Permissions matrix */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <Shield className="h-4 w-4" /> Permissions
                    </h4>
                    <div className="space-y-2 rounded-md border border-[#e7e7e7] p-3">
                      {allPermissions.map((perm) => (
                        <label key={perm.id} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={perms.includes(perm.id)}
                            onChange={() => togglePermission(partner.id, perm.id, perms)}
                            className="h-4 w-4 rounded border-[#e7e7e7] text-[#0a7b6b] accent-[#0a7b6b]"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{perm.label}</span>
                            <span className="ml-2 text-[10px] text-[#3c3e3f]">{perm.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={() => handleSavePermissions(partner.id)}
                      className="mt-2 rounded-md bg-[#0a7b6b] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Save Permissions
                    </button>
                  </div>

                  {/* (e) Throttle controls */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <Zap className="h-4 w-4" /> Rate Limits
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                          Requests / Minute
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={limits.requestsPerMinute}
                          onChange={(e) => updateRateLimit(partner.id, 'requestsPerMinute', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                          Requests / Day
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={limits.requestsPerDay}
                          onChange={(e) => updateRateLimit(partner.id, 'requestsPerDay', e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveRateLimits(partner.id)}
                      className="mt-2 rounded-md bg-[#0a7b6b] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Save Rate Limits
                    </button>
                  </div>

                  {/* (f) API Docs section */}
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FileText className="h-4 w-4" /> API Documentation
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="#"
                        className="flex items-center gap-1.5 rounded-md border border-[#e7e7e7] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#F5F5F5]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        <ExternalLink className="h-3 w-3" /> View API Documentation
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-1.5 rounded-md border border-[#e7e7e7] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#F5F5F5]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        <FileText className="h-3 w-3" /> Download Postman Collection
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-1.5 rounded-md border border-[#e7e7e7] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#F5F5F5]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        <Globe className="h-3 w-3" /> OpenAPI Spec
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Partner Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Add Partner</DialogTitle>
            <DialogDescription>Register a new API integration partner.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partner-name" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                Partner Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="partner-name"
                placeholder="e.g. Acme Dental"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Contact Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact-name"
                  placeholder="Full name"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Contact Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="email@company.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                Contact Phone
              </Label>
              <Input
                id="contact-phone"
                placeholder="+1 (555) 000-0000"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>

            {/* Permissions checkboxes */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                API Permissions
              </Label>
              <div className="space-y-2 rounded-md border border-[#e7e7e7] p-3">
                {allPermissions.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(perm.id)}
                      onChange={() => toggleFormPermission(perm.id)}
                      className="h-4 w-4 rounded border-[#e7e7e7] text-[#0a7b6b] accent-[#0a7b6b]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{perm.label}</span>
                      <span className="ml-2 text-[10px] text-[#3c3e3f]">{perm.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Rate limits */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="rpm" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Requests / Minute
                </Label>
                <Input
                  id="rpm"
                  type="number"
                  min="0"
                  value={formData.requestsPerMinute}
                  onChange={(e) => setFormData({ ...formData, requestsPerMinute: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rpd" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Requests / Day
                </Label>
                <Input
                  id="rpd"
                  type="number"
                  min="0"
                  value={formData.requestsPerDay}
                  onChange={(e) => setFormData({ ...formData, requestsPerDay: e.target.value })}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="partner-notes" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                Notes
              </Label>
              <Textarea
                id="partner-notes"
                placeholder="Additional notes about this partner..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-md border border-[#e7e7e7] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Create Partner
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
