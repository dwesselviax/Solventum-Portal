'use client';

import { useOrder } from '@/hooks/use-orders';
import { DetailHeader } from '@/components/detail/detail-header';
import { DetailCard } from '@/components/detail/detail-card';
import { PartyCard } from '@/components/detail/party-card';
import { LineItems } from '@/components/detail/line-items';
import { PriceSummary } from '@/components/detail/price-summary';
import { Timeline } from '@/components/detail/timeline';
import { CardSkeleton } from '@/components/shared/loading-skeleton';

export default function OrderDetailPage({ biId }) {
  const { data: order, isLoading } = useOrder(biId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
        <CardSkeleton />
      </div>
    );
  }

  if (!order) {
    return <div className="py-12 text-center text-[#3c3e3f]">Order not found.</div>;
  }

  return (
    <div className="space-y-6">
      <DetailHeader
        id={order.biId}
        name={order.biName}
        status={order.status}
        createdAt={order.biCreatedAt}
        completedAt={order.biCompletedAt}
        backHref="/orders"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {order.customer && <PartyCard role="Customer" name={order.customer.name} address={order.customer.address} />}
        {order.shipTo && <PartyCard role="Ship To" name={order.shipTo.name} address={order.shipTo.address} />}
        {order.billTo && <PartyCard role="Bill To" name={order.billTo.name} address={order.billTo.address} />}
        {order.salesRep && <PartyCard role="Sales Rep" name={order.salesRep.name} type="individual" />}
      </div>

      <DetailCard title="Line Items">
        <LineItems items={order.items || []} />
      </DetailCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PriceSummary pricing={order.pricing} />
        <Timeline events={order.timeline || []} />
      </div>
    </div>
  );
}
