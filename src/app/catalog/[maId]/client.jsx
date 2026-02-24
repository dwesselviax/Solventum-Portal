'use client';

import Link from 'next/link';
import { useThemeStore } from '@/stores/theme-store';
import { getProductById } from '@/lib/mock-data/products';
import { DetailCard } from '@/components/detail/detail-card';
import { formatCurrency } from '@/lib/utils/format';
import { ArrowLeft, Package, LogIn } from 'lucide-react';

export default function CatalogProductDetail({ maId }) {
  const { logoUrl } = useThemeStore();
  const product = getProductById(maId);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <header className="border-b border-[#e7e7e7] bg-[#01332b]">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${logoUrl || '/solventum-logo.webp'}`} alt="Solventum" className="h-10 w-auto" />
            </div>
            <Link href="/login" className="flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/10" style={{ fontFamily: 'var(--font-heading)' }}>
              <LogIn className="h-4 w-4" /> Sign In
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-12 text-center text-[#3c3e3f]">Product not found.</main>
      </div>
    );
  }

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
        <div className="space-y-6">
          <Link href="/catalog" className="flex items-center gap-1 text-sm text-[#0a7b6b] transition-colors hover:text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Link>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex items-center justify-center rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-6 overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.maName} className="max-h-72 w-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              ) : null}
              <div className={product.imageUrl ? 'hidden' : 'flex'} style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                <Package className="h-32 w-32 text-[#e7e7e7]" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{product.division}</span>
                <span className="text-sm text-[#3c3e3f]">{product.maId}</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{product.maName}</h1>
              <p className="mt-2 text-sm text-[#3c3e3f]">{product.category}</p>
              <p className="mt-4 text-base text-[#01332b]">{product.maDescription}</p>

              {/* List Price */}
              <div className="mt-4">
                <p className="text-3xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(product.price)}</p>
                <p className="mt-1 text-xs text-[#3c3e3f]">
                  List price shown. <Link href="/login" className="font-bold text-[#0a7b6b] hover:underline">Sign in</Link> for contract pricing.
                </p>
              </div>

              {/* Volume Pricing Table */}
              {product.volumeBreaks && product.volumeBreaks.length > 0 && product.volumeBreaks[0].price > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Volume Pricing
                  </h3>
                  <div className="rounded-md border border-[#e7e7e7] overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#F5F5F5] border-b border-[#e7e7e7]">
                          <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Quantity</th>
                          <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Price</th>
                          <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Savings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.volumeBreaks.map((vb, i) => {
                          const basePrice = product.volumeBreaks[0].price;
                          const savings = basePrice > vb.price ? Math.round((1 - vb.price / basePrice) * 100) : 0;
                          return (
                            <tr key={i} className="border-b border-[#F5F5F5] last:border-b-0">
                              <td className="px-3 py-2 text-[#01332b] font-medium">
                                {vb.minQty}+{vb.label ? <span className="ml-1.5 text-[10px] rounded-full bg-[#bffde3] px-1.5 py-0.5 text-[#0a7b6b] font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{vb.label}</span> : ''}
                              </td>
                              <td className="px-3 py-2 font-bold text-[#01332b]">{formatCurrency(vb.price)}</td>
                              <td className="px-3 py-2 text-[#0a7b6b] font-medium">{savings > 0 ? `${savings}% off` : '\u2014'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Product badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {product.isSerialManaged && <span className="rounded-full bg-[#bffde3] px-3 py-1 text-xs font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>Serialized</span>}
                {product.isBatchManaged && <span className="rounded-full bg-[#bffde3] px-3 py-1 text-xs font-bold text-[#F9A825]" style={{ fontFamily: 'var(--font-heading)' }}>Batch Managed</span>}
                {product.isConfigurable && <span className="rounded-full bg-[#F3E8FD] px-3 py-1 text-xs font-bold text-[#1ccf93]" style={{ fontFamily: 'var(--font-heading)' }}>Configurable</span>}
                {product.isSubscriptionEligible && <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#2E7D32]" style={{ fontFamily: 'var(--font-heading)' }}>Subscription Eligible</span>}
              </div>

              {/* Availability */}
              {product.availability && (
                <div className="mt-4">
                  <span className="text-sm text-[#3c3e3f]">Availability: </span>
                  <span className="text-sm font-semibold text-[#01332b]">{product.availability}</span>
                </div>
              )}
            </div>
          </div>

          {product.specifications && (
            <DetailCard title="Specifications">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-[#F5F5F5] py-2">
                    <span className="text-sm text-[#3c3e3f]">{key}</span>
                    <span className="text-sm font-semibold text-[#01332b]">{value}</span>
                  </div>
                ))}
              </div>
            </DetailCard>
          )}
        </div>
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
