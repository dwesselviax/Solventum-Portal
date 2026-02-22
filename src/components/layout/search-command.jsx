'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import {
  ShoppingCart,
  FileText,
  Receipt,
  Package,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { orders } from '@/lib/mock-data/orders';
import { quotes } from '@/lib/mock-data/quotes';
import { invoices } from '@/lib/mock-data/invoices';
import { products } from '@/lib/mock-data/products';

const MAX_RESULTS_PER_GROUP = 5;

// Role access mirrors sidebar NAV_ITEMS roles
const SEARCH_GROUP_ROLES = {
  orders: ['orthodontist', 'dso', 'sales_rep', 'ar', 'csr'],
  quotes: ['orthodontist', 'dso', 'sales_rep'],
  invoices: ['orthodontist', 'dso', 'sales_rep', 'ar'],
  products: ['all'],
};

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const userRole = user?.role || 'orthodontist';

  const canAccess = useCallback(
    (group) => {
      const roles = SEARCH_GROUP_ROLES[group];
      return roles.includes('all') || roles.includes(userRole);
    },
    [userRole]
  );

  const placeholderText = useMemo(() => {
    const entities = [];
    if (canAccess('products')) entities.push('products');
    if (canAccess('orders')) entities.push('orders');
    if (canAccess('quotes')) entities.push('quotes');
    if (canAccess('invoices')) entities.push('invoices');
    return `Search ${entities.join(', ')}...`;
  }, [canAccess]);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = useCallback(
    (path) => {
      setOpen(false);
      router.push(path);
    },
    [router]
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-64 items-center gap-2 overflow-hidden rounded-md border border-[#e7e7e7] bg-[#F5F5F5] px-3 text-sm text-[#3c3e3f] transition-colors hover:bg-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="truncate">{placeholderText}</span>
        <kbd
          className="pointer-events-none hidden h-5 shrink-0 select-none items-center gap-1 rounded border border-[#e7e7e7] bg-white px-1.5 font-mono text-[10px] font-medium text-[#3c3e3f] sm:inline-flex"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Global Search"
        description={placeholderText}
        showCloseButton={false}
      >
        <CommandInput placeholder={placeholderText} />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Orders */}
          {canAccess('orders') && (
            <>
              <CommandGroup heading="Orders">
                {orders.slice(0, MAX_RESULTS_PER_GROUP).map((order) => (
                  <CommandItem
                    key={order.biId}
                    value={`order ${order.biId} ${order.biName}`}
                    onSelect={() => handleSelect(`/orders/${order.biId}`)}
                    className="cursor-pointer"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4 text-[#0a7b6b]" />
                    <div className="flex flex-1 flex-col">
                      <span
                        className="text-sm font-medium text-[#01332b]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {order.biId}
                      </span>
                      <span className="text-xs text-[#3c3e3f]">
                        {order.biName}
                      </span>
                    </div>
                    <span className="ml-auto flex items-center gap-1 text-xs text-[#3c3e3f]">
                      {order.status}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Quotes */}
          {canAccess('quotes') && (
            <>
              <CommandGroup heading="Quotes">
                {quotes.slice(0, MAX_RESULTS_PER_GROUP).map((quote) => (
                  <CommandItem
                    key={quote.biId}
                    value={`quote ${quote.biId} ${quote.biName}`}
                    onSelect={() => handleSelect(`/quotes/${quote.biId}`)}
                    className="cursor-pointer"
                  >
                    <FileText className="mr-2 h-4 w-4 text-[#0a7b6b]" />
                    <div className="flex flex-1 flex-col">
                      <span
                        className="text-sm font-medium text-[#01332b]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {quote.biId}
                      </span>
                      <span className="text-xs text-[#3c3e3f]">
                        {quote.biName}
                      </span>
                    </div>
                    <span className="ml-auto flex items-center gap-1 text-xs text-[#3c3e3f]">
                      {quote.status}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Invoices */}
          {canAccess('invoices') && (
            <>
              <CommandGroup heading="Invoices">
                {invoices.slice(0, MAX_RESULTS_PER_GROUP).map((invoice) => (
                  <CommandItem
                    key={invoice.biId}
                    value={`invoice ${invoice.biId} ${invoice.invoiceNumber}`}
                    onSelect={() => handleSelect(`/invoices/${invoice.biId}`)}
                    className="cursor-pointer"
                  >
                    <Receipt className="mr-2 h-4 w-4 text-[#0a7b6b]" />
                    <div className="flex flex-1 flex-col">
                      <span
                        className="text-sm font-medium text-[#01332b]"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {invoice.biId}
                      </span>
                      <span className="text-xs text-[#3c3e3f]">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                    <span className="ml-auto flex items-center gap-1 text-xs text-[#3c3e3f]">
                      {invoice.status}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Products */}
          {canAccess('products') && (
            <CommandGroup heading="Products">
              {products.slice(0, MAX_RESULTS_PER_GROUP).map((product) => (
                <CommandItem
                  key={product.maId}
                  value={`product ${product.maId} ${product.maName}`}
                  onSelect={() => handleSelect(`/products/${product.maId}`)}
                  className="cursor-pointer"
                >
                  <Package className="mr-2 h-4 w-4 text-[#0a7b6b]" />
                  <div className="flex flex-1 flex-col">
                    <span
                      className="text-sm font-medium text-[#01332b]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {product.maName}
                    </span>
                    <span className="text-xs text-[#3c3e3f]">
                      {product.maId} &middot; {product.division}
                    </span>
                  </div>
                  <ArrowRight className="ml-auto h-3 w-3 text-[#3c3e3f]" />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
