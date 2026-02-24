'use client';

import { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/data/data-table';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils/format';
import { TableSkeleton } from '@/components/shared/loading-skeleton';
import { Plus, Camera, X, ImagePlus } from 'lucide-react';
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
  { key: 'photos', label: 'Photos', sortable: false, render: (val) => val?.length > 0 ? <Camera className="h-4 w-4 text-[#0a7b6b]" /> : null },
];

const RETURN_TYPES = ['Defective', 'Warranty', 'Wrong Item', 'Damaged', 'Defective / Broken'];

const PRODUCT_OPTIONS = [
  'Clarity Advanced Ceramic Brackets — Upper 5x5 Kit',
  'Clarity Advanced Ceramic Brackets — Lower 5x5 Kit',
  'Clarity Ultra Self-Ligating Brackets — Upper Kit',
  'Transbond XT Light Cure Adhesive Syringe Kit',
  'Nitinol Super Elastic Archwires — Upper Assortment Pack',
  'Beta Titanium (TMA) Archwires — Assorted Pack',
  'Ortholux Luminous LED Curing Light',
  'Victory Series Metal Brackets — Upper 5x5 Kit',
];

export default function ReturnsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    product: '',
    quantity: '',
    reason: '',
    returnType: '',
    photos: [],
  });

  useEffect(() => {
    import('@/lib/mock-data/returns').then((mod) => {
      let result = [...(mod.returns || [])];
      if (statusFilter.length > 0) result = result.filter((r) => statusFilter.includes(r.status));
      if (search) {
        const s = search.toLowerCase();
        result = result.filter((r) => r.id?.toLowerCase().includes(s) || r.productName?.toLowerCase().includes(s));
      }
      setData(result);
      setLoading(false);
    });
  }, [search, statusFilter]);

  // Clean up object URLs when photos change or component unmounts
  useEffect(() => {
    return () => {
      formData.photos.forEach((p) => URL.revokeObjectURL(p.preview));
    };
  }, [formData.photos]);

  const handlePhotoSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (formData.photos.length + files.length > 5) {
      toast.error('Maximum 5 photos allowed');
      e.target.value = '';
      return;
    }
    const newPhotos = files.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      type: file.type,
    }));
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
    e.target.value = '';
  }, [formData.photos.length]);

  const removePhoto = useCallback((index) => {
    setFormData((prev) => {
      const removed = prev.photos[index];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return { ...prev, photos: prev.photos.filter((_, i) => i !== index) };
    });
  }, []);

  const resetForm = () => {
    formData.photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setFormData({ orderId: '', product: '', quantity: '', reason: '', returnType: '', photos: [] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('RMA request submitted successfully');
    setDialogOpen(false);
    resetForm();
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
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>Photos (Optional)</Label>
              <label
                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-[#e7e7e7] px-4 py-3 text-sm text-[#3c3e3f] transition-colors hover:border-[#0a7b6b] hover:bg-[#F5F5F5]"
              >
                <ImagePlus className="h-4 w-4 text-[#0a7b6b]" />
                <span>Add photos{formData.photos.length > 0 ? ` (${formData.photos.length}/5)` : ''}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
              </label>
              {formData.photos.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="group relative">
                      <img
                        src={photo.preview}
                        alt={photo.name}
                        className="h-16 w-16 rounded-md border border-[#e7e7e7] object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#01332b] text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
