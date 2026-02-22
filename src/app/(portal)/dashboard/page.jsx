'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useOrders } from '@/hooks/use-orders';
import { useInvoices } from '@/hooks/use-invoices';
import { useQuotes } from '@/hooks/use-quotes';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { ProgressRing } from '@/components/dashboard/progress-ring';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TasksWidget } from '@/components/dashboard/tasks-widget';
import { DashboardSkeleton } from '@/components/shared/loading-skeleton';
import { ShoppingCart, DollarSign, MessageSquareQuote, RefreshCw, FileText, Truck, Package, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: invoices } = useInvoices();
  const { data: quotes } = useQuotes();
  const { data: subscriptions } = useSubscriptions();

  if (ordersLoading) return <DashboardSkeleton />;

  const totalOrders = orders?.length || 0;
  const openQuotes = quotes?.filter((q) => q.status === 'Submitted' || q.status === 'Draft').length || 0;
  const activeSubscriptions = subscriptions?.filter((s) => s.status === 'Active').length || 0;
  const revenue = orders?.reduce((sum, o) => sum + (o.pricing?.total || 0), 0) || 0;

  const role = user?.role;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
          Hi, {user?.firstName || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">
          Welcome to your Solventum Ortho Portal — here is your overview.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Orders" value={totalOrders} trend={12.5} trendLabel="vs last month" icon={ShoppingCart} />
        <KpiCard title="Revenue (MTD)" value={'$' + (revenue / 1000).toFixed(0) + 'k'} trend={8.3} trendLabel="vs last month" icon={DollarSign} />
        <KpiCard title="Open Quotes" value={openQuotes} trend={-3.2} trendLabel="vs last month" icon={MessageSquareQuote} />
        {role !== 'medical_professional' ? (
          <KpiCard title="Active Subscriptions" value={activeSubscriptions} trend={5.1} trendLabel="vs last month" icon={RefreshCw} />
        ) : (
          <KpiCard title="Training Modules" value={8} trend={15} trendLabel="new this month" icon={BookOpen} />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
          <h3 className="mb-6 text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Monthly Goals</h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <ProgressRing value={73} label="Orders" sublabel="22 of 30" />
            <ProgressRing value={85} label="Revenue" sublabel="$352k of $415k" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity orders={orders || []} />
        <TasksWidget />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { href: '/quotes', label: 'New Quote', icon: MessageSquareQuote, color: '#0a7b6b' },
          { href: '/orders', label: 'View Orders', icon: ShoppingCart, color: '#19a591' },
          { href: '/products', label: 'Browse Products', icon: Package, color: '#01332b' },
          { href: '/support', label: 'Get Support', icon: FileText, color: '#1ccf93' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-lg border border-[#e7e7e7] bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-[#05dd4d]"
          >
            <div className="rounded-lg p-2" style={{ backgroundColor: link.color + '15' }}>
              <link.icon className="h-5 w-5" style={{ color: link.color }} />
            </div>
            <span className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
