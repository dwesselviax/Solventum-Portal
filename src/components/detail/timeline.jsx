import { formatDateTime } from '@/lib/utils/format';

export function Timeline({ events = [] }) {
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
      <h3 className="mb-4 text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Timeline</h3>
      <div className="relative space-y-4 pl-6">
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#e7e7e7]" />
        {events.map((event, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-[#05dd4d] bg-white" />
            <p className="text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{event.title}</p>
            <p className="text-xs text-[#3c3e3f]">{formatDateTime(event.date)}</p>
            {event.description && <p className="mt-1 text-sm text-[#3c3e3f]">{event.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
