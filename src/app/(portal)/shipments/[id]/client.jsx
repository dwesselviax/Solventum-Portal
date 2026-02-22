'use client';

import { useState, useEffect } from 'react';
import { DetailHeader } from '@/components/detail/detail-header';
import { DetailCard } from '@/components/detail/detail-card';
import { PartyCard } from '@/components/detail/party-card';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils/format';
import { Package, Truck, MapPin, Clock } from 'lucide-react';

export default function ShipmentDetailPage({ shipmentId }) {
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/lib/mock-data/shipments').then((mod) => {
      setShipment((mod.shipments || []).find((s) => s.id === shipmentId) || null);
      setLoading(false);
    });
  }, [shipmentId]);

  if (loading) return <div className="space-y-6"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;
  if (!shipment) return <div className="py-12 text-center text-[#3c3e3f]">Shipment not found.</div>;

  const formatAddress = (addr) => {
    if (!addr) return null;
    const parts = [addr.street, addr.building, `${addr.city}, ${addr.state} ${addr.zip}`].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      <DetailHeader
        id={shipment.id}
        name={`Order ${shipment.orderId}`}
        status={shipment.status}
        createdAt={shipment.shipDate}
        backHref="/shipments"
      />

      {/* Shipment Overview */}
      <DetailCard title="Shipment Overview">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 h-5 w-5 text-[#05dd4d]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Carrier</p>
              <p className="text-sm font-semibold text-[#01332b]">{shipment.carrier}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-5 w-5 text-[#05dd4d]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Tracking Number</p>
              <p className="font-mono text-sm font-semibold text-[#0a7b6b]">{shipment.trackingNumber || '---'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-[#05dd4d]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Service Level</p>
              <p className="text-sm font-semibold text-[#01332b]">{shipment.serviceLevel}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-[#05dd4d]" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>
                {shipment.actualDelivery ? 'Delivered' : 'Est. Delivery'}
              </p>
              <p className="text-sm font-semibold text-[#01332b]">
                {formatDate(shipment.actualDelivery || shipment.estimatedDelivery)}
              </p>
            </div>
          </div>
        </div>
        {shipment.specialInstructions && (
          <div className="mt-4 rounded-md border border-[#05dd4d]/30 bg-[#bffde3] p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Special Instructions</p>
            <p className="mt-1 text-sm text-[#01332b]">{shipment.specialInstructions}</p>
          </div>
        )}
        {shipment.insuranceValue && (
          <div className="mt-3 flex justify-between border-t border-[#e7e7e7] pt-3">
            <span className="text-sm text-[#3c3e3f]">Insurance Value</span>
            <span className="text-sm font-semibold text-[#01332b]">{formatCurrency(shipment.insuranceValue)}</span>
          </div>
        )}
      </DetailCard>

      {/* Ship From / Ship To */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PartyCard
          role="Ship From"
          name={shipment.shipFrom?.name}
          address={formatAddress(shipment.shipFrom)}
        />
        <PartyCard
          role="Ship To"
          name={shipment.shipTo?.name}
          address={formatAddress(shipment.shipTo)}
        />
      </div>

      {/* Items Table */}
      {shipment.items?.length > 0 && (
        <DetailCard title="Items">
          <div className="overflow-hidden rounded-lg border border-[#e7e7e7]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F5F5]">
                  <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Product ID</th>
                  <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Product</th>
                  <th className="px-4 py-3 text-right text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Qty</th>
                  <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Serial Numbers</th>
                  <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Lot Numbers</th>
                </tr>
              </thead>
              <tbody>
                {shipment.items.map((item, i) => (
                  <tr key={item.productId || i} className="border-t border-[#e7e7e7]">
                    <td className="px-4 py-3 text-sm text-[#01332b]">{item.productId}</td>
                    <td className="px-4 py-3 text-sm text-[#01332b]">{item.productName}</td>
                    <td className="px-4 py-3 text-right text-sm text-[#01332b]">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-[#01332b]">
                      {item.serialNumbers ? (
                        <span className="font-mono text-xs text-[#3c3e3f]">{item.serialNumbers.slice(0, 3).join(', ')}{item.serialNumbers.length > 3 ? ` +${item.serialNumbers.length - 3} more` : ''}</span>
                      ) : (
                        <span className="text-[#3c3e3f]">{'\u2014'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#01332b]">
                      {item.lotNumbers ? (
                        <span className="font-mono text-xs text-[#3c3e3f]">{item.lotNumbers.join(', ')}</span>
                      ) : (
                        <span className="text-[#3c3e3f]">{'\u2014'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DetailCard>
      )}

      {/* Packages Table */}
      {shipment.packages?.length > 0 && (
        <DetailCard title="Packages">
          <div className="overflow-hidden rounded-lg border border-[#e7e7e7]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F5F5]">
                  <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Package #</th>
                  <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Weight</th>
                  <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Dimensions</th>
                  <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {shipment.packages.map((pkg, i) => (
                  <tr key={pkg.packageNumber || i} className="border-t border-[#e7e7e7]">
                    <td className="px-4 py-3 text-sm font-semibold text-[#01332b]">{pkg.packageNumber}</td>
                    <td className="px-4 py-3 text-sm text-[#01332b]">{pkg.weight}</td>
                    <td className="px-4 py-3 text-sm text-[#01332b]">{pkg.dimensions}</td>
                    <td className="px-4 py-3 text-sm text-[#01332b]">{pkg.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DetailCard>
      )}

      {/* Tracking History Timeline */}
      {shipment.trackingHistory?.length > 0 && (
        <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Tracking History</h3>
          <div className="relative space-y-4 pl-6">
            <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#e7e7e7]" />
            {shipment.trackingHistory.map((event, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-[#05dd4d] bg-white" />
                <p className="text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{event.status}</p>
                <p className="text-xs text-[#3c3e3f]">{formatDateTime(event.timestamp)}</p>
                {event.location && <p className="mt-1 text-sm text-[#3c3e3f]">{event.location}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
