// Mock sample requests for Solventum Ortho Portal
// Statuses: Pending | Approved | Shipped | Delivered | Denied
// Types: evaluation | patient_trial

export const samples = [
  {
    id: 'SMP-001',
    requestedBy: { userId: 'USR-001', name: 'Dr. Sarah Chen', organization: 'Chen Orthodontics', organizationId: 'ORG-001' },
    requestedAt: '2026-02-10T09:30:00Z',
    status: 'Delivered',
    type: 'evaluation',
    items: [
      { productId: 'PRD-001', productName: 'Clarity Advanced Ceramic Brackets', quantity: 1, notes: 'Upper 3-3 evaluation kit' },
    ],
    shippingAddress: { name: 'Chen Orthodontics', street: '1200 Madison Ave, Suite 300', city: 'Seattle', state: 'WA', zip: '98104' },
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    deliveredAt: '2026-02-14T14:20:00Z',
    approvedBy: 'Emily Rodriguez',
    notes: 'Interested in switching from competitor ceramic brackets. Dr. Chen currently uses Damon Clear and wants to compare translucency and debonding characteristics.',
    followUpDate: '2026-03-01T00:00:00Z',
  },
  {
    id: 'SMP-002',
    requestedBy: { userId: 'USR-002', name: 'Mark Reynolds', organization: 'Smile DSO Group', organizationId: 'ORG-002' },
    requestedAt: '2026-02-15T14:00:00Z',
    status: 'Shipped',
    type: 'evaluation',
    items: [
      { productId: 'PRD-040', productName: 'APC Flash-Free Adhesive Brackets', quantity: 2, notes: 'Upper and lower kits for two pilot locations' },
      { productId: 'PRD-017', productName: 'Transbond Plus Color Change Adhesive', quantity: 1, notes: 'Color change feature requested for resident training' },
    ],
    shippingAddress: { name: 'Smile DSO Group — Central Distribution', street: '4500 W Diversey Ave', city: 'Chicago', state: 'IL', zip: '60639' },
    trackingNumber: '9400111899223100456789',
    carrier: 'USPS Priority',
    deliveredAt: null,
    approvedBy: 'Emily Rodriguez',
    notes: 'DSO evaluating APC Flash-Free system for standardization across 12 locations. If pilot is successful, projected annual volume of 300+ kits.',
    followUpDate: '2026-03-15T00:00:00Z',
  },
  {
    id: 'SMP-003',
    requestedBy: { userId: 'USR-001', name: 'Dr. Sarah Chen', organization: 'Chen Orthodontics', organizationId: 'ORG-001' },
    requestedAt: '2026-02-12T10:45:00Z',
    status: 'Approved',
    type: 'patient_trial',
    items: [
      { productId: 'PRD-026', productName: 'Clarity Aligners Starter Kit', quantity: 1, notes: 'Trial for moderate crowding case — patient J.M.' },
      { productId: 'PRD-029', productName: 'Clarity Precision Grip Attachments', quantity: 1, notes: 'Attachment kit for aligner case' },
    ],
    shippingAddress: { name: 'Chen Orthodontics', street: '1200 Madison Ave, Suite 300', city: 'Seattle', state: 'WA', zip: '98104' },
    trackingNumber: null,
    carrier: null,
    deliveredAt: null,
    approvedBy: 'Emily Rodriguez',
    notes: 'Dr. Chen is expanding into clear aligner cases. This is a sponsored patient trial — first Clarity Aligner case for the practice. Full onboarding support included.',
    followUpDate: '2026-03-10T00:00:00Z',
  },
  {
    id: 'SMP-004',
    requestedBy: { userId: 'USR-006', name: 'Dr. James Patel', organization: 'Bright Smiles Orthodontics', organizationId: 'ORG-003' },
    requestedAt: '2026-02-17T08:15:00Z',
    status: 'Approved',
    type: 'evaluation',
    items: [
      { productId: 'PRD-033', productName: 'Nitinol Heat-Activated Archwires', quantity: 1, notes: 'Assorted sizes for initial alignment phase evaluation' },
      { productId: 'PRD-034', productName: 'Beta-Titanium Archwires', quantity: 1, notes: 'Finishing archwire comparison against current supplier' },
    ],
    shippingAddress: { name: 'Bright Smiles Orthodontics', street: '820 Elm Street, Suite 105', city: 'Portland', state: 'OR', zip: '97205' },
    trackingNumber: null,
    carrier: null,
    deliveredAt: null,
    approvedBy: 'Emily Rodriguez',
    notes: 'Dr. Patel wants to compare our Nitinol and beta-titanium archwires with his current Ormco supply. Specifically interested in force delivery consistency and patient comfort.',
    followUpDate: '2026-03-05T00:00:00Z',
  },
  {
    id: 'SMP-005',
    requestedBy: { userId: 'USR-007', name: 'Dr. Angela Morrison', organization: 'Metro Dental Partners', organizationId: 'ORG-004' },
    requestedAt: '2026-02-18T16:30:00Z',
    status: 'Pending',
    type: 'patient_trial',
    items: [
      { productId: 'PRD-058', productName: 'Incognito Lingual Brackets', quantity: 1, notes: 'Adult patient requesting discreet treatment option' },
      { productId: 'PRD-059', productName: 'Incognito Lite Lingual Brackets', quantity: 1, notes: 'Alternative for comparison — mild anterior crowding case' },
    ],
    shippingAddress: { name: 'Metro Dental Partners — Orthodontic Division', street: '300 Park Ave, Floor 4', city: 'New York', state: 'NY', zip: '10022' },
    trackingNumber: null,
    carrier: null,
    deliveredAt: null,
    approvedBy: null,
    notes: 'Dr. Morrison is new to lingual orthodontics. Requesting trial kits for two adult patients who want invisible treatment but are not candidates for aligners. May need additional training support.',
    followUpDate: null,
  },
  {
    id: 'SMP-006',
    requestedBy: { userId: 'USR-008', name: 'Dr. Kenji Nakamura', organization: 'Lakeside Family Orthodontics', organizationId: 'ORG-005' },
    requestedAt: '2026-02-05T11:00:00Z',
    status: 'Denied',
    type: 'evaluation',
    items: [
      { productId: 'PRD-002', productName: 'Clarity Ultra Self-Ligating Brackets', quantity: 3, notes: 'Full upper and lower kits for three operatories' },
      { productId: 'PRD-016', productName: 'Transbond XT Light Cure Adhesive', quantity: 2, notes: 'Bonding adhesive for evaluation' },
      { productId: 'PRD-032', productName: 'Unitek Stainless Steel Archwires', quantity: 2, notes: 'Assorted sizes' },
    ],
    shippingAddress: { name: 'Lakeside Family Orthodontics', street: '5400 Lakeshore Blvd', city: 'Cleveland', state: 'OH', zip: '44108' },
    trackingNumber: null,
    carrier: null,
    deliveredAt: null,
    approvedBy: null,
    deniedBy: 'Emily Rodriguez',
    denialReason: 'Sample quantity exceeds the per-request limit for Bronze tier accounts. Recommended submitting a revised request for 1 bracket kit and 1 adhesive unit. Practice can qualify for larger sample quantities by upgrading to Silver tier or above.',
    notes: 'Dr. Nakamura is interested in transitioning the entire practice to Clarity Ultra. Quantity requested is too high for current account tier. Follow up with revised request guidance.',
    followUpDate: '2026-02-20T00:00:00Z',
  },
];

export const sampleableProducts = [
  'PRD-001', 'PRD-002', 'PRD-003', 'PRD-004', 'PRD-005', 'PRD-006', 'PRD-007',
  'PRD-016', 'PRD-017', 'PRD-018', 'PRD-019', 'PRD-020',
  'PRD-032', 'PRD-033', 'PRD-034', 'PRD-035', 'PRD-036',
  'PRD-026', 'PRD-029',
  'PRD-040', 'PRD-041', 'PRD-042',
  'PRD-058', 'PRD-059', 'PRD-060',
];

export const getSampleById = (id) => samples.find((s) => s.id === id);
export const getSamplesByStatus = (status) => samples.filter((s) => s.status === status);
export const getSamplesByCustomer = (orgId) => samples.filter((s) => s.requestedBy.organizationId === orgId);
export const sampleStatuses = ['Pending', 'Approved', 'Shipped', 'Delivered', 'Denied'];
export default samples;
