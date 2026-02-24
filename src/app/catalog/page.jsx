'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useThemeStore } from '@/stores/theme-store';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { products as allProducts, categories as productCategories } from '@/lib/mock-data/products';
import { formatCurrency } from '@/lib/utils/format';
import { Grid3X3, List, Package, Tag, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_OPTIONS = productCategories.map((c) => ({ value: c, label: c }));

export default function PublicProductCatalogPage() {
  const { logoUrl } = useThemeStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [promotionsMap, setPromotionsMap] = useState({});

  const filtered = useMemo(() => {
    let list = allProducts;
    if (category.length > 0) {
      list = list.filter((p) => category.includes(p.division));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.maName.toLowerCase().includes(q) ||
          p.maId.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }
    return list;
  }, [search, category]);

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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="border-b border-[#e7e7e7] bg-[#01332b]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${logoUrl || '/solventum-logo.webp'}`}
              alt="Solventum"
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                Product Catalog
              </h1>
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#3c3e3f]">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} shown.
            </p>
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

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <Link key={product.maId} href={'/catalog/' + product.maId} className="group rounded-lg border border-[#e7e7e7] bg-white shadow-sm transition-all hover:shadow-md hover:border-[#05dd4d]">
                <div className="relative flex h-48 items-center justify-center rounded-t-lg bg-[#F5F5F5] overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.maName} className="h-full w-full object-contain p-4" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                  ) : null}
                  <div className={cn('items-center justify-center', product.imageUrl ? 'hidden' : 'flex')} style={{ height: '100%', width: '100%' }}>
                    <Package className="h-16 w-16 text-[#e7e7e7] transition-colors group-hover:text-[#05dd4d]" />
                  </div>
                  {/* Promo badge overlay */}
                  {promotionsMap[product.maId] && (
                    <div className="absolute top-2 right-2">
                      <span className="flex items-center gap-1 rounded-full bg-[#FFF8E1] px-2 py-0.5 text-[10px] font-bold text-[#F57F17]" style={{ fontFamily: 'var(--font-heading)' }}>
                        <Tag className="h-3 w-3" /> Promo
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{product.division}</span>
                    <span className="text-[10px] text-[#3c3e3f]">{product.maId}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{product.maName}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[#3c3e3f]">{product.maDescription}</p>
                  <div className="mt-3">
                    <span className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(product.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product) => (
              <Link key={product.maId} href={'/catalog/' + product.maId} className="flex items-center gap-4 rounded-lg border border-[#e7e7e7] bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-[#05dd4d]">
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

        {filtered.length === 0 && (
          <div className="py-12 text-center text-[#3c3e3f]">No products found matching your criteria.</div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e7e7e7] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center">
          <p className="text-sm text-[#3c3e3f]">
            Pricing shown is list price. <Link href="/login" className="font-bold text-[#0a7b6b] hover:underline">Sign in</Link> or contact your sales representative for contract pricing.
          </p>
          <p className="mt-2 text-xs text-[#cbcbcb]">
            Powered by <span className="font-semibold">viax</span> Revenue Execution
          </p>
        </div>
      </footer>
    </div>
  );
}
