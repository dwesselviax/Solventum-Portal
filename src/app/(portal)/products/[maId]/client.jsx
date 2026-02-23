'use client';

import { useState, useEffect, useMemo } from 'react';
import { useProduct } from '@/hooks/use-products';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { DetailCard } from '@/components/detail/detail-card';
import { formatCurrency } from '@/lib/utils/format';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { ArrowLeft, Package, ShoppingCart, FileText, AlertTriangle, FlaskConical, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProductDetailPage({ maId }) {
  const { data: product, isLoading } = useProduct(maId);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);
  const canAddToCart = ['orthodontist', 'dso', 'sales_rep'].includes(user?.role);
  const isCustomerRole = ['orthodontist', 'dso'].includes(user?.role);

  const [contractPricing, setContractPricing] = useState(null);
  const [activePromo, setActivePromo] = useState(null);

  // Load contract pricing for customer roles
  useEffect(() => {
    if (!isCustomerRole || !user?.organizationId || !product) return;
    import('@/lib/mock-data/contracts').then(({ contracts }) => {
      const contract = contracts.find(
        (c) => c.customerId === user.organizationId && c.status === 'Active'
      );
      if (!contract) return;
      const special = contract.specialPricing.find((sp) => sp.productId === product.maId);
      if (special) {
        setContractPricing({
          contractPrice: special.contractPrice,
          listPrice: special.listPrice,
          tierLevel: contract.tierLevel,
          discountPercentage: contract.discountPercentage,
        });
      }
    });
  }, [isCustomerRole, user?.organizationId, product]);

  // Load promotions data
  useEffect(() => {
    if (!product) return;
    import('@/lib/mock-data/promotions').then(({ promotions }) => {
      const now = new Date();
      const promo = promotions.find((p) => {
        if (p.status !== 'Active') return false;
        const validFrom = new Date(p.validFrom);
        const validUntil = new Date(p.validUntil);
        if (now < validFrom || now > validUntil) return false;
        return p.eligibleProducts.includes(product.maId);
      });
      setActivePromo(promo || null);
    });
  }, [product]);

  if (isLoading) return <div className="space-y-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;
  if (!product) return <div className="py-12 text-center text-[#3c3e3f]">Product not found.</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => router.push('/products')} className="flex items-center gap-1 text-sm text-[#0a7b6b] transition-colors hover:text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </button>

      {/* Promo banner */}
      {activePromo && (
        <div className="flex items-start gap-3 rounded-lg border border-[#FFD54F] bg-[#FFFDE7] p-4">
          <Tag className="mt-0.5 h-5 w-5 shrink-0 text-[#F57F17]" />
          <div>
            <p className="text-sm font-bold text-[#F57F17]" style={{ fontFamily: 'var(--font-heading)' }}>{activePromo.name}</p>
            <p className="mt-0.5 text-sm text-[#3c3e3f]">
              {activePromo.discountType === 'percentage' && `${activePromo.discountValue}% off`}
              {activePromo.discountType === 'fixed' && `${formatCurrency(activePromo.discountValue)} off`}
              {activePromo.discountType === 'free_product' && 'Free product included'}
              {' — '}
              {activePromo.description}
            </p>
            {activePromo.code && (
              <p className="mt-1 text-xs text-[#3c3e3f]">
                Use code: <span className="font-mono font-bold text-[#F57F17]">{activePromo.code}</span>
              </p>
            )}
          </div>
        </div>
      )}

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

          {/* Pricing section */}
          <div className="mt-4">
            {contractPricing ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {formatCurrency(contractPricing.contractPrice)}
                </span>
                <span className="text-lg text-[#3c3e3f] line-through">{formatCurrency(contractPricing.listPrice)}</span>
                <span className="rounded-full bg-[#bffde3] px-2 py-0.5 text-xs font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {contractPricing.tierLevel} -{contractPricing.discountPercentage}%
                </span>
              </div>
            ) : (
              <p className="text-3xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{formatCurrency(product.price)}</p>
            )}
          </div>

          {/* Volume Pricing Table */}
          {product.volumeBreaks && product.volumeBreaks.length > 0 && product.volumeBreaks[0].price > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Volume Pricing
              </h3>
              {['sales_rep', 'ar'].includes(user?.role) && (
                <div className="mb-2 text-xs text-[#3c3e3f]">
                  <span className="font-medium">List Price:</span> {formatCurrency(product.listPrice || product.price)}
                  {contractPricing && (
                    <>
                      {' \u00b7 '}<span className="font-medium">Contract:</span> {formatCurrency(contractPricing.contractPrice)}
                      {' \u00b7 '}<span className="font-medium">Discount:</span> {contractPricing.discountPercentage}% off list
                    </>
                  )}
                </div>
              )}
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

          <div className="mt-4 flex flex-wrap gap-2">
            {product.isSerialManaged && <span className="rounded-full bg-[#bffde3] px-3 py-1 text-xs font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>Serialized</span>}
            {product.isBatchManaged && <span className="rounded-full bg-[#bffde3] px-3 py-1 text-xs font-bold text-[#F9A825]" style={{ fontFamily: 'var(--font-heading)' }}>Batch Managed</span>}
            {product.isConfigurable && <span className="rounded-full bg-[#F3E8FD] px-3 py-1 text-xs font-bold text-[#1ccf93]" style={{ fontFamily: 'var(--font-heading)' }}>Configurable</span>}
            {product.isSubscriptionEligible && <span className="rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#2E7D32]" style={{ fontFamily: 'var(--font-heading)' }}>Subscription Eligible</span>}
            {product.sampleEligible && <span className="rounded-full bg-[#bffde3] px-3 py-1 text-xs font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>Sample Available</span>}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {canAddToCart && product.isBandProduct ? (
              <button
                onClick={() => router.push('/products/band-order/' + product.bandTypeId)}
                className="flex items-center gap-2 rounded-md bg-[#05dd4d] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]" style={{ fontFamily: 'var(--font-heading)' }}
              >
                <ShoppingCart className="h-4 w-4" /> Configure &amp; Order
              </button>
            ) : canAddToCart ? (
              <button
                onClick={() => { addItem(product, 1); toast.success('Added to cart'); }}
                className="flex items-center gap-2 rounded-md bg-[#05dd4d] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443]" style={{ fontFamily: 'var(--font-heading)' }}
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
            ) : null}
            {canAddToCart && !product.isBandProduct && (
              <button
                onClick={() => toast.success('Added ' + product.maName + ' to quote request')}
                className="flex items-center gap-2 rounded-md border border-[#0a7b6b] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#0a7b6b] transition-colors hover:bg-[#f5f5f5]" style={{ fontFamily: 'var(--font-heading)' }}
              >
                <FileText className="h-4 w-4" /> Add to Quote
              </button>
            )}
            {product.sampleEligible && ['orthodontist', 'dso', 'sales_rep'].includes(user?.role) && (
              <button
                onClick={() => toast.success('Sample request submitted for ' + product.maName + '. You will receive a confirmation email shortly.')}
                className="flex items-center gap-2 rounded-md border border-[#0a7b6b] bg-[#bffde3] px-6 py-3 text-sm font-bold uppercase tracking-wider text-[#0a7b6b] transition-colors hover:bg-[#a0f5d0]" style={{ fontFamily: 'var(--font-heading)' }}
              >
                <FlaskConical className="h-4 w-4" /> Request Sample
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
