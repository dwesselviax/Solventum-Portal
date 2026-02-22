'use client';

import { useProduct } from '@/hooks/use-products';
import { useAuthStore } from '@/stores/auth-store';
import { DetailCard } from '@/components/detail/detail-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatCurrency } from '@/lib/utils/format';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { ArrowLeft, Package, ShoppingCart, FileText, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProductDetailPage({ maId }) {
  const { data: product, isLoading } = useProduct(maId);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const canAddToCart = user?.role !== 'medical_professional';

  if (isLoading) return <div className="space-y-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;
  if (!product) return <div className="py-12 text-center text-[#3c3e3f]">Product not found.</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => router.push('/products')} className="flex items-center gap-1 text-sm text-[#0a7b6b] transition-colors hover:text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </button>

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
          <p className="mt-4 text-3xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(product.price)}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.isSerialManaged && <span className="rounded-full bg-[#bffde3] px-3 py-1 text-xs font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>Serialized</span>}
            {product.isBatchManaged && <span className="rounded-full bg-[#bffde3] px-3 py-1 text-xs font-bold text-[#F9A825]" style={{ fontFamily: 'var(--font-heading)' }}>Batch Managed</span>}
            {product.isConfigurable && <span className="rounded-full bg-[#F3E8FD] px-3 py-1 text-xs font-bold text-[#1ccf93]" style={{ fontFamily: 'var(--font-heading)' }}>Configurable</span>}
            {product.isSubscriptionEligible && <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#2E7D32]" style={{ fontFamily: 'var(--font-heading)' }}>Subscription Eligible</span>}
          </div>

          <div className="mt-6 flex gap-3">
            {canAddToCart && (
              <button
                onClick={() => toast.success('Added ' + product.maName + ' to cart')}
                className="flex items-center gap-2 rounded-md bg-[#05dd4d] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]" style={{ fontFamily: 'var(--font-heading)' }}
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
            )}
            {canAddToCart && (
              <button
                onClick={() => toast.success('Added ' + product.maName + ' to quote request')}
                className="flex items-center gap-2 rounded-md border border-[#0a7b6b] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#0a7b6b] transition-colors hover:bg-[#f5f5f5]" style={{ fontFamily: 'var(--font-heading)' }}
              >
                <FileText className="h-4 w-4" /> Add to Quote
              </button>
            )}
            <button
              onClick={() => toast('Issue reported for ' + product.maName)}
              className="flex items-center gap-2 rounded-md border border-[#e7e7e7] px-4 py-3 text-sm text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]"
            >
              <AlertTriangle className="h-4 w-4" /> Report Issue
            </button>
          </div>
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
  );
}
