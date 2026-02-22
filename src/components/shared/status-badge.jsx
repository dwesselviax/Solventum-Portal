'use client';

import { cn } from '@/lib/utils';
import { getStatusColor } from '@/lib/utils/format';

const colorMap = {
  success: 'bg-[#E8F5E9] text-[#2E7D32]',
  warning: 'bg-[#bffde3] text-[#F9A825]',
  error: 'bg-[#FFEBEE] text-[#C62828]',
  info: 'bg-[#bffde3] text-[#0a7b6b]',
  neutral: 'bg-[#F5F5F5] text-[#3c3e3f]',
};

export function StatusBadge({ status, className }) {
  const color = getStatusColor(status);
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
        colorMap[color] || colorMap.neutral,
        className
      )}
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      {status}
    </span>
  );
}
