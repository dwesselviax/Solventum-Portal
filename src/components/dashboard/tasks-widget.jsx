'use client';

import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const TASKS = [
  { id: 1, text: 'Review pending quote QT-2025-006', priority: 'high', done: false },
  { id: 2, text: 'Approve consignment transfer request', priority: 'medium', done: false },
  { id: 3, text: 'Follow up on RMA-2025-003', priority: 'low', done: false },
  { id: 4, text: 'Schedule maintenance for AED units', priority: 'medium', done: true },
  { id: 5, text: 'Complete Q1 training certification', priority: 'high', done: false },
];

export function TasksWidget() {
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Action Items</h3>
      <div className="space-y-3">
        {TASKS.map((task) => (
          <div key={task.id} className="flex items-start gap-3">
            {task.done ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2E7D32]" />
            ) : task.priority === 'high' ? (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#C62828]" />
            ) : (
              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[#e7e7e7]" />
            )}
            <span className={task.done ? 'text-sm text-[#e7e7e7] line-through' : 'text-sm text-[#01332b]'}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
