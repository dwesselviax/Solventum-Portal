// Timeline events for each quote — status changes, milestones, approvals

export const quoteTimelineEvents = {
  'QT-2025-0001': [
    { title: 'Quote Created', date: '2024-12-01T10:00:00Z', description: 'Annual bracket supply agreement drafted by Emily Rodriguez.' },
    { title: 'Submitted to Customer', date: '2024-12-02T09:00:00Z', description: 'Sent to Dr. Sarah Chen for review.' },
    { title: 'Customer Review', date: '2024-12-05T14:30:00Z', description: 'Dr. Chen reviewed pricing and line items.' },
    { title: 'Quote Approved', date: '2024-12-10T11:00:00Z', description: 'Approved by Dr. Sarah Chen.' },
    { title: 'Converted to Order', date: '2025-01-02T09:15:00Z', description: 'Converted to order ORD-2025-0001.' },
  ],
  'QT-2025-0002': [
    { title: 'Quote Created', date: '2025-01-03T14:00:00Z', description: 'Clarity Aligner expansion proposal created.' },
    { title: 'Submitted to Customer', date: '2025-01-04T10:00:00Z', description: 'Sent to Dr. Michael Thompson.' },
    { title: 'Pricing Revised', date: '2025-01-07T16:00:00Z', description: 'Volume discount adjusted to 10% at 100+ tier.' },
    { title: 'Quote Approved', date: '2025-01-10T11:30:00Z', description: 'Approved by practice administrator.' },
  ],
  'QT-2025-0003': [
    { title: 'Quote Created', date: '2025-01-12T09:00:00Z', description: 'Q1 enterprise restock proposal drafted.' },
    { title: 'Submitted to Customer', date: '2025-01-12T09:30:00Z', description: 'Sent to James Mitchell for review.' },
    { title: 'Under Review', date: '2025-01-14T10:00:00Z', description: 'DSO procurement team reviewing line items.' },
  ],
  'QT-2025-0004': [
    { title: 'Quote Created', date: '2025-01-14T16:30:00Z', description: 'Startup kit proposal drafted for Metro Dental.' },
    { title: 'Draft Saved', date: '2025-01-14T16:30:00Z', description: 'Awaiting clinical evaluation feedback from Dr. Kim.' },
  ],
  'QT-2025-0005': [
    { title: 'Quote Created', date: '2025-01-05T11:00:00Z', description: 'Comprehensive supply agreement drafted.' },
    { title: 'Submitted to Customer', date: '2025-01-06T09:00:00Z', description: 'Sent to Dr. Amanda Foster.' },
    { title: 'Quote Approved', date: '2025-01-13T15:45:00Z', description: 'Approved by Dr. Foster. PO expected by end of January.' },
  ],
  'QT-2024-0006': [
    { title: 'Quote Created', date: '2024-10-01T09:30:00Z', description: 'Digital orthodontics bundle proposal.' },
    { title: 'Submitted to Customer', date: '2024-10-02T10:00:00Z', description: 'Sent to Dr. Michael Thompson.' },
    { title: 'Customer Feedback', date: '2024-11-05T14:00:00Z', description: 'Budget concerns raised by practice.' },
    { title: 'Quote Rejected', date: '2024-11-20T14:00:00Z', description: 'Rejected due to budget constraints. Phased approach requested.' },
  ],
  'QT-2025-0007': [
    { title: 'Quote Created', date: '2025-01-10T13:00:00Z', description: 'Consignment bracket inventory proposal created.' },
    { title: 'Submitted to Customer', date: '2025-01-10T13:30:00Z', description: 'Sent to Dr. Sarah Chen for consignment review.' },
  ],
  'QT-2025-0008': [
    { title: 'Quote Created', date: '2025-01-15T08:00:00Z', description: 'Full practice supply restock drafted.' },
    { title: 'Draft Saved', date: '2025-01-15T08:00:00Z', description: 'Pending pricing review.' },
  ],
};

export function getTimelineEventsForQuote(quoteId) {
  return quoteTimelineEvents[quoteId] || [];
}
