'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, MapPin } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { useProducts } from '@/hooks/use-products';
import { useAuthStore } from '@/stores/auth-store';
import { getAddressesByCustomerId } from '@/lib/mock-data/ship-to-addresses';

const MOCK_CUSTOMERS = [
  { id: 'ORG-001', name: 'Chen Orthodontics' },
  { id: 'ORG-002', name: 'Smile DSO Group' },
  { id: 'ORG-003', name: 'Bright Smiles Orthodontics' },
  { id: 'ORG-004', name: 'Metro Dental Partners' },
  { id: 'ORG-005', name: 'Lakeside Family Orthodontics' },
];

const EMPTY_LINE_ITEM = { productId: '', productName: '', quantity: 1, unitPrice: 0 };

function generateQuoteId() {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `QT-${year}-${seq}`;
}

export function QuoteForm({ open, onOpenChange, onQuoteCreated }) {
  const { data: products } = useProducts();
  const [submitting, setSubmitting] = useState(false);

  const user = useAuthStore((s) => s.user);
  const canAllowOrder = ['sales_rep', 'csr'].includes(user?.role);
  const isExternal = ['orthodontist', 'dso', 'ap'].includes(user?.role);

  const [customerId, setCustomerId] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState([{ ...EMPTY_LINE_ITEM }]);
  const [emailToCustomer, setEmailToCustomer] = useState(false);
  const [allowDirectOrder, setAllowDirectOrder] = useState(false);

  // Auto-default customer for external roles
  useEffect(() => {
    if (isExternal && user?.organizationId) {
      setCustomerId(user.organizationId);
    }
  }, [isExternal, user?.organizationId]);

  const addresses = customerId ? getAddressesByCustomerId(customerId) : [];

  // Auto-select the default address when customer changes
  useEffect(() => {
    if (customerId) {
      const customerAddresses = getAddressesByCustomerId(customerId);
      const defaultAddr = customerAddresses.find((a) => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : '');
      setUseCustomAddress(false);
      setCustomAddress({ street: '', city: '', state: '', zip: '' });
    } else {
      setSelectedAddressId('');
      setUseCustomAddress(false);
      setCustomAddress({ street: '', city: '', state: '', zip: '' });
    }
  }, [customerId]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  function resetForm() {
    if (!isExternal) setCustomerId('');
    setDescription('');
    setSelectedAddressId('');
    setUseCustomAddress(false);
    setCustomAddress({ street: '', city: '', state: '', zip: '' });
    setNotes('');
    setLineItems([{ ...EMPTY_LINE_ITEM }]);
    setEmailToCustomer(false);
    setAllowDirectOrder(false);
  }

  function handleAddressChange(value) {
    if (value === '__custom__') {
      setSelectedAddressId('');
      setUseCustomAddress(true);
    } else {
      setSelectedAddressId(value);
      setUseCustomAddress(false);
      setCustomAddress({ street: '', city: '', state: '', zip: '' });
    }
  }

  function handleAddLine() {
    setLineItems([...lineItems, { ...EMPTY_LINE_ITEM }]);
  }

  function handleRemoveLine(index) {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  function handleLineChange(index, field, value) {
    const updated = lineItems.map((item, i) => {
      if (i !== index) return item;
      const next = { ...item, [field]: value };
      // When selecting a product, populate name and price from catalog
      if (field === 'productId' && products) {
        const product = products.find((p) => p.maId === value);
        if (product) {
          next.productName = product.maName;
          next.unitPrice = product.price;
        }
      }
      return next;
    });
    setLineItems(updated);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!customerId) {
      toast.error('Please select a customer.');
      return;
    }
    if (lineItems.some((li) => !li.productId)) {
      toast.error('Please select a product for every line item.');
      return;
    }

    // Build shipTo from selected address or custom address
    const shipTo = useCustomAddress
      ? {
          name: MOCK_CUSTOMERS.find((c) => c.id === customerId)?.name,
          street: customAddress.street,
          city: customAddress.city,
          state: customAddress.state,
          zip: customAddress.zip,
          country: 'US',
        }
      : selectedAddress
        ? {
            name: MOCK_CUSTOMERS.find((c) => c.id === customerId)?.name,
            street: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state,
            zip: selectedAddress.zip,
            country: selectedAddress.country,
          }
        : {
            name: MOCK_CUSTOMERS.find((c) => c.id === customerId)?.name,
            street: '',
            city: '',
            state: '',
            zip: '',
            country: 'US',
          };

    setSubmitting(true);

    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);
    const tax = subtotal * 0.085;
    const now = new Date().toISOString();

    // Valid for 90 days from today
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 90);

    const newQuote = {
      biId: generateQuoteId(),
      biName: description || `${customer?.name} — New Quote`,
      biDescription: description,
      status: 'Draft',
      biCreatedAt: now,
      createdAt: now,
      updatedAt: now,
      validFrom: now,
      validUntil: validUntil.toISOString(),
      customerName: customer?.name,
      customer: {
        id: customerId,
        name: customer?.name,
      },
      salesRep: {
        id: 'USR-003',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@solventum.com',
      },
      items: lineItems.map((li, i) => ({
        lineNumber: i + 1,
        productId: li.productId,
        productName: li.productName,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        discount: 0,
        lineTotal: li.quantity * li.unitPrice,
      })),
      pricing: {
        subtotal,
        discount: 0,
        tax: Math.round(tax * 100) / 100,
        freight: 0,
        total: Math.round((subtotal + tax) * 100) / 100,
        currency: 'USD',
      },
      shipTo,
      convertedToOrderId: null,
      contractId: null,
      termsAndConditions: 'Standard Terms.',
      notes,
      emailToCustomer,
      allowDirectOrder: canAllowOrder ? allowDirectOrder : false,
    };

    // Simulate a short delay to mimic an API call
    setTimeout(() => {
      setSubmitting(false);
      onQuoteCreated?.(newQuote);
      onOpenChange(false);
      resetForm();
      toast.success(`Quote ${newQuote.biId} created successfully.`);
    }, 400);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle
            className="text-lg font-bold uppercase tracking-wider text-[#01332b]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            New Quote
          </SheetTitle>
          <SheetDescription>Fill in the details below to create a new quote.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1 px-4">
          <form id="quote-form" onSubmit={handleSubmit} className="space-y-5 pb-4">
            {/* Customer selection */}
            <div className="space-y-1.5">
              <Label
                className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Customer
              </Label>
              <Select value={customerId} onValueChange={setCustomerId} disabled={isExternal}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CUSTOMERS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Description
              </Label>
              <Input
                placeholder="e.g. Annual Bracket Supply Agreement"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Ship-to address */}
            <fieldset className="space-y-3 rounded-md border border-[#e7e7e7] p-3">
              <legend
                className="px-1 text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Ship-to Address
              </legend>

              <Select
                value={useCustomAddress ? '__custom__' : selectedAddressId}
                onValueChange={handleAddressChange}
                disabled={!customerId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={customerId ? 'Select a ship-to address' : 'Select a customer first'} />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((addr) => (
                    <SelectItem key={addr.id} value={addr.id}>
                      {addr.label} — {addr.street}, {addr.city}, {addr.state}
                    </SelectItem>
                  ))}
                  {addresses.length > 0 && <SelectSeparator />}
                  <SelectItem value="__custom__">Custom Address</SelectItem>
                </SelectContent>
              </Select>

              {/* Read-only preview card for selected saved address */}
              {selectedAddress && !useCustomAddress && (
                <div className="rounded-md border border-[#e7e7e7] bg-[#F5F5F5] p-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0a7b6b]" />
                    <div className="text-sm text-[#3c3e3f]">
                      <p className="font-medium">{selectedAddress.label}</p>
                      <p>{selectedAddress.street}</p>
                      <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual entry fields for custom address */}
              {useCustomAddress && (
                <>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-[#3c3e3f]">Street</Label>
                    <Input
                      placeholder="Street address"
                      value={customAddress.street}
                      onChange={(e) => setCustomAddress({ ...customAddress, street: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-[#3c3e3f]">City</Label>
                      <Input
                        placeholder="City"
                        value={customAddress.city}
                        onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-[#3c3e3f]">State</Label>
                      <Input
                        placeholder="State"
                        value={customAddress.state}
                        onChange={(e) => setCustomAddress({ ...customAddress, state: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-[#3c3e3f]">Zip</Label>
                      <Input
                        placeholder="Zip"
                        value={customAddress.zip}
                        onChange={(e) => setCustomAddress({ ...customAddress, zip: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
            </fieldset>

            {/* Line items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Line Items
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleAddLine}
                  className="gap-1 text-[#0a7b6b]"
                >
                  <Plus className="h-3 w-3" /> Add Line
                </Button>
              </div>

              {lineItems.map((li, idx) => (
                <div
                  key={idx}
                  className="space-y-2 rounded-md border border-[#e7e7e7] bg-[#F5F5F5]/50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider text-[#3c3e3f]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Item {idx + 1}
                    </span>
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLine(idx)}
                        className="text-red-500 transition-colors hover:text-red-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <Select
                    value={li.productId}
                    onValueChange={(val) => handleLineChange(idx, 'productId', val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {(products || []).map((p) => (
                        <SelectItem key={p.maId} value={p.maId}>
                          {p.maName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-[#3c3e3f]">Qty</Label>
                      <Input
                        type="number"
                        min={1}
                        value={li.quantity}
                        onChange={(e) =>
                          handleLineChange(idx, 'quantity', Math.max(1, Number(e.target.value)))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-[#3c3e3f]">Unit Price ($)</Label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={li.unitPrice}
                        onChange={(e) =>
                          handleLineChange(idx, 'unitPrice', Math.max(0, Number(e.target.value)))
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label
                className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Notes
              </Label>
              <Textarea
                placeholder="Additional notes or terms..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Email & Order Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="email-to-customer"
                  checked={emailToCustomer}
                  onChange={(e) => {
                    setEmailToCustomer(e.target.checked);
                    if (!e.target.checked) setAllowDirectOrder(false);
                  }}
                  className="h-4 w-4 rounded border-[#e7e7e7] text-[#0a7b6b] focus:ring-[#0a7b6b]"
                />
                <Label
                  htmlFor="email-to-customer"
                  className="cursor-pointer text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Email quote to customer
                </Label>
              </div>

              {canAllowOrder && emailToCustomer && (
                <div className="flex items-center gap-3 pl-7">
                  <Switch
                    id="allow-direct-order"
                    checked={allowDirectOrder}
                    onCheckedChange={setAllowDirectOrder}
                  />
                  <Label
                    htmlFor="allow-direct-order"
                    className="cursor-pointer text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Allow customer to order directly
                  </Label>
                </div>
              )}
            </div>
          </form>
        </ScrollArea>

        <SheetFooter className="gap-2 border-t border-[#e7e7e7] px-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="quote-form"
            disabled={submitting}
            className="flex-1 bg-[#0a7b6b] font-bold uppercase tracking-wider text-white hover:bg-[#087a69]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {submitting ? 'Creating...' : 'Create Quote'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
