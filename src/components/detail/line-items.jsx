import { formatCurrency } from '@/lib/utils/format';

export function LineItems({ items = [] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e7e7e7]">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F5F5F5]">
            <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Item</th>
            <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>SKU</th>
            <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Product</th>
            <th className="px-4 py-3 text-right text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Qty</th>
            <th className="px-4 py-3 text-right text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Unit Price</th>
            <th className="px-4 py-3 text-right text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.biiId || item.lineNumber || i} className="border-t border-[#e7e7e7]">
              <td className="px-4 py-3 text-sm text-[#01332b]">{item.lineNumber || item.biiId || item.id}</td>
              <td className="px-4 py-3 text-sm text-[#01332b]">{item.sku || item.productId || '\u2014'}</td>
              <td className="px-4 py-3 text-sm text-[#01332b]">{item.productName || item.description || item.biiName || item.name}</td>
              <td className="px-4 py-3 text-right text-sm text-[#01332b]">{item.quantity}</td>
              <td className="px-4 py-3 text-right text-sm text-[#01332b]">{formatCurrency(item.unitPrice)}</td>
              <td className="px-4 py-3 text-right text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(item.lineTotal || item.total || item.unitPrice * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
