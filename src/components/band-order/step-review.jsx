'use client';

import { useMemo } from 'react';
import { SIZES } from '@/lib/band-data';
import { ShoppingCart, FileText } from 'lucide-react';

export default function StepReview({ bandType, settings, quantities, comments, onBack, onAddToCart, onAddToQuote }) {
  const orderLines = useMemo(() => {
    return Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([key, qty]) => {
        const withoutPrefix = key.slice(bandType.prefix.length);
        const posMatch = withoutPrefix.match(/^(Up|Lo)(R|L)?/);
        const sizeRaw = withoutPrefix.replace(/^(Up|Lo)(R|L)?/, '');

        const position = posMatch
          ? `${posMatch[1] === 'Up' ? 'Upper' : 'Lower'}${posMatch[2] === 'R' ? ' Right' : posMatch[2] === 'L' ? ' Left' : ''}`
          : '';

        const sizeEntry = SIZES.find((s) => s.value === sizeRaw);
        const sizeLabel = sizeEntry ? sizeEntry.label : sizeRaw.replace('.', ' 1/2');

        return { key, position, size: sizeLabel, quantity: qty };
      })
      .sort((a, b) => a.position.localeCompare(b.position) || a.size.localeCompare(b.size));
  }, [quantities, bandType.prefix]);

  const totalBands = orderLines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Review Your Order</h2>
      <p className="mb-6 text-sm text-[#3c3e3f]">
        Confirm the details below before adding to your cart.
      </p>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Band Type" value={bandType.label} />
        <SummaryCard
          label="Attachment"
          value={
            settings.prescription === 'perprescription'
              ? `Per Prescription (Rx #${settings.prescriptionNumber})`
              : 'Bands only — no attachments'
          }
        />
        <SummaryCard
          label="Settings"
          value={formatSettings(bandType, settings)}
        />
      </div>

      {/* Line items */}
      <div className="overflow-hidden rounded-lg border border-[#e7e7e7]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#01332b] text-white">
              <th className="px-4 py-3 text-left font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Position</th>
              <th className="px-4 py-3 text-left font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Size</th>
              <th className="px-4 py-3 text-right font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orderLines.map((line, idx) => (
              <tr
                key={line.key}
                className={`border-t border-[#e7e7e7] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]/50'}`}
              >
                <td className="px-4 py-2.5 text-[#3c3e3f]">{line.position}</td>
                <td className="px-4 py-2.5 font-medium text-[#01332b]">{line.size}</td>
                <td className="px-4 py-2.5 text-right font-bold text-[#01332b]">
                  {line.quantity}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#01332b] bg-[#bffde3]/30">
              <td colSpan={2} className="px-4 py-3 font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                Total Bands
              </td>
              <td className="px-4 py-3 text-right text-lg font-extrabold text-[#01332b]">
                {totalBands}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Comments */}
      {comments && (
        <div className="mt-4 rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
          <span className="mb-1 block text-xs font-bold tracking-wider text-[#19a591] uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
            Comments
          </span>
          <p className="text-sm text-[#3c3e3f]">{comments}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between border-t border-[#e7e7e7] pt-6">
        <button
          onClick={onBack}
          className="rounded-md border-2 border-[#01332b] px-6 py-2.5 text-sm font-bold text-[#01332b] transition-colors hover:bg-[#01332b] hover:text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Back
        </button>
        <div className="flex gap-3">
          {onAddToQuote && (
            <button
              onClick={onAddToQuote}
              className="flex items-center gap-2 rounded-md border border-[#0a7b6b] px-6 py-3 text-sm font-bold text-[#0a7b6b] transition-colors hover:bg-[#F5F5F5]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <FileText size={16} />
              Add to Quote
            </button>
          )}
          <button
            onClick={onAddToCart}
            className="flex items-center gap-2 rounded-md bg-[#05dd4d] px-8 py-3 text-sm font-bold text-[#01332b] transition-all hover:bg-[#04c443]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
      <span className="mb-1 block text-xs font-bold tracking-wider text-[#19a591] uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
        {label}
      </span>
      <span className="text-sm font-medium text-[#01332b]">{value}</span>
    </div>
  );
}

function formatSettings(bandType, settings) {
  if (settings.prescription === 'perprescription') {
    return 'Determined by prescription';
  }
  const parts = [];
  if (bandType.requiresTemper) {
    parts.push(settings.temper === 'H' ? 'Hard temper' : 'Regular temper');
  } else if (bandType.defaultTemper) {
    parts.push(bandType.defaultTemper === 'H' ? 'Hard temper (default)' : 'Regular temper (default)');
  }
  if (bandType.requiresWidth) {
    parts.push(settings.width === 'W' ? 'Wide' : 'Narrow');
  } else if (bandType.defaultWidth) {
    parts.push(bandType.defaultWidth === 'W' ? 'Wide (default)' : 'Narrow (default)');
  }
  return parts.length > 0 ? parts.join(', ') : 'No additional settings';
}
