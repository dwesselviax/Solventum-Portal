'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/data/data-table';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Warehouse, ArrowRightLeft, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS_OPTIONS = [
  { value: 'Available', label: 'Available' },
  { value: 'Reserved', label: 'Reserved' },
  { value: 'In Use', label: 'In Use' },
];

const COLUMNS = [
  { key: 'id', label: 'Item ID', sortable: true },
  { key: 'productName', label: 'Product', sortable: true },
  { key: 'serialNumber', label: 'Serial #', sortable: true },
  { key: 'batchNumber', label: 'Batch/Lot', sortable: true },
  { key: 'location', label: 'Location', sortable: true, render: (val) => val ? `${val.facilityName}, ${val.city}, ${val.state}` : '\u2014' },
  { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
];

const PRODUCT_OPTIONS = [
  'Triathlon Total Knee System',
  'Accolade II Femoral Hip Stem',
  'Trident II Acetabular System',
  'Surpass Evolve Flow Diverter',
  'Neuro Matrix Programmable Shunt System',
  'Tornier Perform Reversed Shoulder System',
  'VariAx 2 Distal Radius Locking Plate System',
];

const FACILITY_OPTIONS = [
  'Northwest Medical Center, Seattle, WA',
  'Mercy West Hospital, Cincinnati, OH',
  'Mercy Anderson Hospital, Anderson, OH',
  'Cascade Regional Medical Center, Bend, OR',
];

export default function ConsignmentPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    product: '',
    quantity: '',
    facility: '',
    notes: '',
  });
  const [transferForm, setTransferForm] = useState({
    item: '',
    destinationFacility: '',
    notes: '',
  });

  useEffect(() => {
    import('@/lib/mock-data/consignment').then((mod) => {
      let result = [...(mod.consignment || [])];
      if (statusFilter) result = result.filter((c) => c.status === statusFilter);
      if (search) {
        const s = search.toLowerCase();
        result = result.filter((c) => c.productName?.toLowerCase().includes(s) || c.serialNumber?.toLowerCase().includes(s) || c.id?.toLowerCase().includes(s));
      }
      setData(result);
      setLoading(false);
    });
  }, [search, statusFilter]);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    toast.success('Consignment request submitted successfully');
    setRequestDialogOpen(false);
    setRequestForm({ product: '', quantity: '', facility: '', notes: '' });
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    toast.success('Consignment transfer initiated successfully');
    setTransferDialogOpen(false);
    setTransferForm({ item: '', destinationFacility: '', notes: '' });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Consignment Inventory</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">View and manage consignment items at your locations</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setTransferDialogOpen(true)}
            className="flex items-center gap-2 rounded-md border border-[#0a7b6b] px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-[#0a7b6b] transition-colors hover:bg-[#F0F5F5]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <ArrowRightLeft className="h-4 w-4" /> Transfer
          </button>
          <button
            onClick={() => setRequestDialogOpen(true)}
            className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Package className="h-4 w-4" /> Request New
          </button>
        </div>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Statuses" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
      </FiltersBar>

      {loading ? <TableSkeleton rows={8} columns={6} /> : <DataTable columns={COLUMNS} data={data} />}

      {/* Request New Consignment Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Request New Consignment</DialogTitle>
            <DialogDescription>Request new consignment inventory for your facility.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="req-product" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Product</Label>
              <Select value={requestForm.product} onValueChange={(val) => setRequestForm({ ...requestForm, product: val })} required>
                <SelectTrigger id="req-product" className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-quantity" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Quantity</Label>
              <Input
                id="req-quantity"
                type="number"
                min="1"
                placeholder="1"
                value={requestForm.quantity}
                onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-facility" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Location / Facility</Label>
              <Select value={requestForm.facility} onValueChange={(val) => setRequestForm({ ...requestForm, facility: val })} required>
                <SelectTrigger id="req-facility" className="w-full">
                  <SelectValue placeholder="Select a facility" />
                </SelectTrigger>
                <SelectContent>
                  {FACILITY_OPTIONS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-notes" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Notes</Label>
              <Textarea
                id="req-notes"
                placeholder="Additional notes or instructions..."
                value={requestForm.notes}
                onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setRequestDialogOpen(false)}
                className="rounded-md border border-[#e7e7e7] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Submit Request
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transfer Consignment Dialog */}
      <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Transfer Consignment Item</DialogTitle>
            <DialogDescription>Transfer a consignment item to another facility.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTransferSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="xfer-item" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Select Item</Label>
              <Select value={transferForm.item} onValueChange={(val) => setTransferForm({ ...transferForm, item: val })} required>
                <SelectTrigger id="xfer-item" className="w-full">
                  <SelectValue placeholder="Select an item to transfer" />
                </SelectTrigger>
                <SelectContent>
                  {data.filter((c) => c.status === 'Available').map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.id} - {c.productName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="xfer-destination" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Destination Facility</Label>
              <Select value={transferForm.destinationFacility} onValueChange={(val) => setTransferForm({ ...transferForm, destinationFacility: val })} required>
                <SelectTrigger id="xfer-destination" className="w-full">
                  <SelectValue placeholder="Select destination facility" />
                </SelectTrigger>
                <SelectContent>
                  {FACILITY_OPTIONS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="xfer-notes" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Notes</Label>
              <Textarea
                id="xfer-notes"
                placeholder="Transfer notes..."
                value={transferForm.notes}
                onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setTransferDialogOpen(false)}
                className="rounded-md border border-[#e7e7e7] px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#0a7b6b] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Initiate Transfer
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
