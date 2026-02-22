import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F5F5]">
      <h1 className="text-6xl font-bold text-[#05dd4d]" style={{ fontFamily: 'var(--font-heading)' }}>404</h1>
      <p className="mt-4 text-lg text-[#3c3e3f]">Page not found</p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-md bg-[#0a7b6b] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#087a69]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
