'use client';

import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate, formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';

export function RecentActivity({ orders = [] }) {
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Recent Orders</h3>
        <Link href="/orders" className="text-sm text-[#0a7b6b] transition-colors hover:text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
          View All
        </Link>
      </div>
      <div className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <Link
            key={order.biId}
            href={'/orders/' + order.biId}
            className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-[#bffde3]"
          >
            <div>
              <p className="text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{order.biId}</p>
              <p className="text-xs text-[#3c3e3f]">{formatDate(order.biCreatedAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <span className="text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(order.pricing?.total)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
