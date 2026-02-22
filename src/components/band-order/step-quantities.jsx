'use client';

import { useMemo } from 'react';
import { SIZES } from '@/lib/band-data';
import { Trash2 } from 'lucide-react';

export default function StepQuantities({ bandType, quantities, onChange, comments, onCommentsChange, onBack, onNext }) {
  const { columns, fields, prefix } = bandType;

  const totalBands = useMemo(
    () => Object.values(quantities).reduce((sum, q) => sum + (q || 0), 0),
    [quantities],
  );

  function updateQty(size, fieldKey, value) {
    const parsed = value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);
    const key = `${prefix}${fieldKey}${size}`;
    onChange({ ...quantities, [key]: parsed });
  }

  function getQty(size, fieldKey) {
    const key = `${prefix}${fieldKey}${size}`;
    return quantities[key] || '';
  }

  function clearAll() {
    onChange({});
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="mb-1 text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Enter Quantities</h2>
          <p className="text-sm text-[#3c3e3f]">
            Enter the quantity for each size and position for{' '}
            <span className="font-bold text-[#01332b]">{bandType.label}</span>.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-[#bffde3] px-4 py-2 text-center">
            <span className="block text-xs font-medium text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Total Bands</span>
            <span className="text-xl font-extrabold text-[#01332b]">{totalBands}</span>
          </div>
          {totalBands > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-sm text-[#3c3e3f] transition-colors hover:text-red-600"
            >
              <Trash2 size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Quantity grid */}
      <div className="overflow-x-auto rounded-lg border border-[#e7e7e7]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#01332b] text-white">
              <th className="px-4 py-3 text-left font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Size</th>
              {columns.map((col) => (
                <th key={col} className="px-3 py-3 text-center font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZES.map((size, idx) => (
              <tr
                key={size.value}
                className={`border-t border-[#e7e7e7] transition-colors hover:bg-[#bffde3]/10 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]/50'
                }`}
              >
                <td className="px-4 py-2 font-medium text-[#01332b]">{size.label}</td>
                {fields.map((fieldKey) => {
                  const val = getQty(size.value, fieldKey);
                  return (
                    <td key={fieldKey} className="px-3 py-1.5 text-center">
                      <input
                        type="number"
                        min="0"
                        max="999"
                        value={val}
                        onChange={(e) => updateQty(size.value, fieldKey, e.target.value)}
                        className="w-16 rounded border border-[#e7e7e7] bg-white px-2 py-1.5 text-center text-sm text-[#3c3e3f] transition-colors focus:border-[#0a7b6b] focus:ring-1 focus:ring-[#0a7b6b] focus:outline-none"
                        placeholder="0"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comments */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
          Comments <span className="font-normal text-[#3c3e3f]">(optional)</span>
        </label>
        <textarea
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          placeholder="Add any special instructions for this order..."
          rows={3}
          className="w-full rounded-lg border border-[#e7e7e7] px-4 py-3 text-sm text-[#3c3e3f] placeholder:text-[#cbcbcb] focus:border-[#0a7b6b] focus:ring-1 focus:ring-[#0a7b6b] focus:outline-none"
        />
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between border-t border-[#e7e7e7] pt-6">
        <button
          onClick={onBack}
          className="rounded-md border-2 border-[#01332b] px-6 py-2.5 text-sm font-bold text-[#01332b] transition-colors hover:bg-[#01332b] hover:text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={totalBands === 0}
          className="rounded-md bg-[#01332b] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#01332b]/90 disabled:cursor-not-allowed disabled:bg-[#cbcbcb] disabled:text-[#3c3e3f]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Review Order
        </button>
      </div>
    </div>
  );
}
