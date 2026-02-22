'use client';

import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Band Type', shortLabel: 'Type' },
  { label: 'Settings', shortLabel: 'Settings' },
  { label: 'Quantities', shortLabel: 'Qty' },
  { label: 'Review', shortLabel: 'Review' },
];

export default function BandStepper({ currentStep }) {
  return (
    <nav aria-label="Order progress" className="mb-8">
      <ol className="flex items-center">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isLast = idx === STEPS.length - 1;

          return (
            <li key={step.label} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#05dd4d] text-[#01332b]'
                      : isCurrent
                        ? 'bg-[#01332b] text-white ring-4 ring-[#bffde3]'
                        : 'bg-[#e7e7e7] text-[#3c3e3f]'
                  }`}
                >
                  {isCompleted ? <Check size={18} strokeWidth={3} /> : idx + 1}
                </div>
                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    isCompleted
                      ? 'text-[#01332b]'
                      : isCurrent
                        ? 'text-[#01332b] font-bold'
                        : 'text-[#3c3e3f]'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`mx-4 h-0.5 flex-1 rounded transition-colors ${
                    isCompleted ? 'bg-[#05dd4d]' : 'bg-[#e7e7e7]'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
