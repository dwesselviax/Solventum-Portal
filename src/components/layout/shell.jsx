'use client';

import { Topbar } from './topbar';
import { Sidebar } from './sidebar';
import { InternalBanner } from './internal-banner';

export function Shell({ children }) {
  return (
    <div className="flex h-screen flex-col">
      <Topbar />
      <InternalBanner />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-[#F5F5F5] p-6">
          <div className="mx-auto max-w-[1280px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
