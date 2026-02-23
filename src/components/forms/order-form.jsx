'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProducts } from '@/hooks/use-products';

const MOCK_CUSTOMERS = [
  { id: 'ORG-001', name: 'Chen Orthodontics' },
  { id: 'ORG-002', name: 'Smile DSO Group' },
  { id: 'ORG-003', name: 'Bright Smiles Orthodontics' },
  { id: 'ORG-004', name: 'Metro Dental Partners' },
  { id: 'ORG-005', name: 'Lakeside Family Orthodontics' },
];

const EMPTY_LINE_ITEM = { productId: '', productName: '', quantity: 1, unitPrice: 0 };

function generateOrderId() {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `ORD-${year}-${seq}`;
}

export function OrderForm({ open, onOpenChange, onOrderCreated }) {
  const { data: products } = useProducts();
  const [submitting, setSubmitting] = useState(false);

  const [customerId, setCustomerId] = useState('');
  const [description, setDescription] = useState('');
  const [shipToStreet, setShipToStreet] = useState('');
  const [shipToCity, setShipToCity] = useState('');
  const [shipToState, setShipToState] = useState('');
  const [shipToZip, setShipToZip] = useState('');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState([{ ...EMPTY_LINE_ITEM }]);

  function resetForm() {
    setCustomerId('');
    setDescription('');
    setShipToStreet('');
    setShipToCity('');
    setShipToState('');
    setShipToZip('');
    setNotes('');
    setLineItems([{ ...EMPTY_LINE_ITEM }]);
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

    setSubmitting(true);

    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);
    const tax = subtotal * 0.085;

    const newOrder = {
      biId: generateOrderId(),
      biName: description || `${customer?.name} — New Order`,
      biDescription: description,
      status: 'Draft',
      priority: 'Standard',
      biCreatedAt: new Date().toISOString(),
      biUpdatedAt: new Date().toISOString(),
      biCompletedAt: null,
      customerName: customer?.name,
      customer: {
        id: customerId,
        name: customer?.name,
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
      shipTo: {
        name: customer?.name,
        street: shipToStreet,
        city: shipToCity,
        state: shipToState,
        zip: shipToZip,
        country: 'US',
      },
      notes,
    };

    // Simulate a short delay to mimic an API call
    setTimeout(() => {
      setSubmitting(false);
      onOrderCreated?.(newOrder);
      onOpenChange(false);
      resetForm();
      toast.success(`Order ${newOrder.biId} created successfully.`);
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
            New Order
          </SheetTitle>
          <SheetDescription>Fill in the details below to create a new order.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1 px-4">
          <form id="order-form" onSubmit={handleSubmit} className="space-y-5 pb-4">
            {/* Customer selection */}
            <div className="space-y-1.5">
              <Label
                className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Customer
              </Label>
              <Select value={customerId} onValueChange={setCustomerId}>
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
                placeholder="e.g. Q1 Restock — Clarity Brackets"
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
              <div className="space-y-1.5">
                <Label className="text-xs text-[#3c3e3f]">Street</Label>
                <Input
                  placeholder="Street address"
                  value={shipToStreet}
                  onChange={(e) => setShipToStreet(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#3c3e3f]">City</Label>
                  <Input
                    placeholder="City"
                    value={shipToCity}
                    onChange={(e) => setShipToCity(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#3c3e3f]">State</Label>
                  <Input
                    placeholder="State"
                    value={shipToState}
                    onChange={(e) => setShipToState(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#3c3e3f]">Zip</Label>
                  <Input
                    placeholder="Zip"
                    value={shipToZip}
                    onChange={(e) => setShipToZip(e.target.value)}
                  />
                </div>
              </div>
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
                placeholder="Additional notes or instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
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
            form="order-form"
            disabled={submitting}
            className="flex-1 bg-[#0a7b6b] font-bold uppercase tracking-wider text-white hover:bg-[#087a69]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {submitting ? 'Creating...' : 'Create Order'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
