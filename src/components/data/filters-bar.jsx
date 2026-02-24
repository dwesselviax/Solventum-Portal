'use client';

import { Search, X, ChevronDown, Check } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useState } from 'react';

export function FiltersBar({ search, onSearchChange, filters = [], children }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3c3e3f]" />
        <input
          type="text"
          placeholder="Search..."
          value={search || ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-10 w-full rounded-md border border-[#e7e7e7] bg-white pl-9 pr-9 text-sm text-[#01332b] placeholder:text-[#e7e7e7] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
          style={{ fontFamily: 'var(--font-body)' }}
        />
        {search && (
          <button onClick={() => onSearchChange?.('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3c3e3f] hover:text-[#01332b]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export function FilterSelect({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const selected = value || [];

  function toggle(optValue) {
    if (selected.includes(optValue)) {
      onChange?.(selected.filter((v) => v !== optValue));
    } else {
      onChange?.([...selected, optValue]);
    }
  }

  const triggerLabel =
    selected.length === 0
      ? label
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label || selected[0]
        : `${selected.length} selected`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] transition-colors hover:border-[#0a7b6b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span className={selected.length === 0 ? 'text-[#3c3e3f]' : ''}>{triggerLabel}</span>
          {selected.length > 0 ? (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => { e.stopPropagation(); onChange?.([]); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onChange?.([]); } }}
              className="ml-0.5 rounded-full p-0.5 text-[#3c3e3f] hover:bg-[#F5F5F5] hover:text-[#01332b]"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-[#3c3e3f]" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        <button
          onClick={() => onChange?.([])}
          disabled={selected.length === 0}
          className="mb-1 w-full rounded px-2 py-1.5 text-left text-xs font-semibold text-[#0a7b6b] hover:bg-[#F5F5F5] disabled:text-[#cbcbcb] disabled:cursor-default disabled:hover:bg-transparent"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Clear all
        </button>
        {options.map((opt) => {
          const isChecked = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-[#01332b] transition-colors hover:bg-[#F5F5F5]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  isChecked
                    ? 'border-[#0a7b6b] bg-[#0a7b6b] text-white'
                    : 'border-[#e7e7e7] bg-white'
                }`}
              >
                {isChecked && <Check className="h-3 w-3" />}
              </span>
              {opt.label}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
