'use client';

import { BAND_TYPES } from '@/lib/band-data';
import { Check } from 'lucide-react';

export default function StepBandType({ selected, onSelect, onNext }) {
  const molars = BAND_TYPES.filter((b) => b.category === 'Molars');
  const bicuspids = BAND_TYPES.filter((b) => b.category === 'Bicuspids');

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Select Band Type</h2>
      <p className="mb-6 text-sm text-[#3c3e3f]">
        Choose the type of orthodontic band you wish to order.
      </p>

      <h3 className="mb-3 text-xs font-bold tracking-widest text-[#19a591] uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
        Molars
      </h3>
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {molars.map((band) => (
          <BandCard
            key={band.id}
            band={band}
            isSelected={selected?.id === band.id}
            onSelect={() => onSelect(band)}
          />
        ))}
      </div>

      <h3 className="mb-3 text-xs font-bold tracking-widest text-[#19a591] uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
        Bicuspids
      </h3>
      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2">
        {bicuspids.map((band) => (
          <BandCard
            key={band.id}
            band={band}
            isSelected={selected?.id === band.id}
            onSelect={() => onSelect(band)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#e7e7e7] pt-6">
        <p className="text-sm text-[#3c3e3f]">
          {selected ? (
            <>
              Selected: <span className="font-bold text-[#01332b]">{selected.label}</span>
            </>
          ) : (
            'Please select a band type to continue.'
          )}
        </p>
        <button
          onClick={onNext}
          disabled={!selected}
          className="rounded-md bg-[#01332b] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#01332b]/90 disabled:cursor-not-allowed disabled:bg-[#cbcbcb] disabled:text-[#3c3e3f]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function BandCard({ band, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`group relative flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-all ${
        isSelected
          ? 'border-[#01332b] bg-[#bffde3]/30 shadow-sm'
          : 'border-[#e7e7e7] bg-white hover:border-[#1ccf93] hover:shadow-sm'
      }`}
    >
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          isSelected
            ? 'border-[#01332b] bg-[#01332b]'
            : 'border-[#cbcbcb] group-hover:border-[#19a591]'
        }`}
      >
        {isSelected && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={`block text-sm font-bold leading-tight ${
            isSelected ? 'text-[#01332b]' : 'text-[#3c3e3f]'
          }`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {band.label}
        </span>
        <span className="mt-1 block text-xs text-[#3c3e3f]">{band.description}</span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {band.columns.map((col) => (
            <span
              key={col}
              className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-medium text-[#3c3e3f]"
            >
              {col}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
