'use client';

import { CheckCircle, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { DetailCard } from '@/components/detail/detail-card';
import { PriceSummary } from '@/components/detail/price-summary';
import Link from 'next/link';

function formatAddress(addr) {
  if (!addr) return [];
  const parts = [addr.street];
  if (addr.suite) parts.push(addr.suite);
  if (addr.building) parts.push(addr.building);
  parts.push(`${addr.city}, ${addr.state} ${addr.zip}`);
  return parts;
}

export default function StepConfirmation({ orderNumber, orderSnapshot, shippingAddress, billingAddress, billingContact, paymentMethod, paymentTerms, party }) {
  const { items = [], subtotal = 0 } = orderSnapshot || {};
  const freight = subtotal >= 500 ? 0 : 14.95;
  const tax = parseFloat(((subtotal + freight) * 0.085).toFixed(2));
  const total = parseFloat((subtotal + freight + tax).toFixed(2));

  const pricing = { subtotal, discount: 0, tax, freight, total };

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="flex items-center gap-4 rounded-lg bg-[#bffde3] p-6">
        <CheckCircle className="h-10 w-10 shrink-0 text-[#0a7b6b]" />
        <div>
          <h2 className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Order Placed Successfully</h2>
          <p className="mt-1 text-sm text-[#01332b]">
            Order number: <span className="font-bold">{orderNumber}</span>
          </p>
          <p className="text-sm text-[#3c3e3f]">A confirmation email has been sent to your registered address.</p>
        </div>
      </div>

      {/* Order items */}
      <DetailCard title="Order Summary">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 border-b border-[#e7e7e7] pb-3 last:border-0 last:pb-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
                <Package className="h-5 w-5 text-[#cbcbcb]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{item.productName}</p>
                <p className="text-xs text-[#3c3e3f]">
                  {item.isBandOrder ? `${item.bandConfig?.totalBands || 0} bands` : `Qty: ${item.quantity}`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#01332b]">
                  {item.isBandOrder ? 'Per item pricing' : formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </DetailCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shipping */}
        <DetailCard title="Shipping Address">
          {shippingAddress && (
            <div>
              <p className="text-sm font-bold text-[#01332b]">{shippingAddress.label}</p>
              {formatAddress(shippingAddress).map((line, i) => (
                <p key={i} className="text-sm text-[#3c3e3f]">{line}</p>
              ))}
            </div>
          )}
        </DetailCard>

        {/* Billing */}
        <DetailCard title="Billing Address">
          <div>
            <p className="text-sm font-bold text-[#01332b]">{party?.name}</p>
            {billingAddress && formatAddress(billingAddress).map((line, i) => (
              <p key={i} className="text-sm text-[#3c3e3f]">{line}</p>
            ))}
            {billingContact && (
              <p className="mt-1 text-xs text-[#3c3e3f]">Contact: {billingContact.name} &middot; {billingContact.email}</p>
            )}
          </div>
        </DetailCard>
      </div>

      {/* Payment method */}
      <DetailCard title="Payment Method">
        <p className="text-sm text-[#01332b]">
          {paymentMethod === 'terms'
            ? `Payment Terms — ${paymentTerms}`
            : 'Credit Card ending in ****'}
        </p>
      </DetailCard>

      {/* Pricing */}
      <PriceSummary pricing={pricing} />

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Link
          href="/products"
          className="rounded-md bg-[#05dd4d] px-8 py-3 text-sm font-bold text-[#01332b] transition-colors hover:bg-[#04c443]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="text-sm font-medium text-[#0a7b6b] transition-colors hover:text-[#01332b] hover:underline"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}
