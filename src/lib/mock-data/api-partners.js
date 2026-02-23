export const apiPartners = [
  {
    id: 'PTR-001',
    name: 'Dentira',
    status: 'Active',
    clientId: 'dentira-prod-a8f3x',
    agreementStatus: 'Signed',
    agreementDate: '2024-11-01',
    apiKeys: [
      { id: 'KEY-001', name: 'Production', created: '2024-11-15', lastUsed: '2026-02-22', status: 'Active' },
      { id: 'KEY-002', name: 'Staging', created: '2024-11-15', lastUsed: '2026-02-20', status: 'Active' },
    ],
    usage: { ordersSubmitted: 1247, catalogQueries: 8432, pricingQueries: 3891, statusLookups: 5621 },
    permissions: ['catalog_read', 'pricing_read', 'order_create', 'order_status'],
    rateLimit: { requestsPerMinute: 100, requestsPerDay: 50000 },
    contact: { name: 'Alex Rivera', email: 'alex.r@dentira.com', phone: '+1 (415) 555-0198' },
    createdAt: '2024-11-01',
  },
  {
    id: 'PTR-002',
    name: 'OrthoConnect',
    status: 'Active',
    clientId: 'orthoconnect-prod-k2m9v',
    agreementStatus: 'Signed',
    agreementDate: '2025-03-15',
    apiKeys: [
      { id: 'KEY-003', name: 'Production', created: '2025-03-20', lastUsed: '2026-02-21', status: 'Active' },
    ],
    usage: { ordersSubmitted: 634, catalogQueries: 4215, pricingQueries: 2108, statusLookups: 3412 },
    permissions: ['catalog_read', 'pricing_read', 'order_create', 'order_status', 'inventory_read'],
    rateLimit: { requestsPerMinute: 60, requestsPerDay: 30000 },
    contact: { name: 'Priya Sharma', email: 'priya@orthoconnect.io', phone: '+1 (312) 555-0234' },
    createdAt: '2025-03-15',
  },
  {
    id: 'PTR-003',
    name: 'SmileTech Labs',
    status: 'Pending',
    clientId: null,
    agreementStatus: 'Sent',
    agreementDate: null,
    apiKeys: [],
    usage: { ordersSubmitted: 0, catalogQueries: 0, pricingQueries: 0, statusLookups: 0 },
    permissions: ['catalog_read'],
    rateLimit: { requestsPerMinute: 30, requestsPerDay: 10000 },
    contact: { name: 'Jordan Lee', email: 'jordan@smiletechlabs.com', phone: '+1 (206) 555-0371' },
    createdAt: '2026-02-10',
  },
  {
    id: 'PTR-004',
    name: 'DentalHub',
    status: 'Suspended',
    clientId: 'dentalhub-prod-r7q4p',
    agreementStatus: 'Signed',
    agreementDate: '2024-06-01',
    apiKeys: [
      { id: 'KEY-004', name: 'Production', created: '2024-06-15', lastUsed: '2025-09-30', status: 'Revoked' },
    ],
    usage: { ordersSubmitted: 89, catalogQueries: 1203, pricingQueries: 567, statusLookups: 891 },
    permissions: ['catalog_read', 'pricing_read'],
    rateLimit: { requestsPerMinute: 0, requestsPerDay: 0 },
    contact: { name: 'Casey Morgan', email: 'casey@dentalhub.net', phone: '+1 (646) 555-0445' },
    createdAt: '2024-06-01',
  },
];

export const getPartnerById = (id) => apiPartners.find(p => p.id === id);
export const getPartnersByStatus = (status) => apiPartners.filter(p => p.status === status);

export const API_PERMISSIONS = [
  { id: 'catalog_read', label: 'Catalog Read', description: 'Read product catalog data' },
  { id: 'pricing_read', label: 'Pricing Read', description: 'Read pricing and volume breaks' },
  { id: 'order_create', label: 'Order Create', description: 'Submit orders via API' },
  { id: 'order_status', label: 'Order Status', description: 'Check order status and tracking' },
  { id: 'inventory_read', label: 'Inventory Read', description: 'Read inventory availability' },
  { id: 'returns_create', label: 'Returns Create', description: 'Submit return requests' },
];

export default apiPartners;
