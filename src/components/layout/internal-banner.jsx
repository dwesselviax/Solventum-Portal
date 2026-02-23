'use client';

import { useAuthStore } from '@/stores/auth-store';
import { AlertTriangle } from 'lucide-react';

export function InternalBanner() {
  const { user } = useAuthStore();

  if (!user || user.organizationId !== 'ORG-SOL') return null;

  return (
    <div
      className="flex h-7 items-center justify-center gap-1.5 border-b border-[#E65100]/20 bg-[#FFF3E0] text-xs font-medium text-[#E65100]"
      style={{ fontFamily: 'var(--font-heading)' }}
    >
      <AlertTriangle className="h-3.5 w-3.5" />
      <span>Internal View — Not Customer-Facing</span>
    </div>
  );
}
