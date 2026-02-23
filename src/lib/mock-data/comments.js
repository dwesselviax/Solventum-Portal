// Seed comments for quotes — public back-and-forth + internal-only + attachments

export const seedComments = [
  // QT-2025-0001 — Converted quote (Chen Ortho annual agreement)
  {
    id: 'CMT-001',
    quoteId: 'QT-2025-0001',
    author: { id: 'USR-003', name: 'Emily Rodriguez', role: 'sales_rep', initials: 'ER' },
    text: 'Hi Dr. Chen, I\'ve put together the annual bracket supply agreement with the 10% volume discount we discussed. Please review the line items and let me know if you\'d like any adjustments.',
    visibility: 'public',
    attachments: [],
    createdAt: '2024-12-01T10:15:00Z',
  },
  {
    id: 'CMT-002',
    quoteId: 'QT-2025-0001',
    author: { id: 'user-001', name: 'Dr. Sarah Chen', role: 'orthodontist', initials: 'SC' },
    text: 'Thanks Emily! The pricing looks great. Could we add the lower bracket kits at the same volume? We go through roughly equal amounts of upper and lower.',
    visibility: 'public',
    attachments: [],
    createdAt: '2024-12-03T09:45:00Z',
  },
  {
    id: 'CMT-003',
    quoteId: 'QT-2025-0001',
    author: { id: 'USR-003', name: 'Emily Rodriguez', role: 'sales_rep', initials: 'ER' },
    text: 'Absolutely — I\'ve updated the quote to include 200 lower kits at the same 10% discount. Total is now $71,882.17 including Transbond adhesive.',
    visibility: 'public',
    attachments: [],
    createdAt: '2024-12-03T14:30:00Z',
  },
  {
    id: 'CMT-004',
    quoteId: 'QT-2025-0001',
    author: { id: 'USR-003', name: 'Emily Rodriguez', role: 'sales_rep', initials: 'ER' },
    text: 'Note: Chen Ortho is a Gold tier account. Discount approved by regional manager per annual commitment level.',
    visibility: 'internal',
    attachments: [],
    createdAt: '2024-12-03T14:35:00Z',
  },
  {
    id: 'CMT-005',
    quoteId: 'QT-2025-0001',
    author: { id: 'user-001', name: 'Dr. Sarah Chen', role: 'orthodontist', initials: 'SC' },
    text: 'Perfect, this looks good to go. I\'ll approve it now. Please send the PO confirmation once the order is created.',
    visibility: 'public',
    attachments: [],
    createdAt: '2024-12-10T10:50:00Z',
  },

  // QT-2025-0003 — Submitted quote (Smile DSO enterprise restock)
  {
    id: 'CMT-006',
    quoteId: 'QT-2025-0003',
    author: { id: 'USR-003', name: 'Emily Rodriguez', role: 'sales_rep', initials: 'ER' },
    text: 'James, here\'s the Q1 restock proposal for all 12 locations. Platinum tier pricing with 15% discount applied across all brackets and bonding materials.',
    visibility: 'public',
    attachments: [
      { id: 'ATT-001', name: 'Q1-2025-Pricing-Breakdown.pdf', size: '245 KB', type: 'application/pdf' },
    ],
    createdAt: '2025-01-12T09:15:00Z',
  },
  {
    id: 'CMT-007',
    quoteId: 'QT-2025-0003',
    author: { id: 'USR-003', name: 'Emily Rodriguez', role: 'sales_rep', initials: 'ER' },
    text: 'Smile DSO is approaching Platinum tier renewal. Push for approval before Q1 end to lock in pricing for another year.',
    visibility: 'internal',
    attachments: [],
    createdAt: '2025-01-12T09:20:00Z',
  },
  {
    id: 'CMT-008',
    quoteId: 'QT-2025-0003',
    author: { id: 'user-002', name: 'Mark Reynolds', role: 'dso', initials: 'MR' },
    text: 'Emily, thanks for putting this together. Our procurement team is reviewing the archwire quantities — we may need to increase the Nitinol order for a couple of locations. I\'ll have an update by Friday.',
    visibility: 'public',
    attachments: [],
    createdAt: '2025-01-14T10:30:00Z',
  },
  {
    id: 'CMT-009',
    quoteId: 'QT-2025-0003',
    author: { id: 'USR-003', name: 'Emily Rodriguez', role: 'sales_rep', initials: 'ER' },
    text: 'Sounds good, Mark. Happy to adjust quantities once your team finalizes. The 15% discount will apply to any additional items as well.',
    visibility: 'public',
    attachments: [],
    createdAt: '2025-01-14T11:00:00Z',
  },

  // QT-2025-0007 — Submitted quote (Chen Ortho consignment)
  {
    id: 'CMT-010',
    quoteId: 'QT-2025-0007',
    author: { id: 'USR-003', name: 'Emily Rodriguez', role: 'sales_rep', initials: 'ER' },
    text: 'Dr. Chen, as we discussed, here\'s the consignment stock proposal for Clarity Advanced brackets. You\'ll only be billed on usage with monthly reconciliation.',
    visibility: 'public',
    attachments: [
      { id: 'ATT-002', name: 'Consignment-Agreement-Terms.pdf', size: '128 KB', type: 'application/pdf' },
    ],
    createdAt: '2025-01-10T13:10:00Z',
  },
  {
    id: 'CMT-011',
    quoteId: 'QT-2025-0007',
    author: { id: 'user-001', name: 'Dr. Sarah Chen', role: 'orthodontist', initials: 'SC' },
    text: 'This looks like a great fit for us. Quick question — what\'s the minimum shelf life on the consignment brackets? We want to make sure we\'re not holding expired inventory.',
    visibility: 'public',
    attachments: [],
    createdAt: '2025-01-11T08:30:00Z',
  },
  {
    id: 'CMT-012',
    quoteId: 'QT-2025-0007',
    author: { id: 'USR-003', name: 'Emily Rodriguez', role: 'sales_rep', initials: 'ER' },
    text: 'Great question! All consignment brackets will have a minimum 24-month shelf life at delivery. We handle rotation automatically during the monthly audit.',
    visibility: 'public',
    attachments: [],
    createdAt: '2025-01-11T10:15:00Z',
  },
  {
    id: 'CMT-013',
    quoteId: 'QT-2025-0007',
    author: { id: 'USR-003', name: 'Emily Rodriguez', role: 'sales_rep', initials: 'ER' },
    text: 'Consignment approved by supply chain team. Initial stock delivery can be scheduled for next week once customer signs.',
    visibility: 'internal',
    attachments: [],
    createdAt: '2025-01-11T10:20:00Z',
  },
];

export function getCommentsByQuoteId(quoteId) {
  return seedComments.filter((c) => c.quoteId === quoteId);
}
