import { Building2, User, MapPin } from 'lucide-react';

export function PartyCard({ role, name, address, type = 'organization' }) {
  const Icon = type === 'individual' ? User : Building2;
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#05dd4d]" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#3c3e3f]" style={{ fontFamily: 'var(--font-heading)' }}>{role}</span>
      </div>
      <p className="text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{name}</p>
      {address && (
        <div className="mt-1 flex items-start gap-1">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#3c3e3f]" />
          <p className="text-xs text-[#3c3e3f]">{address}</p>
        </div>
      )}
    </div>
  );
}
