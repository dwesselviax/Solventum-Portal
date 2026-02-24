'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  BookOpen,
  Download,
  Eye,
  Palette,
  Search,
  FileText,
  Image,
  Film,
} from 'lucide-react';

const TYPE_OPTIONS = [
  { value: 'Handout', label: 'Handout' },
  { value: 'Flyer', label: 'Flyer' },
  { value: 'Poster', label: 'Poster' },
  { value: 'Social Media Asset', label: 'Social Media Asset' },
  { value: 'Toolkit', label: 'Toolkit' },
  { value: 'Co-Branded', label: 'Co-Branded' },
];

const CHANNEL_OPTIONS = [
  { value: 'In-Office', label: 'In-Office' },
  { value: 'Digital', label: 'Digital' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Print', label: 'Print' },
  { value: 'Multi-Channel', label: 'Multi-Channel' },
];

const FORMAT_ICONS = {
  PDF: FileText,
  PNG: Image,
  ZIP: FileText,
  MP4: Film,
};

const TYPE_BADGE_CLASSES = 'bg-[#bffde3] text-[#0a7b6b]';
const CHANNEL_BADGE_CLASSES = 'bg-[#dbeafe] text-[#1d4ed8]';

export default function MarketingMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState([]);
  const [channelFilter, setChannelFilter] = useState([]);

  // Co-branded request dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestMaterial, setRequestMaterial] = useState('');
  const [practiceName, setPracticeName] = useState('');
  const [requestNotes, setRequestNotes] = useState('');

  useEffect(() => {
    import('@/lib/mock-data/marketing-materials').then((mod) => {
      setMaterials(mod.marketingMaterials);
      setLoading(false);
    });
  }, []);

  const filteredMaterials = useMemo(() => {
    let result = materials;
    if (typeFilter.length > 0) {
      result = result.filter((m) => typeFilter.includes(m.type));
    }
    if (channelFilter.length > 0) {
      result = result.filter((m) => channelFilter.includes(m.channel));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.tags.some((t) => t.includes(q))
      );
    }
    return result;
  }, [materials, typeFilter, channelFilter, search]);

  function handleCoRequest(e) {
    e.preventDefault();
    if (!requestMaterial) {
      toast.error('Please select a material.');
      return;
    }
    if (!practiceName.trim()) {
      toast.error('Please enter your practice name.');
      return;
    }
    toast.success('Co-branded request submitted! We will contact you within 2 business days.');
    setDialogOpen(false);
    setRequestMaterial('');
    setPracticeName('');
    setRequestNotes('');
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1
            className="text-2xl font-bold text-[#01332b]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Marketing Materials
          </h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">
            Browse and download marketing resources for your practice
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-[#01332b]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Marketing Materials
          </h1>
          <p className="mt-1 text-sm text-[#3c3e3f]">
            Browse and download marketing resources for your practice
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
          style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}
        >
          <Palette className="h-4 w-4" /> Request Co-Branded
        </button>
      </div>

      {/* Filters */}
      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect
          label="All Types"
          value={typeFilter}
          onChange={setTypeFilter}
          options={TYPE_OPTIONS}
        />
        <FilterSelect
          label="All Channels"
          value={channelFilter}
          onChange={setChannelFilter}
          options={CHANNEL_OPTIONS}
        />
      </FiltersBar>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="rounded-lg border border-[#e7e7e7] bg-white px-6 py-16 text-center shadow-sm">
          <Search className="mx-auto mb-3 h-10 w-10 text-[#e7e7e7]" />
          <p className="text-sm text-[#3c3e3f]">
            No marketing materials found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => {
            const FormatIcon = FORMAT_ICONS[material.format] || FileText;
            return (
              <div
                key={material.id}
                className="flex flex-col rounded-lg border border-[#e7e7e7] bg-white p-4 shadow-sm"
              >
                {/* Thumbnail placeholder */}
                <div className="mb-3 flex h-40 items-center justify-center rounded-md bg-[#F5F5F5]">
                  <BookOpen className="h-10 w-10 text-[#e7e7e7]" />
                </div>

                {/* Title */}
                <h3
                  className="mb-2 text-sm font-bold text-[#01332b]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {material.name}
                </h3>

                {/* Badges */}
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TYPE_BADGE_CLASSES}`}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {material.type}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${CHANNEL_BADGE_CLASSES}`}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {material.channel}
                  </span>
                  {material.coBranded && (
                    <span
                      className="inline-flex items-center rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#92400e]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Co-Branded
                    </span>
                  )}
                </div>

                {/* Description */}
                <p
                  className="mb-3 line-clamp-2 flex-1 text-xs text-[#3c3e3f]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {material.description}
                </p>

                {/* Meta info */}
                <div className="mb-3 flex items-center gap-3 text-[11px] text-[#3c3e3f]">
                  <span className="flex items-center gap-1">
                    <FormatIcon className="h-3 w-3" />
                    {material.format} &middot; {material.fileSize}
                  </span>
                  <span>Updated {material.lastUpdated}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#0a7b6b] px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                  <button
                    className="flex items-center justify-center gap-1.5 rounded-md border border-[#e7e7e7] bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#F5F5F5]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Co-Branded Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle
              className="text-lg font-bold text-[#01332b]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Request Co-Branded Material
            </DialogTitle>
            <DialogDescription className="text-sm text-[#3c3e3f]">
              Submit a request to receive a co-branded version of any marketing material with your
              practice logo and information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCoRequest} className="space-y-4">
            {/* Material select */}
            <div>
              <label
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Select Material
              </label>
              <select
                value={requestMaterial}
                onChange={(e) => setRequestMaterial(e.target.value)}
                className="h-10 w-full rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <option value="">Choose a material...</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Practice name */}
            <div>
              <label
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Practice Name
              </label>
              <input
                type="text"
                value={practiceName}
                onChange={(e) => setPracticeName(e.target.value)}
                placeholder="e.g., Bright Smiles Orthodontics"
                className="h-10 w-full rounded-md border border-[#e7e7e7] bg-white px-3 text-sm text-[#01332b] placeholder:text-[#999] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {/* Logo upload */}
            <div>
              <label
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Practice Logo
              </label>
              <input
                type="file"
                accept="image/*,.svg"
                className="w-full rounded-md border border-[#e7e7e7] bg-white px-3 py-2 text-sm text-[#01332b] file:mr-3 file:rounded-md file:border-0 file:bg-[#bffde3] file:px-3 file:py-1 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-[#0a7b6b]"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <p className="mt-1 text-[11px] text-[#3c3e3f]">
                SVG, PNG, or JPG. Minimum 300px wide recommended.
              </p>
            </div>

            {/* Notes */}
            <div>
              <label
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#3c3e3f]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Notes
              </label>
              <textarea
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="Any special instructions, color preferences, or additional contact information..."
                rows={3}
                className="w-full rounded-md border border-[#e7e7e7] bg-white px-3 py-2 text-sm text-[#01332b] placeholder:text-[#999] focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                className="rounded-md border border-[#e7e7e7] bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#F5F5F5]"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-[#0a7b6b] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.5px' }}
              >
                <Palette className="h-4 w-4" /> Submit Request
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
