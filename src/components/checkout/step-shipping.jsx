'use client';

import { DetailCard } from '@/components/detail/detail-card';

function formatAddress(addr) {
  if (!addr) return 'N/A';
  const parts = [addr.street];
  if (addr.suite) parts.push(addr.suite);
  if (addr.building) parts.push(addr.building);
  parts.push(`${addr.city}, ${addr.state} ${addr.zip}`);
  return parts;
}

export default function StepShipping({ party, selectedShippingAddressId, onSelectShipping, onBack, onNext }) {
  const shippingAddresses = party?.addresses?.shipping || [];
  const hq = party?.addresses?.headquarters;
  const billingContact = party?.billingContact;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Shipping &amp; Billing</h2>
        <p className="mt-1 text-sm text-[#3c3e3f]">Select a shipping address for your order.</p>
      </div>

      <DetailCard title="Shipping Address">
        <div className="space-y-3">
          {shippingAddresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                selectedShippingAddressId === addr.id
                  ? 'border-[#05dd4d] bg-[#bffde3]/20'
                  : 'border-[#e7e7e7] hover:border-[#cbcbcb]'
              }`}
            >
              <input
                type="radio"
                name="shippingAddress"
                value={addr.id}
                checked={selectedShippingAddressId === addr.id}
                onChange={() => onSelectShipping(addr.id)}
                className="mt-1 accent-[#05dd4d]"
              />
              <div>
                <p className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {addr.label}
                  {addr.isDefault && (
                    <span className="ml-2 rounded-full bg-[#bffde3] px-2 py-0.5 text-[10px] font-bold text-[#0a7b6b]">Default</span>
                  )}
                </p>
                {formatAddress(addr).map((line, i) => (
                  <p key={i} className="text-sm text-[#3c3e3f]">{line}</p>
                ))}
              </div>
            </label>
          ))}
        </div>
      </DetailCard>

      <DetailCard title="Billing Address">
        <div className="rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
          <p className="text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{party?.name}</p>
          {hq && formatAddress(hq).map((line, i) => (
            <p key={i} className="text-sm text-[#3c3e3f]">{line}</p>
          ))}
          {billingContact && (
            <div className="mt-2 border-t border-[#e7e7e7] pt-2">
              <p className="text-xs text-[#3c3e3f]">Billing Contact: {billingContact.name} &middot; {billingContact.email}</p>
            </div>
          )}
        </div>
      </DetailCard>

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="text-sm font-medium text-[#0a7b6b] transition-colors hover:text-[#01332b] hover:underline"
        >
          Back to Review
        </button>
        <button
          onClick={onNext}
          disabled={!selectedShippingAddressId}
          className="rounded-md bg-[#05dd4d] px-8 py-3 text-sm font-bold text-[#01332b] transition-colors hover:bg-[#04c443] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
