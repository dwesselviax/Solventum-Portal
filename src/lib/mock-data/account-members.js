// Account team members for organizations

export const ACCESS_TYPES = {
  admin: { label: 'Admin', description: 'Full access — manage team, orders, billing, and settings' },
  payer: { label: 'Payer', description: 'View and pay invoices, manage payment methods' },
  viewer: { label: 'Viewer', description: 'View-only access to orders, quotes, and shipments' },
  orderer: { label: 'Orderer', description: 'Place orders, manage cart, request quotes' },
};

export const NOTIFICATION_TYPES = [
  { key: 'orderUpdates', label: 'Order Updates' },
  { key: 'shipments', label: 'Shipments' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'promotions', label: 'Promotions' },
  { key: 'contractAlerts', label: 'Contract Alerts' },
];

export const NOTIFICATION_CHANNELS = [
  { key: 'inApp', label: 'In-App' },
  { key: 'email', label: 'Email' },
  { key: 'sms', label: 'SMS' },
];

const defaultNotifications = {
  orderUpdates: { inApp: true, email: true, sms: false },
  shipments: { inApp: true, email: true, sms: false },
  invoices: { inApp: true, email: true, sms: true },
  promotions: { inApp: true, email: false, sms: false },
  contractAlerts: { inApp: true, email: true, sms: false },
};

export const seedMembers = [
  // ORG-001 — Chen Orthodontics
  {
    id: 'MBR-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@chenortho.com',
    phone: '+1 (312) 555-0101',
    accessType: 'admin',
    status: 'active',
    organizationId: 'ORG-001',
    invitedAt: '2024-06-01T10:00:00Z',
    joinedAt: '2024-06-01T10:00:00Z',
    notifications: { ...defaultNotifications },
  },
  {
    id: 'MBR-002',
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lisa.wang@chenortho.com',
    phone: '+1 (312) 555-0102',
    accessType: 'orderer',
    status: 'active',
    organizationId: 'ORG-001',
    invitedAt: '2024-07-15T14:00:00Z',
    joinedAt: '2024-07-16T09:00:00Z',
    notifications: { ...defaultNotifications, promotions: { inApp: false, email: false, sms: false } },
  },
  {
    id: 'MBR-003',
    firstName: 'Tom',
    lastName: 'Nguyen',
    email: 'tom.nguyen@chenortho.com',
    phone: '+1 (312) 555-0103',
    accessType: 'payer',
    status: 'active',
    organizationId: 'ORG-001',
    invitedAt: '2024-08-01T10:00:00Z',
    joinedAt: '2024-08-02T11:30:00Z',
    notifications: { ...defaultNotifications },
  },
  {
    id: 'MBR-004',
    firstName: 'Rachel',
    lastName: 'Kim',
    email: 'rachel.kim@chenortho.com',
    phone: '',
    accessType: 'viewer',
    status: 'pending',
    organizationId: 'ORG-001',
    invitedAt: '2025-01-20T16:00:00Z',
    joinedAt: null,
    notifications: { ...defaultNotifications },
  },

  // ORG-002 — Smile DSO Group
  {
    id: 'MBR-005',
    firstName: 'Mark',
    lastName: 'Reynolds',
    email: 'mark.reynolds@smiledsogroup.com',
    phone: '+1 (617) 555-0201',
    accessType: 'admin',
    status: 'active',
    organizationId: 'ORG-002',
    invitedAt: '2024-03-01T09:00:00Z',
    joinedAt: '2024-03-01T09:00:00Z',
    notifications: { ...defaultNotifications },
  },
  {
    id: 'MBR-006',
    firstName: 'James',
    lastName: 'Mitchell',
    email: 'j.mitchell@smiledsogroup.com',
    phone: '+1 (617) 555-0202',
    accessType: 'orderer',
    status: 'active',
    organizationId: 'ORG-002',
    invitedAt: '2024-03-15T10:00:00Z',
    joinedAt: '2024-03-15T14:00:00Z',
    notifications: { ...defaultNotifications },
  },
  {
    id: 'MBR-007',
    firstName: 'Patricia',
    lastName: 'Gomez',
    email: 'p.gomez@smiledsogroup.com',
    phone: '+1 (617) 555-0203',
    accessType: 'payer',
    status: 'active',
    organizationId: 'ORG-002',
    invitedAt: '2024-04-01T08:00:00Z',
    joinedAt: '2024-04-01T12:00:00Z',
    notifications: { ...defaultNotifications },
  },
  {
    id: 'MBR-008',
    firstName: 'Kevin',
    lastName: 'Tran',
    email: 'k.tran@smiledsogroup.com',
    phone: '',
    accessType: 'viewer',
    status: 'deactivated',
    organizationId: 'ORG-002',
    invitedAt: '2024-05-01T10:00:00Z',
    joinedAt: '2024-05-02T09:00:00Z',
    notifications: { ...defaultNotifications },
  },
];

export function getMembersByOrganization(orgId) {
  return seedMembers.filter((m) => m.organizationId === orgId);
}

export function getMemberById(id) {
  return seedMembers.find((m) => m.id === id);
}
