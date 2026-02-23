'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useThemeStore } from '@/stores/theme-store';
import {
  Bell,
  LogOut,
  ShoppingCart,
  User,
  ChevronDown,
  Package,
  Truck,
  Receipt,
  FileText,
  FlaskConical,
  Tag,
  Wrench,
} from 'lucide-react';
import { SearchCommand } from '@/components/layout/search-command';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getNotificationsByRole } from '@/lib/mock-data/notifications';

const NOTIFICATION_ICONS = {
  order: Package,
  shipment: Truck,
  invoice: Receipt,
  contract: FileText,
  sample: FlaskConical,
  promotion: Tag,
  service: Wrench,
  system: Bell,
};

function formatRelativeTime(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function Topbar() {
  const { user, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { logoUrl, portalName } = useThemeStore();
  const router = useRouter();

  const [readIds, setReadIds] = useState(new Set());

  const role = user?.role || 'orthodontist';

  const roleNotifications = useMemo(
    () => getNotificationsByRole(role),
    [role]
  );

  const unreadCount = useMemo(
    () => roleNotifications.filter((n) => !n.read && !readIds.has(n.id)).length,
    [roleNotifications, readIds]
  );

  const handleMarkAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      roleNotifications.forEach((n) => next.add(n.id));
      return next;
    });
  }, [roleNotifications]);

  const handleNotificationClick = useCallback(
    (notification) => {
      setReadIds((prev) => new Set(prev).add(notification.id));
      router.push(notification.link);
    },
    [router]
  );

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = user
    ? (user.firstName?.[0] || '') + (user.lastName?.[0] || '')
    : 'U';

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#01332b]/20 bg-[#01332b] px-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${logoUrl || '/solventum-logo.webp'}`}
            alt={portalName || 'Solventum'}
            className="h-10 w-auto"
          />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <SearchCommand />

        {!['ar', 'operations'].includes(role) && (
          <button
            onClick={() => router.push('/cart')}
            className="relative shrink-0 rounded-md p-2 text-white/80 transition-colors hover:bg-white/10"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0a7b6b] text-[10px] font-bold text-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        )}

        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative shrink-0 rounded-md p-2 text-white/80 transition-colors hover:bg-white/10">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C62828] text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3
                className="text-sm font-semibold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-[#0a7b6b] hover:text-[#01332b] transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-[400px] overflow-y-auto">
              {roleNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </div>
              ) : (
                roleNotifications.map((notification) => {
                  const isUnread = !notification.read && !readIds.has(notification.id);
                  const Icon = NOTIFICATION_ICONS[notification.type] || Bell;

                  return (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent ${
                        isUnread ? 'border-l-2 border-l-[#0a7b6b] bg-[#bffde3]/10' : 'border-l-2 border-l-transparent'
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isUnread
                            ? 'bg-[#0a7b6b]/10 text-[#0a7b6b]'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm leading-tight ${
                              isUnread ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'
                            }`}
                          >
                            {notification.title}
                          </p>
                          {isUnread && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0a7b6b]" />
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground/60">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {roleNotifications.length > 0 && (
              <>
                <DropdownMenuSeparator className="m-0" />
                <div className="p-2">
                  <button
                    onClick={() => console.log('Navigate to all notifications')}
                    className="w-full rounded-md py-2 text-center text-xs font-medium text-[#0a7b6b] hover:bg-accent transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-white/10">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#05dd4d] text-xs font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{user?.name}</p>
                <p className="text-xs text-white/60">{user?.organization}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-white/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => router.push('/account')}>
              <User className="mr-2 h-4 w-4" /> My Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-[#C62828]">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
