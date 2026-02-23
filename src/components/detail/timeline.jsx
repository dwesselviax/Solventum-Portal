'use client';

import { useState, useMemo } from 'react';
import { formatDateTime } from '@/lib/utils/format';
import { Paperclip, Send, Lock, Globe } from 'lucide-react';

export function Timeline({ events = [], comments = [], currentUser, onAddComment }) {
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState('public');

  const isInternalRole = ['sales_rep', 'ar', 'csr'].includes(currentUser?.role);

  // Merge events and comments chronologically
  const timelineItems = useMemo(() => {
    const statusItems = events.map((e) => ({ type: 'event', date: e.date, ...e }));
    const commentItems = comments
      .filter((c) => {
        if (c.visibility === 'internal' && !isInternalRole) return false;
        return true;
      })
      .map((c) => ({ type: 'comment', date: c.createdAt, ...c }));

    return [...statusItems, ...commentItems].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [events, comments, isInternalRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !onAddComment) return;
    onAddComment({ text: text.trim(), visibility });
    setText('');
  };

  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
      <h3 className="mb-4 text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
        Timeline & Comments
      </h3>

      <div className="relative space-y-4 pl-6">
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-[#e7e7e7]" />

        {timelineItems.map((item, i) => {
          if (item.type === 'event') {
            return (
              <div key={`evt-${i}`} className="relative">
                <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-[#05dd4d] bg-white" />
                <p className="text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {item.title}
                </p>
                <p className="text-xs text-[#3c3e3f]">{formatDateTime(item.date)}</p>
                {item.description && <p className="mt-1 text-sm text-[#3c3e3f]">{item.description}</p>}
              </div>
            );
          }

          const isInternal = item.visibility === 'internal';
          return (
            <div key={item.id} className="relative">
              <div className={`absolute -left-6 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                isInternal ? 'bg-[#FFF8E1] text-[#F57F17]' : 'bg-[#E8F5E9] text-[#2E7D32]'
              }`} style={{ fontFamily: 'var(--font-heading)' }}>
                {item.author?.initials}
              </div>
              <div className={`ml-2 rounded-lg border p-3 ${
                isInternal ? 'border-[#FFD54F] bg-[#FFF8E1]' : 'border-[#e7e7e7] bg-[#FAFAFA]'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>
                    {item.author?.name}
                  </span>
                  <span className="text-xs text-[#3c3e3f]">
                    {item.author?.role === 'sales_rep' ? 'Sales Rep' :
                     item.author?.role === 'orthodontist' ? 'Orthodontist' :
                     item.author?.role === 'dso' ? 'DSO Admin' :
                     item.author?.role || ''}
                  </span>
                  {isInternal && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F57F17]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F57F17]" style={{ fontFamily: 'var(--font-heading)' }}>
                      <Lock className="h-2.5 w-2.5" /> Internal
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[#3c3e3f]">{item.text}</p>
                {item.attachments?.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {item.attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-1.5 text-xs text-[#0a7b6b]">
                        <Paperclip className="h-3 w-3" />
                        <span className="font-medium">{att.name}</span>
                        <span className="text-[#3c3e3f]">({att.size})</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-[10px] text-[#3c3e3f]">{formatDateTime(item.date)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {onAddComment && currentUser && (
        <form onSubmit={handleSubmit} className="mt-4 border-t border-[#e7e7e7] pt-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="w-full resize-none rounded-md border border-[#e7e7e7] px-3 py-2 text-sm text-[#01332b] placeholder:text-[#3c3e3f]/50 focus:border-[#0a7b6b] focus:outline-none focus:ring-1 focus:ring-[#0a7b6b]"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isInternalRole && (
                <button
                  type="button"
                  onClick={() => setVisibility(visibility === 'public' ? 'internal' : 'public')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors ${
                    visibility === 'internal'
                      ? 'bg-[#FFF8E1] text-[#F57F17] border border-[#FFD54F]'
                      : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]'
                  }`}
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {visibility === 'internal' ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                  {visibility === 'internal' ? 'Internal' : 'Public'}
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex items-center gap-2 rounded-md bg-[#05dd4d] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#01332b] transition-colors hover:bg-[#04c443] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
