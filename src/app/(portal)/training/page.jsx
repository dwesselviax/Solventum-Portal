'use client';

import { useState, useEffect } from 'react';
import { FiltersBar, FilterSelect } from '@/components/data/filters-bar';
import { CardSkeleton } from '@/components/shared/loading-skeleton';
import { GraduationCap, Play, BookOpen, Award, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TYPE_OPTIONS = [
  { value: 'Video', label: 'Video' },
  { value: 'E-Learning', label: 'E-Learning' },
  { value: 'Certification', label: 'Certification' },
  { value: 'Webinar', label: 'Webinar' },
];

export default function TrainingPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('@/lib/mock-data/training').then((mod) => {
      let result = [...(mod.training || [])];
      if (typeFilter) result = result.filter((t) => t.type === typeFilter);
      if (search) {
        const s = search.toLowerCase();
        result = result.filter((t) => t.title?.toLowerCase().includes(s) || t.description?.toLowerCase().includes(s));
      }
      setResources(result);
      setLoading(false);
    });
  }, [search, typeFilter]);

  const iconMap = { Video: Play, 'E-Learning': BookOpen, Certification: Award, Webinar: GraduationCap };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Learning & Training</h1>
        <p className="mt-1 text-sm text-[#3c3e3f]">Access training materials, certifications, and educational content</p>
      </div>

      <FiltersBar search={search} onSearchChange={setSearch}>
        <FilterSelect label="All Types" value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTIONS} />
      </FiltersBar>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((item) => {
            const Icon = iconMap[item.type] || GraduationCap;
            return (
              <div key={item.id} className="rounded-lg border border-[#e7e7e7] bg-white shadow-sm transition-all hover:shadow-md overflow-hidden">
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-[#05dd4d]/10 to-[#0a7b6b]/10">
                  <Icon className="h-12 w-12 text-[#05dd4d]" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{item.type}</span>
                    {item.duration && <span className="flex items-center gap-1 text-[10px] text-[#3c3e3f]"><Clock className="h-3 w-3" />{item.duration}</span>}
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-[#3c3e3f]">{item.description}</p>
                  {item.progress != null && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-[#3c3e3f] mb-1"><span>Progress</span><span>{item.progress}%</span></div>
                      <Progress value={item.progress} className="h-2" />
                    </div>
                  )}
                  <button className="mt-3 w-full rounded-md bg-[#0a7b6b] px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.progress > 0 ? 'Continue' : 'Start'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && resources.length === 0 && <div className="py-12 text-center text-[#3c3e3f]">No training resources found.</div>}
    </div>
  );
}
