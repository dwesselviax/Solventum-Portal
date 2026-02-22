'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { useAuthStore } from '@/stores/auth-store';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency } from '@/lib/utils/format';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { Grid3X3, List, Package, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

const DIVISION_OPTIONS = [
  { value: 'CMF', label: 'CMF' },
  { value: 'Endoscopy', label: 'Endoscopy' },
  { value: 'Healthcare Systems, MedSurg', label: 'Healthcare Systems' },
  { value: 'Instruments', label: 'Instruments' },
  { value: 'Medical', label: 'Medical' },
  { value: 'Neurovascular', label: 'Neurovascular' },
  { value: 'Performance Solutions', label: 'Performance Solutions' },
  { value: 'Reconstructive', label: 'Reconstructive' },
  { value: 'Spine', label: 'Spine' },
  { value: 'Sustainability Solutions', label: 'Sustainability Solutions' },
  { value: 'Trauma & Extremities', label: 'Trauma & Extremities' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [division, setDivision] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const { data: products, isLoading } = useProducts({ search, division });
  const user = useAuthStore((s) => s.user);
  const canAddToCart = user?.role !== 'medical_professional';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Product Catalog</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Browse Solventum orthodontic devices and products</p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[#e7e7e7] bg-white p-1">
          <button onClick={() => setViewMode('grid')} className={cn('rounded p-1.5 transition-colors', viewMode === 'grid' ? 'bg-[#05dd4d] text-[#01332b]' : 'text-[#3c3e3f] hover:bg-[#F5F5F5]')}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={cn('rounded p-1.5 transition-colors', viewMode === 'list' ? 'bg-[#05dd4d] text-[#01332b]' : 'text-[#3c3e3f] hover:bg-[#F5F5F5]')}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Divisions" value={division} onChange={setDivision} options={DIVISION_OPTIONS} />
      </FiltersBar>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(products || []).map((product) => (
            <Link key={product.maId} href={'/products/' + product.maId} className="group rounded-lg border border-[#e7e7e7] bg-white shadow-sm transition-all hover:shadow-md hover:border-[#05dd4d]">
              <div className="flex h-48 items-center justify-center rounded-t-lg bg-[#F5F5F5] overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.maName} className="h-full w-full object-contain p-4" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className={cn('items-center justify-center', product.imageUrl ? 'hidden' : 'flex')} style={{ height: '100%', width: '100%' }}>
                  <Package className="h-16 w-16 text-[#e7e7e7] transition-colors group-hover:text-[#05dd4d]" />
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{product.division}</span>
                  <span className="text-[10px] text-[#3c3e3f]">{product.maId}</span>
                </div>
                <h3 className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{product.maName}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-[#3c3e3f]">{product.maDescription}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(product.price)}</span>
                  {canAddToCart && (
                    <button
                      className="rounded-md bg-[#0a7b6b] p-2 text-white transition-colors hover:bg-[#087a69]"
                      onClick={(e) => { e.preventDefault(); toast.success('Added ' + product.maName + ' to cart'); }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(products || []).map((product) => (
            <Link key={product.maId} href={'/products/' + product.maId} className="flex items-center gap-4 rounded-lg border border-[#e7e7e7] bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-[#05dd4d]">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5] overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.maName} className="h-full w-full object-contain p-1" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className={cn('items-center justify-center', product.imageUrl ? 'hidden' : 'flex')} style={{ height: '100%', width: '100%' }}>
                  <Package className="h-8 w-8 text-[#e7e7e7]" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{product.maName}</h3>
                  <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{product.division}</span>
                </div>
                <p className="mt-0.5 text-xs text-[#3c3e3f]">{product.maId} — {product.category}</p>
              </div>
              <span className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(product.price)}</span>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && (!products || products.length === 0) && (
        <div className="py-12 text-center text-[#3c3e3f]">No products found matching your criteria.</div>
      )}
    </div>
  );
}
