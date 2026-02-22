'use client';

import { useInvoice } from '@/hooks/use-invoices';
import { DetailHeader } from '@/components/detail/detail-header';
import { DetailCard } from '@/components/detail/detail-card';
import { PartyCard } from '@/components/detail/party-card';
import { LineItems } from '@/components/detail/line-items';
import { PriceSummary } from '@/components/detail/price-summary';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { formatDate, formatCurrency } from '@/lib/utils/format';
import { Download } from 'lucide-react';

export default function InvoiceDetailPage({ biId }) {
  const { data: invoice, isLoading } = useInvoice(biId);

  if (isLoading) return <div className="space-y-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;
  if (!invoice) return <div className="py-12 text-center text-[#3c3e3f]">Invoice not found.</div>;

  return (
    <div className="space-y-6">
      <DetailHeader
        id={invoice.biId}
        name={'Invoice ' + invoice.invoiceNumber}
        status={invoice.status}
        createdAt={invoice.biCreatedAt}
        backHref="/invoices"
      />

      <div className="flex gap-3">
        <button className="flex items-center gap-2 rounded-md border border-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#0a7b6b] transition-colors hover:bg-[#f5f5f5]" style={{ fontFamily: 'var(--font-heading)' }}>
          <Download className="h-4 w-4" /> Download PDF
        </button>
        {(invoice.status === 'Open' || invoice.status === 'Overdue') && (
          <button className="rounded-md bg-[#05dd4d] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]" style={{ fontFamily: 'var(--font-heading)' }}>
            Pay Now
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {invoice.customer && <PartyCard role="Customer" name={invoice.customer.name} address={invoice.customer.address} />}
        {invoice.billTo && <PartyCard role="Bill To" name={invoice.billTo.name} address={invoice.billTo.address} />}
        <DetailCard title="Payment Terms">
          <p className="text-sm text-[#3c3e3f]">Terms: <span className="font-semibold text-[#01332b]">{invoice.paymentTerms || 'Net 30'}</span></p>
          <p className="text-sm text-[#3c3e3f]">Due: <span className="font-semibold text-[#01332b]">{formatDate(invoice.dueDate)}</span></p>
          {invoice.paidDate && <p className="text-sm text-[#3c3e3f]">Paid: <span className="font-semibold text-[#2E7D32]">{formatDate(invoice.paidDate)}</span></p>}
        </DetailCard>
      </div>

      <DetailCard title="Line Items">
        <LineItems items={invoice.lineItems || []} />
      </DetailCard>

      <PriceSummary pricing={{
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        tax: invoice.tax,
        freight: invoice.freight,
        total: invoice.totalAmount,
      }} />
    </div>
  );
}
