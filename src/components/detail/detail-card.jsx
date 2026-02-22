export function DetailCard({ title, children, className }) {
  return (
    <div className={'rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm ' + (className || '')}>
      {title && (
        <h3 className="mb-4 text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
      )}
      {children}
    </div>
  );
}
