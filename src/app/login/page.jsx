'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';
import { Loader2 } from 'lucide-react';

const CUSTOMER_ACCOUNTS = [
  { email: 'orthodontist@chenortho.com', label: 'Orthodontist', name: 'Dr. Sarah Chen', org: 'Chen Orthodontics' },
  { email: 'admin@smiledso.com', label: 'DSO Admin', name: 'Mark Reynolds', org: 'Smile DSO Group' },
  { email: 'ap@chenortho.com', label: 'Accounts Payable', name: 'Rachel Torres', org: 'Chen Orthodontics' },
];

const INTERNAL_ACCOUNTS = [
  { email: 'salesrep@solventum.com', label: 'Sales Rep', name: 'Emily Rodriguez', org: 'Solventum' },
  { email: 'ar@solventum.com', label: 'Accounts Receivable', name: 'Lisa Park', org: 'Solventum' },
  { email: 'csr@solventum.com', label: 'Customer Service', name: 'David Kim', org: 'Solventum' },
  { email: 'ops@solventum.com', label: 'Operations', name: 'James Chen', org: 'Solventum' },
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const { logoUrl } = useThemeStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  };

  const handleQuickLogin = async (email) => {
    setUsername(email);
    setPassword('demo');
    await login(email, 'demo');
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#01332b]">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${logoUrl || '/solventum-logo.webp'}`}
            alt="Solventum"
            className="h-20 w-auto"
          />
        </div>

        <div className="rounded-lg border border-white/10 bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-center text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
            Sign In
          </h1>
          <p className="mb-6 text-center text-sm text-[#3c3e3f]">
            Access your Solventum Ortho Portal
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-[#FFEBEE] p-3 text-sm text-[#C62828]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                Email Address
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@company.com"
                className="h-12 w-full rounded-md border border-[#e7e7e7] bg-white px-4 text-base text-[#01332b] placeholder:text-[#cbcbcb] focus:border-[#0a7b6b] focus:outline-none focus:ring-2 focus:ring-[#0a7b6b]/20"
                style={{ fontFamily: 'var(--font-body)' }}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-12 w-full rounded-md border border-[#e7e7e7] bg-white px-4 text-base text-[#01332b] placeholder:text-[#cbcbcb] focus:border-[#0a7b6b] focus:outline-none focus:ring-2 focus:ring-[#0a7b6b]/20"
                style={{ fontFamily: 'var(--font-body)' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-md bg-[#01332b] text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#01332b]/90 disabled:opacity-50"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 border-t border-[#e7e7e7] pt-6">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
              Customer Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CUSTOMER_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleQuickLogin(account.email)}
                  disabled={isLoading}
                  className="rounded-md border border-[#e7e7e7] px-3 py-2 text-left transition-colors hover:border-[#05dd4d] hover:bg-[#bffde3]/30 disabled:opacity-50"
                >
                  <p className="text-xs font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{account.label}</p>
                  <p className="text-[10px] text-[#6e6e6e]">{account.name}</p>
                </button>
              ))}
            </div>

            <p className="mb-3 mt-4 text-center text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
              Internal Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {INTERNAL_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleQuickLogin(account.email)}
                  disabled={isLoading}
                  className="rounded-md border border-[#e7e7e7] px-3 py-2 text-left transition-colors hover:border-[#05dd4d] hover:bg-[#bffde3]/30 disabled:opacity-50"
                >
                  <p className="text-xs font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{account.label}</p>
                  <p className="text-[10px] text-[#6e6e6e]">{account.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-white/60">
          Powered by <span className="font-semibold">viax</span> Revenue Execution
        </p>
      </div>
    </div>
  );
}
