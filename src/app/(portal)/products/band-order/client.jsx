'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { BAND_TYPES } from '@/lib/band-data';
import { useCartStore } from '@/stores/cart-store';
import { allProducts } from '@/lib/mock-data/products/index';
import {
  BandStepper,
  StepBandType,
  StepSettings,
  StepQuantities,
  StepReview,
} from '@/components/band-order';

export default function BandOrderWizardPage({ initialBandTypeId }) {
  const router = useRouter();
  const addBandItem = useCartStore((s) => s.addBandItem);

  const initialBandType = initialBandTypeId
    ? BAND_TYPES.find((bt) => bt.id === initialBandTypeId) || null
    : null;

  const [step, setStep] = useState(initialBandType ? 1 : 0);
  const [bandType, setBandType] = useState(initialBandType);
  const [settings, setSettings] = useState({ prescription: 'plainband' });
  const [quantities, setQuantities] = useState({});
  const [comments, setComments] = useState('');

  function goTo(s) {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBandTypeSelect(bt) {
    if (bt.id !== bandType?.id) {
      setQuantities({});
      setSettings({ prescription: 'plainband' });
      setComments('');
    }
    setBandType(bt);
  }

  const totalBands = useMemo(
    () => Object.values(quantities).reduce((sum, q) => sum + (q || 0), 0),
    [quantities],
  );

  function handleAddToCart() {
    if (!bandType) return;

    const product = allProducts.find((p) => p.bandTypeId === bandType.id);
    if (!product) return;

    const bandConfig = {
      bandTypeId: bandType.id,
      temper: settings.temper || bandType.defaultTemper || '',
      width: settings.width || bandType.defaultWidth || '',
      prescription: settings.prescription,
      prescriptionNumber: settings.prescriptionNumber || '',
      totalBands,
      items: quantities,
      comments,
    };

    addBandItem(product, bandConfig);
    toast.success(`${totalBands} ${bandType.label} bands added to cart`);
    router.push('/cart');
  }

  function handleAddToQuote() {
    toast.success(`${totalBands} ${bandType.label} bands added to quote request`);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm">
        <Link
          href="/products"
          className="flex items-center gap-1 text-[#0a7b6b] transition-colors hover:underline"
        >
          <Home size={14} />
          Products
        </Link>
        <ChevronRight size={14} className="text-[#cbcbcb]" />
        <span className="font-medium text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Order Bands</span>
      </nav>

      <div className="mx-auto max-w-5xl">
        <BandStepper currentStep={step} />

        {step === 0 && (
          <StepBandType
            selected={bandType}
            onSelect={handleBandTypeSelect}
            onNext={() => goTo(1)}
          />
        )}

        {step === 1 && bandType && (
          <StepSettings
            bandType={bandType}
            settings={settings}
            onChange={setSettings}
            onBack={() => goTo(0)}
            onNext={() => goTo(2)}
          />
        )}

        {step === 2 && bandType && (
          <StepQuantities
            bandType={bandType}
            quantities={quantities}
            onChange={setQuantities}
            comments={comments}
            onCommentsChange={setComments}
            onBack={() => goTo(1)}
            onNext={() => goTo(3)}
          />
        )}

        {step === 3 && bandType && (
          <StepReview
            bandType={bandType}
            settings={settings}
            quantities={quantities}
            comments={comments}
            onBack={() => goTo(2)}
            onAddToCart={handleAddToCart}
            onAddToQuote={handleAddToQuote}
          />
        )}
      </div>
    </div>
  );
}
