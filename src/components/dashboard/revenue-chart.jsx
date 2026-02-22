'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_REVENUE = [
  { month: 'Sep', revenue: 245000 },
  { month: 'Oct', revenue: 312000 },
  { month: 'Nov', revenue: 287000 },
  { month: 'Dec', revenue: 398000 },
  { month: 'Jan', revenue: 352000 },
  { month: 'Feb', revenue: 421000 },
];

export function RevenueChart() {
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-[#01332b]" style={{ fontFamily: 'var(--font-heading)' }}>Revenue (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={MOCK_REVENUE}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#3c3e3f' }} />
          <YAxis tick={{ fontSize: 12, fill: '#3c3e3f' }} tickFormatter={(v) => '$' + (v / 1000) + 'k'} />
          <Tooltip
            formatter={(value) => ['$' + value.toLocaleString(), 'Revenue']}
            contentStyle={{ borderRadius: 8, border: '1px solid #e7e7e7', fontFamily: 'var(--font-heading)' }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#05dd4d" strokeWidth={3} dot={{ fill: '#01332b', r: 4 }} activeDot={{ r: 6, fill: '#05dd4d' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
