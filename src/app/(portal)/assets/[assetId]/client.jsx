'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DetailHeader } from '@/components/detail/detail-header';
import { DetailCard } from '@/components/detail/detail-card';
import { Timeline } from '@/components/detail/timeline';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { formatDate } from '@/lib/utils/format';
import { Wrench, Package, X, Send } from 'lucide-react';
import { toast } from 'sonner';

function formatLocation(loc) {
  if (!loc) return '—';
  if (typeof loc === 'string') return loc;
  return [loc.facility, loc.department, loc.room ? `Room ${loc.room}` : null].filter(Boolean).join(' — ');
}

export default function AssetDetailPage({ assetId }) {
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceType, setServiceType] = useState('Corrective Maintenance');
  const [servicePriority, setServicePriority] = useState('Standard');
  const [serviceDescription, setServiceDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    import('@/lib/mock-data/assets').then((mod) => {
      setAsset((mod.assets || []).find((a) => a.id === assetId) || null);
      setLoading(false);
    });
  }, [assetId]);

  if (loading) return <div className="space-y-6"><CardSkeleton /><CardSkeleton /></div>;
  if (!asset) return <div className="py-12 text-center text-[#3c3e3f]">Asset not found.</div>;

  const timelineEvents = (asset.transactionHistory || asset.history || []).map((e) => ({
    date: e.date,
    title: e.type + (e.reference ? ` (${e.reference})` : ''),
    description: e.notes,
  }));

  return (
    <div className="space-y-6">
      <DetailHeader id={asset.id} name={asset.productName} status={asset.status} createdAt={asset.installDate} backHref="/assets" />

      <div className="flex gap-3">
        <button
          onClick={() => setShowServiceModal(true)}
          className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]" style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Wrench className="h-4 w-4" /> Request Service
        </button>
        <button
          onClick={() => router.push(`/products?search=${encodeURIComponent(asset.productName)}`)}
          className="flex items-center gap-2 rounded-md border border-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#0a7b6b] transition-colors hover:bg-[#f5f5f5]" style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Package className="h-4 w-4" /> View Compatible Parts
        </button>
      </div>

      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01332b]/50" onClick={() => setShowServiceModal(false)}>
          <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Request Service</h2>
              <button onClick={() => setShowServiceModal(false)} className="rounded p-1 text-[#3c3e3f] hover:bg-[#F5F5F5]"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="rounded-md bg-[#F5F5F5] p-3">
                <p className="text-xs text-[#3c3e3f]">Asset</p>
                <p className="text-sm font-semibold text-[#01332b]">{asset.id} — {asset.productName}</p>
                <p className="text-xs text-[#3c3e3f]">S/N: {asset.serialNumber} &middot; {formatLocation(asset.location)}</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#3c3e3f]">Service Type</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full rounded-md border border-[#e7e7e7] px-3 py-2 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none">
                  <option>Corrective Maintenance</option>
                  <option>Preventive Maintenance</option>
                  <option>Calibration</option>
                  <option>Installation</option>
                  <option>Software Update</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#3c3e3f]">Priority</label>
                <select value={servicePriority} onChange={(e) => setServicePriority(e.target.value)} className="w-full rounded-md border border-[#e7e7e7] px-3 py-2 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none">
                  <option>Standard</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#3c3e3f]">Description</label>
                <textarea value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} rows={3} placeholder="Describe the issue or service needed..." className="w-full rounded-md border border-[#e7e7e7] px-3 py-2 text-sm text-[#01332b] placeholder:text-[#A0A0A0] focus:border-[#0a7b6b] focus:outline-none" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowServiceModal(false)} className="rounded-md border border-[#e7e7e7] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#3c3e3f] hover:bg-[#F5F5F5]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowServiceModal(false);
                    setServiceDescription('');
                    toast.success(`Service request submitted for ${asset.id}`, { description: `${serviceType} — ${servicePriority} priority` });
                  }}
                  className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#087a69]" style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <Send className="h-4 w-4" /> Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DetailCard title="Asset Details">
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Serial Number</span><span className="text-sm font-semibold text-[#01332b]">{asset.serialNumber}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Model</span><span className="text-sm font-semibold text-[#01332b]">{asset.model || asset.productName}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Location</span><span className="text-sm font-semibold text-[#01332b]">{formatLocation(asset.location)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Condition</span><span className="text-sm font-semibold text-[#01332b]">{asset.condition}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Install Date</span><span className="text-sm font-semibold text-[#01332b]">{formatDate(asset.installDate)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Warranty</span><span className="text-sm font-semibold text-[#01332b]">{asset.warranty?.status || asset.warrantyStatus || '—'}</span></div>
            {(asset.warranty?.endDate || asset.warrantyExpiry) && <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Warranty Expiry</span><span className="text-sm font-semibold text-[#01332b]">{formatDate(asset.warranty?.endDate || asset.warrantyExpiry)}</span></div>}
            {asset.warranty?.type && <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Warranty Type</span><span className="text-sm font-semibold text-[#01332b]">{asset.warranty.type}</span></div>}
            {asset.softwareVersion && <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Software</span><span className="text-sm font-semibold text-[#01332b]">{asset.softwareVersion}</span></div>}
            {asset.firmware && <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Firmware</span><span className="text-sm font-semibold text-[#01332b]">{asset.firmware}</span></div>}
          </div>
        </DetailCard>

        {asset.maintenanceSchedule && (
          <DetailCard title="Maintenance Schedule">
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Frequency</span><span className="text-sm font-semibold text-[#01332b]">{asset.maintenanceSchedule.frequency}</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Last Service</span><span className="text-sm font-semibold text-[#01332b]">{asset.maintenanceSchedule.lastService ? formatDate(asset.maintenanceSchedule.lastService) : 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Next Service</span><span className="text-sm font-semibold text-[#01332b]">{asset.maintenanceSchedule.nextService ? formatDate(asset.maintenanceSchedule.nextService) : 'N/A'}</span></div>
            </div>
          </DetailCard>
        )}
      </div>

      {asset.warranty?.coverageDetails && (
        <DetailCard title="Warranty Coverage">
          <p className="text-sm text-[#01332b]">{asset.warranty.coverageDetails}</p>
        </DetailCard>
      )}

      {timelineEvents.length > 0 && <Timeline events={timelineEvents} />}

      {asset.notes && (
        <DetailCard title="Notes">
          <p className="text-sm text-[#01332b]">{asset.notes}</p>
        </DetailCard>
      )}
    </div>
  );
}
