'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { formatCurrency } from '@/lib/utils/format';
import { BandConfigSummary } from '@/components/band-order';
import { ShoppingCart, Trash2, Plus, Minus, Package, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);

  const [expandedBandItems, setExpandedBandItems] = useState({});

  function toggleExpand(productId) {
    setExpandedBandItems((prev) => ({ ...prev, [productId]: !prev[productId] }));
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F5F5]">
          <ShoppingCart className="h-10 w-10 text-[#cbcbcb]" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Your cart is empty</h1>
        <p className="mb-6 text-sm text-[#3c3e3f]">Add products from the catalog to get started.</p>
        <Link
          href="/products"
          className="rounded-md bg-[#05dd4d] px-6 py-3 text-sm font-bold text-[#01332b] transition-colors hover:bg-[#04c443]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const normalItems = items.filter((item) => !item.isBandOrder);
  const bandItems = items.filter((item) => item.isBandOrder);
  const total = getTotal();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Shopping Cart</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
        <button
          onClick={() => { clearCart(); toast.success('Cart cleared'); }}
          className="flex items-center gap-1 text-sm text-[#3c3e3f] transition-colors hover:text-red-600"
        >
          <Trash2 size={14} />
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {/* Normal items */}
        {normalItems.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 rounded-lg border border-[#e7e7e7] bg-white p-4 shadow-sm">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
              <Package className="h-8 w-8 text-[#e7e7e7]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{item.productName}</h3>
              <p className="text-xs text-[#3c3e3f]">SKU: {item.sku}</p>
              <p className="mt-1 text-sm font-bold text-[#01332b]">{formatCurrency(item.unitPrice)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded border border-[#e7e7e7] text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-bold text-[#01332b]">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded border border-[#e7e7e7] text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="w-24 text-right">
              <span className="text-sm font-bold text-[#01332b]">{formatCurrency(item.unitPrice * item.quantity)}</span>
            </div>
            <button
              onClick={() => { removeItem(item.productId); toast.success('Removed from cart'); }}
              className="text-[#3c3e3f] transition-colors hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* Band order items */}
        {bandItems.map((item) => (
          <div key={item.productId} className="rounded-lg border border-[#e7e7e7] bg-white shadow-sm">
            <div className="flex items-center gap-4 p-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#bffde3]/30">
                <Package className="h-8 w-8 text-[#0a7b6b]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{item.productName}</h3>
                  <span className="rounded-full bg-[#bffde3] px-2 py-0.5 text-[10px] font-bold text-[#0a7b6b]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Band Order
                  </span>
                </div>
                <p className="text-xs text-[#3c3e3f]">
                  {item.bandConfig.totalBands} bands total
                </p>
                <button
                  onClick={() => toggleExpand(item.productId)}
                  className="mt-1 flex items-center gap-1 text-xs font-medium text-[#0a7b6b] transition-colors hover:text-[#01332b]"
                >
                  {expandedBandItems[item.productId] ? (
                    <>Hide details <ChevronUp size={12} /></>
                  ) : (
                    <>Show details <ChevronDown size={12} /></>
                  )}
                </button>
              </div>
              <div className="w-24 text-right">
                <span className="text-xs text-[#3c3e3f]">Priced per item</span>
              </div>
              <button
                onClick={() => { removeItem(item.productId); toast.success('Band order removed from cart'); }}
                className="text-[#3c3e3f] transition-colors hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {expandedBandItems[item.productId] && (
              <div className="border-t border-[#e7e7e7] bg-[#F5F5F5] p-4">
                <BandConfigSummary bandConfig={item.bandConfig} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cart footer */}
      <div className="mt-8 rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e7e7e7] pb-4">
          <span className="text-sm text-[#3c3e3f]">Subtotal ({normalItems.length} standard item{normalItems.length !== 1 ? 's' : ''}{bandItems.length > 0 ? `, ${bandItems.length} band order${bandItems.length !== 1 ? 's' : ''}` : ''})</span>
          <span className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
            {total > 0 ? formatCurrency(total) : 'TBD'}
            {bandItems.length > 0 && total > 0 && <span className="text-xs font-normal text-[#3c3e3f]"> + band pricing</span>}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Link
            href="/products"
            className="text-sm font-medium text-[#0a7b6b] transition-colors hover:text-[#01332b] hover:underline"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => router.push('/checkout')}
            className="rounded-md bg-[#05dd4d] px-8 py-3 text-sm font-bold text-[#01332b] transition-colors hover:bg-[#04c443]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
