'use client';

import { useState } from 'react';
import { Package, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { BandConfigSummary } from '@/components/band-order';
import Link from 'next/link';

export default function StepReviewCart({ items, onBack, onNext }) {
  const [expandedItems, setExpandedItems] = useState({});

  function toggleExpand(id) {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const normalItems = items.filter((item) => !item.isBandOrder);
  const bandItems = items.filter((item) => item.isBandOrder);
  const hasUnconfiguredBands = bandItems.some((item) => !item.bandConfig);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Review Your Cart</h2>
        <p className="mt-1 text-sm text-[#3c3e3f]">{items.length} item{items.length !== 1 ? 's' : ''}</p>
      </div>

      {hasUnconfiguredBands && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-800">Band configuration incomplete</p>
            <p className="mt-1 text-sm text-amber-700">
              One or more band items need configuration before checkout.{' '}
              <Link href="/products/band-order" className="underline hover:text-amber-900">Configure bands</Link>
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {normalItems.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 rounded-lg border border-[#e7e7e7] bg-white p-4 shadow-sm">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
              <Package className="h-7 w-7 text-[#cbcbcb]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{item.productName}</h3>
              <p className="text-xs text-[#3c3e3f]">SKU: {item.sku} &middot; Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#01332b]">{formatCurrency(item.unitPrice * item.quantity)}</span>
            </div>
          </div>
        ))}

        {bandItems.map((item) => (
          <div key={item.productId} className="rounded-lg border border-[#e7e7e7] bg-white shadow-sm">
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#bffde3]/30">
                <Package className="h-7 w-7 text-[#0a7b6b]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{item.productName}</h3>
                  <span className="rounded-full bg-[#bffde3] px-2 py-0.5 text-[10px] font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Band Order
                  </span>
                </div>
                {item.bandConfig ? (
                  <div className="mt-1 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Configuration complete</span>
                    <span className="text-xs text-[#3c3e3f]">&middot; {item.bandConfig.totalBands} bands</span>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600">Not configured</span>
                  </div>
                )}
                {item.bandConfig && (
                  <button
                    onClick={() => toggleExpand(item.productId)}
                    className="mt-1 flex items-center gap-1 text-xs font-medium text-[#0a7b6b] transition-colors hover:text-[#01332b]"
                  >
                    {expandedItems[item.productId] ? (
                      <>Hide details <ChevronUp size={12} /></>
                    ) : (
                      <>Show details <ChevronDown size={12} /></>
                    )}
                  </button>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-[#3c3e3f]">Priced per item</span>
              </div>
            </div>
            {expandedItems[item.productId] && item.bandConfig && (
              <div className="border-t border-[#e7e7e7] bg-[#F5F5F5] p-4">
                <BandConfigSummary bandConfig={item.bandConfig} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="text-sm font-medium text-[#0a7b6b] transition-colors hover:text-[#01332b] hover:underline"
        >
          Back to Cart
        </button>
        <button
          onClick={onNext}
          disabled={hasUnconfiguredBands}
          className="rounded-md bg-[#05dd4d] px-8 py-3 text-sm font-bold text-[#01332b] transition-colors hover:bg-[#04c443] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Continue to Shipping
        </button>
      </div>
    </div>
  );
}
