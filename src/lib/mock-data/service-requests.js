// Mock service/maintenance requests for Solventum Ortho Portal
// Statuses: Open, In Progress, Awaiting Parts, Scheduled, Completed

export const serviceRequests = [
  {
    id: 'SRV-2025-0001',
    type: 'Product Quality Complaint',
    priority: 'Critical',
    status: 'In Progress',
    subject: 'Clarity Advanced Brackets — Debonding During Treatment',
    description:
      'Multiple Clarity Advanced ceramic brackets debonding spontaneously from patient teeth within 48 hours of placement. Dr. Chen reports 4 bracket failures across 2 patients this week using lot CLR-ADV-LOT-2024-0889. Bonding protocol verified correct. Requesting lot investigation.',
    assetId: null,
    productId: 'PRD-001',
    productName: 'Clarity Advanced Ceramic Brackets — Upper 5x5 Kit',
    serialNumber: null,
    lotNumber: 'CLR-ADV-LOT-2024-0889',
    customer: {
      id: 'ORG-001',
      name: 'Chen Orthodontics',
      contactName: 'Dr. Sarah Chen',
      contactEmail: 'sarah.chen@chenortho.com',
      contactPhone: '+1 (206) 555-0142',
    },
    location: {
      facility: 'Chen Orthodontics',
      department: 'Operatory 1',
      floor: '3',
      room: 'Suite 300',
    },
    requestedDate: '2025-01-13T06:30:00Z',
    scheduledDate: '2025-01-14T10:00:00Z',
    completedDate: null,
    assignedTechnician: {
      name: 'David Kim',
      phone: '+1 (651) 555-0177',
      email: 'd.kim@solventum.com',
    },
    warrantyStatus: 'N/A — Consumable Product',
    estimatedCost: 0,
    parts: [
      { partNumber: 'PRD-001', description: 'Clarity Advanced Ceramic Brackets — Replacement Kit', quantity: 2, status: 'Shipped' },
    ],
    workLog: [
      {
        timestamp: '2025-01-13T08:00:00Z',
        author: 'David Kim',
        entry: 'Initial call with Dr. Chen. Confirmed bonding protocol followed per IFU. 4 bracket failures from same lot. Escalated to quality team.',
      },
      {
        timestamp: '2025-01-13T14:00:00Z',
        author: 'David Kim',
        entry: 'Quality team reviewing lot CLR-ADV-LOT-2024-0889. Replacement brackets shipped overnight. On-site visit scheduled for Jan 14.',
      },
    ],
    notes: 'High-priority Gold tier account. Replacement brackets sent overnight. Quality investigation ongoing.',
  },
  {
    id: 'SRV-2025-0002',
    type: 'Equipment Repair',
    priority: 'High',
    status: 'Awaiting Parts',
    subject: 'Ortholux Luminous Curing Light — LED Module Failure',
    description:
      'Ortholux Luminous curing light OLUX-2023-91078 not producing light output. Button clicks but no LED activation. Unit pulled from clinical use. Practice down to one curing light across 10 operatories.',
    assetId: 'AST-008',
    productId: 'PRD-050',
    productName: 'Ortholux Luminous LED Curing Light',
    serialNumber: 'OLUX-2023-91078',
    lotNumber: null,
    customer: {
      id: 'ORG-003',
      name: 'Bright Smiles Orthodontics',
      contactName: 'Robert Daniels — Practice Administrator',
      contactEmail: 'admin@brightsmiles.com',
      contactPhone: '+1 (513) 555-0375',
    },
    location: {
      facility: 'Bright Smiles Orthodontics',
      department: 'Storage (removed from Operatory B)',
      floor: '2',
      room: 'Suite 200, Supply Closet',
    },
    requestedDate: '2025-01-08T11:00:00Z',
    scheduledDate: '2025-01-20T09:00:00Z',
    completedDate: null,
    assignedTechnician: {
      name: 'David Kim',
      phone: '+1 (651) 555-0177',
      email: 'd.kim@solventum.com',
    },
    warrantyStatus: 'Under Warranty',
    estimatedCost: 0,
    parts: [
      { partNumber: 'OLUX-LED-MOD', description: 'LED Module Assembly', quantity: 1, status: 'On Order — ETA Jan 18' },
    ],
    workLog: [
      {
        timestamp: '2025-01-08T14:00:00Z',
        author: 'David Kim',
        entry: 'Remote diagnostics. Customer confirmed no light output. LED driver board likely failed. Ordering replacement LED module.',
      },
      {
        timestamp: '2025-01-10T09:00:00Z',
        author: 'David Kim',
        entry: 'Parts ordered. LED module on back order — ETA Jan 18. Scheduled on-site repair for Jan 20.',
      },
    ],
    notes: 'Practice needs loaner curing light. Checking loaner inventory for Cincinnati area.',
  },
  {
    id: 'SRV-2025-0003',
    type: 'Tech Support',
    priority: 'Standard',
    status: 'Scheduled',
    subject: 'Clarity Aligner Portal — Case Submission Error',
    description:
      'Dr. Thompson unable to submit aligner cases through the Clarity portal. Error message "Scan data incomplete" appearing even with full arch scans uploaded. Issue started after portal software update on Jan 5. 3 patient cases delayed.',
    assetId: null,
    productId: 'PRD-020',
    productName: 'Clarity Aligner System',
    serialNumber: null,
    lotNumber: null,
    customer: {
      id: 'ORG-003',
      name: 'Bright Smiles Orthodontics',
      contactName: 'Dr. Michael Thompson',
      contactEmail: 'm.thompson@brightsmiles.com',
      contactPhone: '+1 (513) 555-0361',
    },
    location: {
      facility: 'Bright Smiles Orthodontics',
      department: 'Digital Imaging Station',
      floor: '2',
      room: 'Suite 200, Scanning Room',
    },
    requestedDate: '2025-01-06T08:00:00Z',
    scheduledDate: '2025-01-15T10:00:00Z',
    completedDate: null,
    assignedTechnician: {
      name: 'Lisa Park',
      phone: '+1 (651) 555-0188',
      email: 'l.park@solventum.com',
    },
    warrantyStatus: 'N/A — Software Issue',
    estimatedCost: 0,
    parts: [],
    workLog: [
      {
        timestamp: '2025-01-06T10:00:00Z',
        author: 'Lisa Park',
        entry: 'Remote session scheduled. Known issue with portal update v3.2.1 affecting scan file compatibility. Engineering team has hotfix ready.',
      },
      {
        timestamp: '2025-01-10T14:00:00Z',
        author: 'Lisa Park',
        entry: 'Hotfix v3.2.2 deployed to production. Scheduling remote session with Dr. Thompson to verify fix and submit pending cases.',
      },
    ],
    notes: 'Known software bug affecting some scanner file formats. Hotfix deployed. Verify with customer.',
  },
  {
    id: 'SRV-2024-0004',
    type: 'Order Issue',
    priority: 'Standard',
    status: 'Completed',
    subject: 'Wrong Archwire Sizes Shipped — ORD-2024-0011',
    description:
      'Lakeside Ortho received .018 round NiTi archwires instead of ordered .016 round. Packaging labeled correctly as .016 but contents are .018. 5 packs affected. Need correct sizes for patient appointments this week.',
    assetId: null,
    productId: 'PRD-030',
    productName: 'Nitinol Super Elastic Archwires — Upper Assortment Pack',
    serialNumber: null,
    lotNumber: 'NITI-LOT-2024-1887',
    customer: {
      id: 'ORG-005',
      name: 'Lakeside Family Orthodontics',
      contactName: 'Dr. Amanda Foster',
      contactEmail: 'a.foster@lakesideortho.com',
      contactPhone: '+1 (541) 555-0130',
    },
    location: {
      facility: 'Lakeside Family Orthodontics',
      department: 'Main Operatory',
      floor: '1',
      room: 'Suite 102',
    },
    requestedDate: '2024-12-20T00:00:00Z',
    scheduledDate: '2024-12-20T14:00:00Z',
    completedDate: '2024-12-22T10:00:00Z',
    assignedTechnician: {
      name: 'David Kim',
      phone: '+1 (651) 555-0177',
      email: 'd.kim@solventum.com',
    },
    warrantyStatus: 'N/A — Shipping Error',
    estimatedCost: 0,
    parts: [
      { partNumber: 'PRD-030', description: 'NiTi SE Archwires .016 Upper (replacement)', quantity: 5, status: 'Shipped — Overnight' },
    ],
    workLog: [
      {
        timestamp: '2024-12-20T10:00:00Z',
        author: 'David Kim',
        entry: 'Confirmed mislabeling issue. Lot NITI-LOT-2024-1887 has packaging/content mismatch. Quality alert issued. Replacement .016 wires shipped overnight.',
      },
      {
        timestamp: '2024-12-22T10:00:00Z',
        author: 'David Kim',
        entry: 'Correct archwires delivered. RMA-2024-0002 created for return of incorrect wires. Customer confirmed resolution. Lot quarantine in progress.',
      },
    ],
    notes: 'Resolved. Quality investigation ongoing for lot NITI-LOT-2024-1887. See RMA-2024-0002.',
  },
  {
    id: 'SRV-2025-0005',
    type: 'Warranty Claim',
    priority: 'Standard',
    status: 'Open',
    subject: 'Ortholux Luminous — Battery Not Holding Charge',
    description:
      'Ortholux Luminous curing light OLUX-2021-33012 battery draining within 30 minutes of use. Previously lasted full clinical day. Battery replaced 10 months ago under previous warranty claim. Unit now out of warranty.',
    assetId: 'AST-007',
    productId: 'PRD-050',
    productName: 'Ortholux Luminous LED Curing Light',
    serialNumber: 'OLUX-2021-33012',
    lotNumber: null,
    customer: {
      id: 'ORG-005',
      name: 'Lakeside Family Orthodontics',
      contactName: 'Dr. Amanda Foster',
      contactEmail: 'a.foster@lakesideortho.com',
      contactPhone: '+1 (541) 555-0130',
    },
    location: {
      facility: 'Lakeside Family Orthodontics',
      department: 'Main Operatory',
      floor: '1',
      room: 'Suite 102, Chair 1',
    },
    requestedDate: '2025-01-14T09:00:00Z',
    scheduledDate: null,
    completedDate: null,
    assignedTechnician: null,
    warrantyStatus: 'Expired — Reviewing goodwill claim',
    estimatedCost: 185.0,
    parts: [],
    workLog: [
      {
        timestamp: '2025-01-14T09:00:00Z',
        author: 'System',
        entry: 'Service request created via portal. Warranty expired Sept 2023. Battery was replaced under warranty March 2024 (SRV-2024-0018). Reviewing goodwill policy for repeat battery issue.',
      },
    ],
    notes: 'Battery replaced under warranty 10 months ago. Repeat failure suggests deeper issue. Consider goodwill replacement or upgrade quote for new unit.',
  },
  {
    id: 'SRV-2025-0006',
    type: 'Product Quality Complaint',
    priority: 'High',
    status: 'In Progress',
    subject: 'Transbond XT — Adhesive Not Curing Properly',
    description:
      'Smile DSO Location 5 reports Transbond XT adhesive not achieving full cure even with extended light exposure (20+ seconds). Brackets debonding same day as placement. Issue across multiple Transbond XT kits from lot TBXT-LOT-2024-0875. Curing light tested and verified functional.',
    assetId: null,
    productId: 'PRD-010',
    productName: 'Transbond XT Light Cure Adhesive Syringe Kit',
    serialNumber: null,
    lotNumber: 'TBXT-LOT-2024-0875',
    customer: {
      id: 'ORG-002',
      name: 'Smile DSO Group',
      contactName: 'James Mitchell',
      contactEmail: 'j.mitchell@smiledsogroup.com',
      contactPhone: '+1 (312) 555-0287',
    },
    location: {
      facility: 'Smile DSO — Location 5 (Schaumburg)',
      department: 'Operatory 2',
      floor: '1',
      room: 'Chair 3',
    },
    requestedDate: '2025-01-15T11:00:00Z',
    scheduledDate: '2025-01-17T09:00:00Z',
    completedDate: null,
    assignedTechnician: {
      name: 'David Kim',
      phone: '+1 (651) 555-0177',
      email: 'd.kim@solventum.com',
    },
    warrantyStatus: 'N/A — Consumable Product',
    estimatedCost: 0,
    parts: [
      { partNumber: 'PRD-010', description: 'Transbond XT Replacement Kits (fresh lot)', quantity: 6, status: 'Shipped — Overnight' },
    ],
    workLog: [
      {
        timestamp: '2025-01-15T14:00:00Z',
        author: 'David Kim',
        entry: 'Contacted Location 5. Verified curing light output at 1200 mW/cm2. Adhesive from lot TBXT-LOT-2024-0875 appears to have storage issue — may have been exposed to heat. Checking storage conditions.',
      },
      {
        timestamp: '2025-01-16T09:00:00Z',
        author: 'David Kim',
        entry: 'Replacement adhesive from fresh lot shipped overnight. On-site visit scheduled Jan 17 to verify storage conditions and check remaining inventory from suspect lot.',
      },
    ],
    notes: 'Platinum tier account. Possible cold chain break during summer storage. On-site investigation scheduled.',
  },
];

export const getServiceRequestById = (id) => serviceRequests.find((sr) => sr.id === id);
export const getServiceRequestsByStatus = (status) =>
  serviceRequests.filter((sr) => sr.status === status);
export const getServiceRequestsByCustomer = (customerId) =>
  serviceRequests.filter((sr) => sr.customer.id === customerId);

export const serviceRequestStatuses = [
  'Open',
  'In Progress',
  'Awaiting Parts',
  'Scheduled',
  'Completed',
];

export default serviceRequests;
