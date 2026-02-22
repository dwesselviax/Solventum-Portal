'use client';

import { DetailCard } from '@/components/detail/detail-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Building2 } from 'lucide-react';

export default function StepPayment({ party, paymentMethod, onPaymentMethodChange, creditCardDetails, onCreditCardChange, onBack, onPlaceOrder }) {
  const paymentTerms = party?.paymentTerms || 'Net 30';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Payment</h2>
        <p className="mt-1 text-sm text-[#3c3e3f]">Choose your payment method.</p>
      </div>

      <DetailCard title="Payment Method">
        <div className="space-y-3">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              paymentMethod === 'terms'
                ? 'border-[#05dd4d] bg-[#bffde3]/20'
                : 'border-[#e7e7e7] hover:border-[#cbcbcb]'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="terms"
              checked={paymentMethod === 'terms'}
              onChange={() => onPaymentMethodChange('terms')}
              className="mt-1 accent-[#05dd4d]"
            />
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#0a7b6b]" />
              <div>
                <p className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Payment Terms</p>
                <p className="text-sm text-[#3c3e3f]">{paymentTerms} &middot; Invoice will be sent to billing contact</p>
              </div>
            </div>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              paymentMethod === 'credit_card'
                ? 'border-[#05dd4d] bg-[#bffde3]/20'
                : 'border-[#e7e7e7] hover:border-[#cbcbcb]'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={paymentMethod === 'credit_card'}
              onChange={() => onPaymentMethodChange('credit_card')}
              className="mt-1 accent-[#05dd4d]"
            />
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#0a7b6b]" />
              <div>
                <p className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Credit Card</p>
                <p className="text-sm text-[#3c3e3f]">Pay with Visa, Mastercard, or Amex</p>
              </div>
            </div>
          </label>
        </div>
      </DetailCard>

      {paymentMethod === 'credit_card' && (
        <DetailCard title="Card Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="cardName" className="mb-1.5 text-[#3c3e3f]">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="Name on card"
                value={creditCardDetails.cardName}
                onChange={(e) => onCreditCardChange({ ...creditCardDetails, cardName: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="cardNumber" className="mb-1.5 text-[#3c3e3f]">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={creditCardDetails.cardNumber}
                onChange={(e) => onCreditCardChange({ ...creditCardDetails, cardNumber: e.target.value })}
                maxLength={19}
              />
            </div>
            <div>
              <Label htmlFor="expiry" className="mb-1.5 text-[#3c3e3f]">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={creditCardDetails.expiry}
                onChange={(e) => onCreditCardChange({ ...creditCardDetails, expiry: e.target.value })}
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="mb-1.5 text-[#3c3e3f]">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={creditCardDetails.cvv}
                onChange={(e) => onCreditCardChange({ ...creditCardDetails, cvv: e.target.value })}
                maxLength={4}
              />
            </div>
          </div>
        </DetailCard>
      )}

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="text-sm font-medium text-[#0a7b6b] transition-colors hover:text-[#01332b] hover:underline"
        >
          Back to Shipping
        </button>
        <button
          onClick={onPlaceOrder}
          className="rounded-md bg-[#05dd4d] px-8 py-3 text-sm font-bold text-[#01332b] transition-colors hover:bg-[#04c443]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
