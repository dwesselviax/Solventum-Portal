'use client';

import { useState, useEffect } from 'react';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { FileText, Download, ExternalLink } from 'lucide-react';

const TYPE_OPTIONS = [
  { value: 'IFU', label: 'Instructions for Use' },
  { value: 'SDS', label: 'Safety Data Sheet' },
  { value: 'Technique Guide', label: 'Technique Guide' },
  { value: 'Brochure', label: 'Brochure' },
  { value: 'White Paper', label: 'White Paper' },
  { value: 'User Manual', label: 'User Manual' },
];

export default function DocumentationPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/lib/mock-data/documentation').then((mod) => {
      let result = [...(mod.documentation || [])];
      if (typeFilter) result = result.filter((d) => d.type === typeFilter);
      if (search) {
        const s = search.toLowerCase();
        result = result.filter((d) => d.title?.toLowerCase().includes(s) || d.productNames?.join(', ').toLowerCase().includes(s));
      }
      setDocs(result);
      setLoading(false);
    });
  }, [search, typeFilter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Product Documentation</h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">Browse IFUs, safety data sheets, technique guides, marketing assets, and clinical papers</p>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Types" value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTIONS} />
      </FiltersBar>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <div key={doc.id} className="rounded-lg border border-[#e7e7e7] bg-white p-5 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-[#bffde3] p-2"><FileText className="h-5 w-5 text-[#0a7b6b]" /></div>
                <div className="flex-1">
                  <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{doc.type}</span>
                  <h3 className="mt-1 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{doc.title}</h3>
                  <p className="mt-0.5 text-xs text-[#3c3e3f]">{doc.productNames?.join(', ')}</p>
                  <p className="mt-1 text-xs text-[#3c3e3f]/50">{doc.fileSize} • {doc.fileUrl?.split('.').pop()?.toUpperCase()}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex items-center gap-1 rounded-md border border-[#e7e7e7] px-3 py-1.5 text-xs font-bold uppercase text-[#3c3e3f] transition-colors hover:bg-[#F5F5F5]" style={{ fontFamily: 'var(--font-heading)' }}>
                  <Download className="h-3 w-3" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && docs.length === 0 && <div className="py-12 text-center text-[#3c3e3f]">No documents found.</div>}
    </div>
  );
}
