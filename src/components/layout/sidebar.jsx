'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import {
  LayoutDashboard, ShoppingCart, FileText, MessageSquareQuote, RefreshCw,
  Package, Truck, Receipt, UserCircle, HelpCircle, ChevronLeft,
  ChevronRight, Warehouse, HardDrive, Wrench, Recycle, BookOpen,
  GraduationCap, AlertTriangle, ClipboardList, FileSpreadsheet,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['all'] },
  { type: 'divider', label: 'Commerce', roles: ['distributor', 'sales_rep', 'hospital_group'] },
  { href: '/orders', label: 'Orders', icon: ShoppingCart, roles: ['distributor', 'sales_rep', 'hospital_group'] },
  { href: '/quotes', label: 'Quotes', icon: MessageSquareQuote, roles: ['distributor', 'sales_rep', 'hospital_group'] },
  { href: '/invoices', label: 'Invoices', icon: Receipt, roles: ['distributor', 'sales_rep', 'hospital_group'] },
  { href: '/subscriptions', label: 'Subscriptions', icon: RefreshCw, roles: ['sales_rep', 'hospital_group'] },
  { type: 'divider', label: 'Catalog', roles: ['all'] },
  { href: '/products', label: 'Products', icon: Package, roles: ['all'] },
  { href: '/products/price-list', label: 'Price List', icon: FileSpreadsheet, roles: ['distributor', 'sales_rep', 'hospital_group'] },
  { type: 'divider', label: 'Inventory & Assets', roles: ['sales_rep', 'hospital_group'] },
  { href: '/consignment', label: 'Consignment', icon: Warehouse, roles: ['sales_rep', 'hospital_group'] },
  { href: '/assets', label: 'Assets & Devices', icon: HardDrive, roles: ['sales_rep', 'hospital_group'] },
  { type: 'divider', label: 'Logistics', roles: ['distributor', 'sales_rep', 'hospital_group'] },
  { href: '/shipments', label: 'Shipments', icon: Truck, roles: ['distributor', 'sales_rep', 'hospital_group'] },
  { href: '/returns', label: 'Returns & RMA', icon: ClipboardList, roles: ['distributor', 'sales_rep', 'hospital_group'] },
  { type: 'divider', label: 'Services', roles: ['sales_rep', 'hospital_group'] },
  { href: '/documentation', label: 'Documentation', icon: BookOpen, roles: ['all'] },
  { href: '/training', label: 'Training', icon: GraduationCap, roles: ['all'] },
  { type: 'divider', label: 'Account', roles: ['all'] },
  { href: '/account', label: 'My Account', icon: UserCircle, roles: ['all'] },
  { href: '/support', label: 'Support', icon: HelpCircle, roles: ['all'] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const userRole = user?.role || 'distributor';

  const filteredItems = NAV_ITEMS.filter(
    (item) => item.roles.includes('all') || item.roles.includes(userRole)
  );

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-white/10 bg-[#01332b] transition-all duration-200',
        collapsed ? 'w-16' : 'w-[260px]'
      )}
    >
      <div className="flex-1 overflow-y-auto py-2">
        {filteredItems.map((item, index) => {
          if (item.type === 'divider') {
            if (collapsed) return <div key={index} className="mx-3 my-2 border-t border-white/10" />;
            return (
              <div key={index} className="mx-5 mt-4 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/50" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.label}
                </span>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'mx-2 mb-0.5 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'border-l-[3px] border-l-[#05dd4d] bg-white/10 font-bold text-white'
                  : 'border-l-[3px] border-l-transparent text-white/75 hover:bg-white/8 hover:text-white',
                collapsed && 'justify-center px-0'
              )}
              style={{ fontFamily: 'var(--font-heading)' }}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-[#05dd4d]' : 'text-white/60')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center border-t border-white/10 p-3 text-white/60 transition-colors hover:bg-white/8 hover:text-white"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
