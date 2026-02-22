import { formatCurrency } from '@/lib/utils/format';

export function PriceSummary({ pricing }) {
  if (!pricing) return null;
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Price Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#3c3e3f]">Subtotal</span>
          <span className="text-[#01332b]">{formatCurrency(pricing.subtotal)}</span>
        </div>
        {pricing.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#3c3e3f]">Discount</span>
            <span className="text-[#2E7D32]">-{formatCurrency(pricing.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-[#3c3e3f]">Tax</span>
          <span className="text-[#01332b]">{formatCurrency(pricing.tax)}</span>
        </div>
        {pricing.freight > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#3c3e3f]">Freight</span>
            <span className="text-[#01332b]">{formatCurrency(pricing.freight)}</span>
          </div>
        )}
        <div className="border-t border-[#e7e7e7] pt-2">
          <div className="flex justify-between">
            <span className="text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Total</span>
            <span className="text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(pricing.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
