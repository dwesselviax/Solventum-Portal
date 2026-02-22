'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';
import { Bell, LogOut, User, ChevronDown } from 'lucide-react';
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

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { logoUrl, portalName } = useThemeStore();
  const router = useRouter();

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

        <button className="relative shrink-0 rounded-md p-2 text-white/80 transition-colors hover:bg-white/10">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#C62828]" />
        </button>

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
