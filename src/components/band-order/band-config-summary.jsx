'use client';

import { useMemo } from 'react';
import { SIZES, BAND_TYPES } from '@/lib/band-data';

export default function BandConfigSummary({ bandConfig }) {
  const bandType = BAND_TYPES.find((bt) => bt.id === bandConfig.bandTypeId);

  const orderLines = useMemo(() => {
    if (!bandConfig.items || !bandType) return [];
    return Object.entries(bandConfig.items)
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
  }, [bandConfig.items, bandType]);

  if (!bandType) return null;

  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-[#3c3e3f]">Band Type:</span>
        <span className="font-medium text-[#01332b]">{bandType.label}</span>
        <span className="text-[#3c3e3f]">Attachment:</span>
        <span className="font-medium text-[#01332b]">
          {bandConfig.prescription === 'perprescription'
            ? `Per Prescription (Rx #${bandConfig.prescriptionNumber})`
            : 'Bands only'}
        </span>
        {bandConfig.temper && (
          <>
            <span className="text-[#3c3e3f]">Temper:</span>
            <span className="font-medium text-[#01332b]">{bandConfig.temper === 'H' ? 'Hard' : 'Regular'}</span>
          </>
        )}
        {bandConfig.width && (
          <>
            <span className="text-[#3c3e3f]">Width:</span>
            <span className="font-medium text-[#01332b]">{bandConfig.width === 'W' ? 'Wide' : 'Narrow'}</span>
          </>
        )}
        <span className="text-[#3c3e3f]">Total Bands:</span>
        <span className="font-bold text-[#01332b]">{bandConfig.totalBands}</span>
      </div>

      {orderLines.length > 0 && (
        <div className="overflow-hidden rounded border border-[#e7e7e7]">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#F5F5F5]">
                <th className="px-3 py-1.5 text-left font-bold text-[#01332b]">Position</th>
                <th className="px-3 py-1.5 text-left font-bold text-[#01332b]">Size</th>
                <th className="px-3 py-1.5 text-right font-bold text-[#01332b]">Qty</th>
              </tr>
            </thead>
            <tbody>
              {orderLines.map((line) => (
                <tr key={line.key} className="border-t border-[#e7e7e7]">
                  <td className="px-3 py-1 text-[#3c3e3f]">{line.position}</td>
                  <td className="px-3 py-1 text-[#01332b]">{line.size}</td>
                  <td className="px-3 py-1 text-right font-medium text-[#01332b]">{line.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {bandConfig.comments && (
        <p className="text-xs text-[#3c3e3f]">
          <span className="font-bold">Comments:</span> {bandConfig.comments}
        </p>
      )}
    </div>
  );
}
