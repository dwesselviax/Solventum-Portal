'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/use-products';
import { useAuthStore } from '@/stores/auth-store';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { formatCurrency } from '@/lib/utils/format';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { Grid3X3, List, Package, ShoppingCart, Tag, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

const CATEGORY_OPTIONS = [
  { value: 'Brackets & Tubes', label: 'Brackets & Tubes' },
  { value: 'Bonding', label: 'Bonding' },
  { value: 'Clarity Aligners', label: 'Clarity Aligners' },
  { value: 'Archwires', label: 'Archwires' },
  { value: 'Auxiliaries', label: 'Auxiliaries' },
  { value: 'Instruments', label: 'Instruments' },
  { value: 'Prevention', label: 'Prevention' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [promotionsMap, setPromotionsMap] = useState({});
  const { data: products, isLoading } = useProducts({ search, division: category });
  const user = useAuthStore((s) => s.user);
  const canAddToCart = ['orthodontist', 'dso', 'sales_rep'].includes(user?.role);

  // Load promotions data
  useEffect(() => {
    import('@/lib/mock-data/promotions').then(({ promotions }) => {
      const now = new Date();
      const map = {};
      promotions.forEach((promo) => {
        if (promo.status !== 'Active') return;
        const validFrom = new Date(promo.validFrom);
        const validUntil = new Date(promo.validUntil);
        if (now < validFrom || now > validUntil) return;
        promo.eligibleProducts.forEach((pid) => {
          if (!map[pid]) map[pid] = [];
          map[pid].push(promo);
        });
      });
      setPromotionsMap(map);
    });
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Product Catalog</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Browse Solventum orthodontic products</p>
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
        <FilterSelect label="All Categories" value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
      </FiltersBar>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(products || []).map((product) => (
            <Link key={product.maId} href={'/products/' + product.maId} className="group rounded-lg border border-[#e7e7e7] bg-white shadow-sm transition-all hover:shadow-md hover:border-[#05dd4d]">
              <div className="relative flex h-48 items-center justify-center rounded-t-lg bg-[#F5F5F5] overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.maName} className="h-full w-full object-contain p-4" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className={cn('items-center justify-center', product.imageUrl ? 'hidden' : 'flex')} style={{ height: '100%', width: '100%' }}>
                  <Package className="h-16 w-16 text-[#e7e7e7] transition-colors group-hover:text-[#05dd4d]" />
                </div>
                {/* Badges overlay */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {product.sampleEligible && (
                    <span className="flex items-center gap-1 rounded-full bg-[#bffde3] px-2 py-0.5 text-[10px] font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FlaskConical className="h-3 w-3" /> Sample Available
                    </span>
                  )}
                  {promotionsMap[product.maId] && (
                    <span className="flex items-center gap-1 rounded-full bg-[#FFF8E1] px-2 py-0.5 text-[10px] font-bold text-[#F57F17]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <Tag className="h-3 w-3" /> Promo
                    </span>
                  )}
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
                  {product.sampleEligible && (
                    <span className="flex items-center gap-1 rounded-full bg-[#bffde3] px-2 py-0.5 text-[10px] font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <FlaskConical className="h-3 w-3" /> Sample
                    </span>
                  )}
                  {promotionsMap[product.maId] && (
                    <span className="flex items-center gap-1 rounded-full bg-[#FFF8E1] px-2 py-0.5 text-[10px] font-bold text-[#F57F17]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <Tag className="h-3 w-3" /> Promo
                    </span>
                  )}
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
