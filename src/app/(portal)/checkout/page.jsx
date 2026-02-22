'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { getPartyById } from '@/lib/mock-data/parties';
import {
  CheckoutStepper,
  StepReviewCart,
  StepShipping,
  StepPayment,
  StepConfirmation,
} from '@/components/checkout';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(0);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('terms');
  const [creditCardDetails, setCreditCardDetails] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' });
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderSnapshot, setOrderSnapshot] = useState(null);

  const party = useMemo(() => {
    if (!user?.organizationId) return null;
    return getPartyById(user.organizationId);
  }, [user?.organizationId]);

  // Pre-select default shipping address on mount
  useEffect(() => {
    if (party?.addresses?.shipping) {
      const defaultAddr = party.addresses.shipping.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedShippingAddressId(defaultAddr.id);
      }
    }
  }, [party]);

  // Redirect to cart if empty and not on confirmation step
  useEffect(() => {
    if (items.length === 0 && step !== 3) {
      router.replace('/cart');
    }
  }, [items.length, step, router]);

  function handlePlaceOrder() {
    const subtotal = getTotal();
    setOrderSnapshot({ items: [...items], subtotal });
    const num = String(Math.floor(1000 + Math.random() * 9000));
    setOrderNumber(`ORD-2026-${num}`);
    clearCart();
    setStep(3);
  }

  const shippingAddress = party?.addresses?.shipping?.find((a) => a.id === selectedShippingAddressId) || null;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Checkout</h1>

      <CheckoutStepper currentStep={step} />

      {step === 0 && (
        <StepReviewCart
          items={items}
          onBack={() => router.push('/cart')}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <StepShipping
          party={party}
          selectedShippingAddressId={selectedShippingAddressId}
          onSelectShipping={setSelectedShippingAddressId}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <StepPayment
          party={party}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          creditCardDetails={creditCardDetails}
          onCreditCardChange={setCreditCardDetails}
          onBack={() => setStep(1)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {step === 3 && (
        <StepConfirmation
          orderNumber={orderNumber}
          orderSnapshot={orderSnapshot}
          shippingAddress={shippingAddress}
          billingAddress={party?.addresses?.headquarters}
          billingContact={party?.billingContact}
          paymentMethod={paymentMethod}
          paymentTerms={party?.paymentTerms || 'Net 30'}
          party={party}
        />
      )}
    </div>
  );
}
