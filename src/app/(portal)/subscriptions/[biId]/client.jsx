'use client';

import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscriptions';
import { DetailHeader } from '@/components/detail/detail-header';
import { DetailCard } from '@/components/detail/detail-card';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { formatDate } from '@/lib/utils/format';
import { Pause, Play, X } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionDetailPage({ biId }) {
  const { data: sub, isLoading } = useSubscription(biId);
  const [statusOverride, setStatusOverride] = useState(null);

  if (isLoading) return <div className="space-y-6"><CardSkeleton /><CardSkeleton /></div>;
  if (!sub) return <div className="py-12 text-center text-[#3c3e3f]">Subscription not found.</div>;

  const currentStatus = statusOverride || sub.status;

  const handlePause = () => {
    setStatusOverride('Paused');
    toast.success(`Subscription ${sub.biId} has been paused`);
  };

  const handleResume = () => {
    setStatusOverride('Active');
    toast.success(`Subscription ${sub.biId} has been resumed`);
  };

  const handleCancel = () => {
    setStatusOverride('Cancelled');
    toast.success(`Subscription ${sub.biId} has been cancelled`);
  };

  return (
    <div className="space-y-6">
      <DetailHeader id={sub.biId} name={sub.biName} status={currentStatus} createdAt={sub.startDate} backHref="/subscriptions" />

      <div className="flex gap-3">
        {currentStatus === 'Active' && (
          <button onClick={handlePause} className="flex items-center gap-2 rounded-md border border-[#F9A825] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#F9A825] transition-colors hover:bg-[#bffde3]" style={{ fontFamily: 'var(--font-heading)' }}>
            <Pause className="h-4 w-4" /> Pause
          </button>
        )}
        {currentStatus === 'Paused' && (
          <button onClick={handleResume} className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]" style={{ fontFamily: 'var(--font-heading)' }}>
            <Play className="h-4 w-4" /> Resume
          </button>
        )}
        {currentStatus !== 'Cancelled' && (
          <button onClick={handleCancel} className="flex items-center gap-2 rounded-md border border-[#C62828] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#C62828] transition-colors hover:bg-[#FFEBEE]" style={{ fontFamily: 'var(--font-heading)' }}>
            <X className="h-4 w-4" /> Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DetailCard title="Subscription Details">
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Product</span><span className="text-sm font-semibold text-[#01332b]">{sub.product?.name || sub.productName || sub.biName}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Frequency</span><span className="text-sm font-semibold text-[#01332b]">{sub.frequency}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Quantity</span><span className="text-sm font-semibold text-[#01332b]">{sub.quantity}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Start Date</span><span className="text-sm font-semibold text-[#01332b]">{formatDate(sub.startDate)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-[#3c3e3f]">Next Delivery</span><span className="text-sm font-semibold text-[#01332b]">{formatDate(sub.nextDelivery)}</span></div>
          </div>
        </DetailCard>

        <DetailCard title="Delivery Address">
          {sub.deliveryAddress && typeof sub.deliveryAddress === 'object' ? (
            <div className="text-sm text-[#01332b] space-y-0.5">
              {sub.deliveryAddress.name && <p className="font-semibold">{sub.deliveryAddress.name}</p>}
              {sub.deliveryAddress.street && <p>{sub.deliveryAddress.street}</p>}
              {sub.deliveryAddress.building && <p>{sub.deliveryAddress.building}</p>}
              <p>{[sub.deliveryAddress.city, sub.deliveryAddress.state].filter(Boolean).join(', ')}{sub.deliveryAddress.zip ? ` ${sub.deliveryAddress.zip}` : ''}</p>
              {sub.deliveryAddress.country && sub.deliveryAddress.country !== 'US' && <p>{sub.deliveryAddress.country}</p>}
            </div>
          ) : (
            <p className="text-sm text-[#01332b]">{sub.deliveryAddress || '100 Memorial Drive, Chicago, IL 60601'}</p>
          )}
        </DetailCard>
      </div>
    </div>
  );
}
