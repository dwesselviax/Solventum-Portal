'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/data/data-table';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS_OPTIONS = [
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Approved', label: 'Approved' },
  { value: 'In Transit', label: 'In Transit' },
  { value: 'Processed', label: 'Processed' },
];

const COLUMNS = [
  { key: 'id', label: 'RMA ID', sortable: true },
  { key: 'productName', label: 'Product', sortable: true },
  { key: 'reason', label: 'Reason', sortable: true },
  { key: 'orderId', label: 'Order Ref', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
  { key: 'submittedDate', label: 'Submitted', sortable: true, render: (val) => formatDate(val) },
];

const RETURN_TYPES = ['Defective', 'Warranty', 'Wrong Item', 'Damaged'];

const PRODUCT_OPTIONS = [
  'System 8 Large Bone Power Tool Set',
  'System 8 Small Bone Power Tool Set',
  'Triathlon Total Knee System',
  'Accolade II Femoral Hip Stem',
  'Secure II Hospital Bed',
  'T5 Prime Powered Stretcher',
  'SAGE Prevalon Turn and Position System',
  'System 8 SmartLife Battery Pack',
];

export default function ReturnsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    product: '',
    quantity: '',
    reason: '',
    returnType: '',
  });

  useEffect(() => {
    import('@/lib/mock-data/returns').then((mod) => {
      let result = [...(mod.returns || [])];
      if (statusFilter) result = result.filter((r) => r.status === statusFilter);
      if (search) {
        const s = search.toLowerCase();
        result = result.filter((r) => r.id?.toLowerCase().includes(s) || r.productName?.toLowerCase().includes(s));
      }
      setData(result);
      setLoading(false);
    });
  }, [search, statusFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('RMA request submitted successfully');
    setDialogOpen(false);
    setFormData({ orderId: '', product: '', quantity: '', reason: '', returnType: '' });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Returns & RMA</h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">Submit and track return merchandise authorizations</p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Plus className="h-4 w-4" /> New RMA Request
        </button>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Statuses" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} />
      </FiltersBar>

      {loading ? <TableSkeleton rows={5} columns={6} /> : <DataTable columns={COLUMNS} data={data} />}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>New RMA Request</DialogTitle>
            <DialogDescription>Submit a return merchandise authorization request.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rma-order-id" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Order ID</Label>
              <Input
                id="rma-order-id"
                placeholder="e.g. ORD-2025-0001"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rma-product" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Product</Label>
              <Select value={formData.product} onValueChange={(val) => setFormData({ ...formData, product: val })} required>
                <SelectTrigger id="rma-product" className="w-full">
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
              <Label htmlFor="rma-quantity" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Quantity</Label>
              <Input
                id="rma-quantity"
                type="number"
                min="1"
                placeholder="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rma-return-type" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Return Type</Label>
              <Select value={formData.returnType} onValueChange={(val) => setFormData({ ...formData, returnType: val })} required>
                <SelectTrigger id="rma-return-type" className="w-full">
                  <SelectValue placeholder="Select return type" />
                </SelectTrigger>
                <SelectContent>
                  {RETURN_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rma-reason" className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Reason</Label>
              <Textarea
                id="rma-reason"
                placeholder="Describe the reason for return..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
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
    </div>
  );
}
