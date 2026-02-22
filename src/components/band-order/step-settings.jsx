'use client';

import {
  PRESCRIPTION_OPTIONS,
  TEMPER_OPTIONS,
  WIDTH_OPTIONS,
  MOCK_PRESCRIPTIONS,
} from '@/lib/band-data';
import { Info, FileText } from 'lucide-react';

export default function StepSettings({ bandType, settings, onChange, onBack, onNext }) {
  const needsTemper = bandType.requiresTemper;
  const needsWidth = bandType.requiresWidth;
  const isPrescription = settings.prescription === 'perprescription';

  function updateField(field, value) {
    onChange({ ...settings, [field]: value });
  }

  function selectPrescription(rx) {
    onChange({
      ...settings,
      prescriptionNumber: rx.prescriptionNumber,
      sequenceNumber: rx.sequenceNumber,
      pageNumber: rx.pageNumber,
    });
  }

  const canContinue = (() => {
    if (!settings.prescription) return false;
    if (isPrescription) {
      return !!settings.prescriptionNumber;
    }
    if (needsTemper && !settings.temper) return false;
    if (needsWidth && !settings.width) return false;
    return true;
  })();

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Order Settings</h2>
      <p className="mb-6 text-sm text-[#3c3e3f]">
        Configure options for{' '}
        <span className="font-bold text-[#01332b]">{bandType.label}</span>.
      </p>

      {/* Prescription selection */}
      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
          Attachment Type
        </legend>
        <div className="space-y-2">
          {PRESCRIPTION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-all ${
                settings.prescription === opt.value
                  ? 'border-[#01332b] bg-[#bffde3]/30'
                  : 'border-[#e7e7e7] hover:border-[#1ccf93]'
              }`}
            >
              <input
                type="radio"
                name="prescription"
                value={opt.value}
                checked={settings.prescription === opt.value}
                onChange={() => updateField('prescription', opt.value)}
                className="h-4 w-4 accent-[#01332b]"
              />
              <span className="text-sm font-medium text-[#3c3e3f]">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Prescription picker */}
      {isPrescription && (
        <div className="mb-6 rounded-lg border border-[#e7e7e7] bg-[#F5F5F5] p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
            <FileText size={16} />
            Select Prescription
          </h4>
          {MOCK_PRESCRIPTIONS.length > 0 ? (
            <div className="space-y-2">
              {MOCK_PRESCRIPTIONS.map((rx) => (
                <label
                  key={rx.prescriptionNumber}
                  className={`flex cursor-pointer items-center justify-between rounded-md border-2 bg-white px-4 py-3 transition-all ${
                    settings.prescriptionNumber === rx.prescriptionNumber
                      ? 'border-[#01332b]'
                      : 'border-[#e7e7e7] hover:border-[#1ccf93]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="prescriptionSelect"
                      checked={settings.prescriptionNumber === rx.prescriptionNumber}
                      onChange={() => selectPrescription(rx)}
                      className="h-4 w-4 accent-[#01332b]"
                    />
                    <div>
                      <span className="text-sm font-bold text-[#01332b]">
                        Rx #{rx.prescriptionNumber}
                      </span>
                      <span className="ml-2 text-xs text-[#3c3e3f]">
                        Seq: {rx.sequenceNumber} / Page: {rx.pageNumber}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#3c3e3f]">
                    Last ordered: {rx.lastOrdered}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#3c3e3f]">No prescriptions available.</p>
          )}
          <p className="mt-3 text-xs text-[#3c3e3f]">
            Need to add a prescription?{' '}
            <a href="#" className="font-medium text-[#0a7b6b] underline">
              Contact customer service
            </a>
          </p>
        </div>
      )}

      {/* Temper + Width */}
      {!isPrescription && (needsTemper || needsWidth) && (
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {needsTemper && (
            <fieldset>
              <legend className="mb-3 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Temper</legend>
              <div className="flex gap-3">
                {TEMPER_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      settings.temper === opt.value
                        ? 'border-[#01332b] bg-[#bffde3]/30 text-[#01332b]'
                        : 'border-[#e7e7e7] text-[#3c3e3f] hover:border-[#1ccf93]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="temper"
                      value={opt.value}
                      checked={settings.temper === opt.value}
                      onChange={() => updateField('temper', opt.value)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {needsWidth && (
            <fieldset>
              <legend className="mb-3 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Width</legend>
              <div className="flex gap-3">
                {WIDTH_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      settings.width === opt.value
                        ? 'border-[#01332b] bg-[#bffde3]/30 text-[#01332b]'
                        : 'border-[#e7e7e7] text-[#3c3e3f] hover:border-[#1ccf93]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="width"
                      value={opt.value}
                      checked={settings.width === opt.value}
                      onChange={() => updateField('width', opt.value)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>
      )}

      {/* Defaults info */}
      {!isPrescription && bandType.defaultTemper && (
        <div className="mb-6 flex items-start gap-2 rounded-md border border-[#bffde3] bg-[#bffde3]/20 px-4 py-3">
          <Info size={16} className="mt-0.5 shrink-0 text-[#19a591]" />
          <p className="text-xs text-[#01332b]">
            This band type uses default settings: temper ={' '}
            <strong>{bandType.defaultTemper === 'H' ? 'Hard' : 'Regular'}</strong>, width ={' '}
            <strong>{bandType.defaultWidth === 'W' ? 'Wide' : 'Narrow'}</strong>.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-[#e7e7e7] pt-6">
        <button
          onClick={onBack}
          className="rounded-md border-2 border-[#01332b] px-6 py-2.5 text-sm font-bold text-[#01332b] transition-colors hover:bg-[#01332b] hover:text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-md bg-[#01332b] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#01332b]/90 disabled:cursor-not-allowed disabled:bg-[#cbcbcb] disabled:text-[#3c3e3f]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
