'use client';

import { Search } from 'lucide-react';

export function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3c3e3f]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-10 w-full rounded-md border border-[#e7e7e7] bg-white pl-9 pr-4 text-sm text-[#01332b] placeholder:text-[#e7e7e7] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
      />
    </div>
  );
}
