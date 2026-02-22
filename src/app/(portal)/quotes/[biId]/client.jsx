'use client';

import { useQuote } from '@/hooks/use-quotes';
import { DetailHeader } from '@/components/detail/detail-header';
import { DetailCard } from '@/components/detail/detail-card';
import { PartyCard } from '@/components/detail/party-card';
import { LineItems } from '@/components/detail/line-items';
import { PriceSummary } from '@/components/detail/price-summary';
import { Timeline } from '@/components/detail/timeline';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { formatDate } from '@/lib/utils/format';
import { ShoppingCart, FileDown } from 'lucide-react';

export default function QuoteDetailPage({ biId }) {
  const { data: quote, isLoading } = useQuote(biId);

  if (isLoading) return <div className="space-y-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;
  if (!quote) return <div className="py-12 text-center text-[#3c3e3f]">Quote not found.</div>;

  return (
    <div className="space-y-6">
      <DetailHeader id={quote.biId} name={quote.biName} status={quote.status} createdAt={quote.biCreatedAt} backHref="/quotes" />

      <div className="flex gap-3">
        {quote.status === 'Approved' && (
          <button className="flex items-center gap-2 rounded-md bg-[#05dd4d] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]" style={{ fontFamily: 'var(--font-heading)' }}>
            <ShoppingCart className="h-4 w-4" /> Convert to Order
          </button>
        )}
        <button className="flex items-center gap-2 rounded-md border border-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#0a7b6b] transition-colors hover:bg-[#f5f5f5]" style={{ fontFamily: 'var(--font-heading)' }}>
          <FileDown className="h-4 w-4" /> Export PDF
        </button>
      </div>

      <DetailCard title="Quote Details">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div><p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Valid Until</p><p className="mt-1 text-sm text-[#01332b]">{formatDate(quote.validUntil)}</p></div>
          <div><p className="text-xs font-bold uppercase text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Sales Rep</p><p className="mt-1 text-sm text-[#01332b]">{quote.salesRep?.name || '—'}</p></div>
        </div>
      </DetailCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quote.customer && <PartyCard role="Customer" name={quote.customer.name} address={quote.customer.address} />}
        {quote.shipTo && <PartyCard role="Ship To" name={quote.shipTo.name} address={quote.shipTo.address} />}
        {quote.salesRep && <PartyCard role="Sales Rep" name={quote.salesRep.name} type="individual" />}
      </div>

      <DetailCard title="Line Items"><LineItems items={quote.items || []} /></DetailCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PriceSummary pricing={quote.pricing} />
        <Timeline events={quote.timeline || []} />
      </div>
    </div>
  );
}
