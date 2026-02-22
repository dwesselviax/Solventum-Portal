// Mock notifications for Solventum Ortho Portal
// Types: order | shipment | invoice | contract | sample | system | promotion | service
// Roles: orthodontist | dso | sales_rep | ar | csr

const ALL_ROLES = ['orthodontist', 'dso', 'sales_rep', 'ar', 'csr'];

export const notifications = [
  {
    id: 'NTF-001',
    type: 'order',
    title: 'Order confirmed',
    message: 'Order ORD-2025-0001 has been confirmed and is being prepared for fulfillment.',
    createdAt: '2026-02-21T08:30:00Z',
    read: false,
    link: '/orders/ORD-2025-0001',
    roles: ['orthodontist', 'dso'],
  },
  {
    id: 'NTF-002',
    type: 'shipment',
    title: 'Shipment out for delivery',
    message: 'Shipment SHP-2025-0001 is out for delivery — estimated arrival today by 5pm.',
    createdAt: '2026-02-21T07:15:00Z',
    read: false,
    link: '/shipments/SHP-2025-0001',
    roles: ['orthodontist', 'dso'],
  },
  {
    id: 'NTF-003',
    type: 'invoice',
    title: 'Invoice overdue',
    message: 'Invoice INV-2025-0003 is overdue — payment due Jan 15. Please remit payment to avoid service interruption.',
    createdAt: '2026-02-20T16:00:00Z',
    read: false,
    link: '/invoices/INV-2025-0003',
    roles: ['orthodontist', 'dso', 'ar'],
  },
  {
    id: 'NTF-004',
    type: 'contract',
    title: 'Contract expiring soon',
    message: 'Your contract CTR-001 expires in 45 days. Contact your sales representative to discuss renewal options.',
    createdAt: '2026-02-20T10:00:00Z',
    read: false,
    link: '/contracts/CTR-001',
    roles: ['orthodontist', 'dso'],
  },
  {
    id: 'NTF-005',
    type: 'sample',
    title: 'Sample request approved',
    message: 'Sample request SMP-003 has been approved and will ship within 2 business days.',
    createdAt: '2026-02-19T14:30:00Z',
    read: true,
    link: '/samples/SMP-003',
    roles: ['orthodontist', 'dso'],
  },
  {
    id: 'NTF-006',
    type: 'promotion',
    title: 'New promotion available',
    message: 'Spring Startup Kit — 20% off brackets and bonding supplies for new practices. Offer valid through March 31.',
    createdAt: '2026-02-19T09:00:00Z',
    read: false,
    link: '/promotions',
    roles: ['orthodontist', 'dso', 'sales_rep'],
  },
  {
    id: 'NTF-007',
    type: 'service',
    title: 'Service request resolved',
    message: 'Service request SR-002 has been resolved. Please confirm the issue is fully addressed.',
    createdAt: '2026-02-18T17:45:00Z',
    read: true,
    link: '/service-requests/SR-002',
    roles: ['orthodontist', 'dso', 'csr'],
  },
  {
    id: 'NTF-008',
    type: 'order',
    title: 'New case submission received',
    message: 'New Clarity Aligner case submission received from Dr. Sarah Chen — review and approve treatment plan.',
    createdAt: '2026-02-21T06:45:00Z',
    read: false,
    link: '/treatment-plans',
    roles: ['sales_rep'],
  },
  {
    id: 'NTF-009',
    type: 'order',
    title: 'New customer order',
    message: 'Customer Metro Dental Partners placed order ORD-2025-0008 totaling $4,280. Review order details.',
    createdAt: '2026-02-20T11:20:00Z',
    read: false,
    link: '/orders/ORD-2025-0008',
    roles: ['sales_rep'],
  },
  {
    id: 'NTF-010',
    type: 'invoice',
    title: 'Overdue invoices alert',
    message: '3 invoices are overdue totaling $12,450. Immediate follow-up recommended to prevent aging.',
    createdAt: '2026-02-21T08:00:00Z',
    read: false,
    link: '/invoices?status=overdue',
    roles: ['ar'],
  },
  {
    id: 'NTF-011',
    type: 'contract',
    title: 'Contract renewal pending',
    message: 'Contract CTR-003 renewal pending — action required. Customer has requested updated pricing terms.',
    createdAt: '2026-02-19T15:30:00Z',
    read: false,
    link: '/contracts/CTR-003',
    roles: ['ar', 'sales_rep'],
  },
  {
    id: 'NTF-012',
    type: 'service',
    title: 'New service request',
    message: 'New service request SR-006 opened by Chen Orthodontics regarding bracket debonding issue.',
    createdAt: '2026-02-20T13:10:00Z',
    read: false,
    link: '/service-requests/SR-006',
    roles: ['csr'],
  },
  {
    id: 'NTF-013',
    type: 'order',
    title: 'Return requires processing',
    message: 'Return RET-003 requires processing — customer reports incorrect product received. Review and authorize.',
    createdAt: '2026-02-20T09:45:00Z',
    read: false,
    link: '/returns/RET-003',
    roles: ['csr'],
  },
  {
    id: 'NTF-014',
    type: 'system',
    title: 'Scheduled maintenance',
    message: 'System maintenance scheduled Feb 28, 2am-4am EST. Portal access may be intermittent during this window.',
    createdAt: '2026-02-18T12:00:00Z',
    read: true,
    link: '/dashboard',
    roles: ALL_ROLES,
  },
  {
    id: 'NTF-015',
    type: 'system',
    title: 'Clarity Portal v2.1 update',
    message: 'Clarity Portal v2.1 update — new treatment staging features, improved 3D viewer, and enhanced case tracking.',
    createdAt: '2026-02-17T10:00:00Z',
    read: true,
    link: '/dashboard',
    roles: ['orthodontist', 'dso', 'sales_rep'],
  },
];

/**
 * Get notifications visible to a specific role, sorted newest first.
 * @param {string} role - User role (orthodontist, dso, sales_rep, ar, csr)
 * @returns {Array} Filtered notifications
 */
export function getNotificationsByRole(role) {
  return notifications
    .filter((n) => n.roles.includes(role))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/**
 * Get count of unread notifications for a specific role.
 * @param {string} role - User role
 * @returns {number} Unread count
 */
export function getUnreadCount(role) {
  return notifications.filter((n) => n.roles.includes(role) && !n.read).length;
}
