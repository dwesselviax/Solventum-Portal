// Mock service/maintenance requests for Solventum B2B Portal
// Statuses: Open, In Progress, Awaiting Parts, Scheduled, Completed

export const serviceRequests = [
  {
    id: 'SRV-2025-0001',
    type: 'Corrective Maintenance',
    priority: 'Critical',
    status: 'In Progress',
    subject: 'Secure II Bed — Powered Drive System Failure',
    description:
      'Bed SEC2-2024-30005 in ICU Room 316 has complete drive system failure. Bed will not elevate or articulate. Patient had to be manually transferred. Immediate repair needed.',
    assetId: 'AST-001',
    productId: 'PRD-004',
    productName: 'Secure II Hospital Bed',
    serialNumber: 'SEC2-2024-30005',
    customer: {
      id: 'ORG-001',
      name: 'Northwest Medical Center',
      contactName: 'Facilities Dept — Tom Rivera',
      contactEmail: 'facilities@northwestmedical.org',
      contactPhone: '+1 (206) 555-0150',
    },
    location: {
      facility: 'Northwest Medical Center',
      department: 'ICU',
      floor: '3',
      room: '316',
    },
    requestedDate: '2025-01-13T06:30:00Z',
    scheduledDate: '2025-01-13T14:00:00Z',
    completedDate: null,
    assignedTechnician: {
      name: 'David Park',
      phone: '+1 (206) 555-0177',
      email: 'd.park@solventum.com',
    },
    warrantyStatus: 'Under Warranty',
    estimatedCost: 0,
    parts: [
      { partNumber: 'SEC2-DRV-MOTOR', description: 'Drive Motor Assembly', quantity: 1, status: 'On Order' },
      { partNumber: 'SEC2-DRV-CTRL', description: 'Drive Controller Board', quantity: 1, status: 'In Stock' },
    ],
    workLog: [
      {
        timestamp: '2025-01-13T08:00:00Z',
        author: 'David Park',
        entry: 'Initial triage call. Customer confirms total drive failure. Bed non-functional. Loaner bed dispatched.',
      },
      {
        timestamp: '2025-01-13T14:00:00Z',
        author: 'David Park',
        entry: 'On-site inspection. Drive motor burned out. Controller board shows overcurrent damage. Ordering motor assembly.',
      },
    ],
    notes: 'Loaner bed provided. ETA for motor assembly: 2 business days.',
  },
  {
    id: 'SRV-2025-0002',
    type: 'Corrective Maintenance',
    priority: 'High',
    status: 'Awaiting Parts',
    subject: 'LIFEPAK 15 — Intermittent Display Failure',
    description:
      'LIFEPAK 15 unit LP15-2023-91078 experiencing intermittent display blackouts during monitoring. Display goes blank for 3-5 seconds then recovers. Occurred multiple times during patient monitoring. Unit pulled from service.',
    assetId: 'AST-008',
    productId: 'PRD-007',
    productName: 'LIFEPAK 15 Monitor/Defibrillator',
    serialNumber: 'LP15-2023-91078',
    customer: {
      id: 'ORG-003',
      name: 'Mercy Health System',
      contactName: 'Biomed Engineering — Linda Walsh',
      contactEmail: 'biomed@mercywest.org',
      contactPhone: '+1 (513) 555-0220',
    },
    location: {
      facility: 'Mercy West Hospital',
      department: 'Biomedical Engineering',
      floor: 'B1',
      room: 'Biomed Workshop',
    },
    requestedDate: '2025-01-08T11:00:00Z',
    scheduledDate: '2025-01-20T09:00:00Z',
    completedDate: null,
    assignedTechnician: {
      name: 'Marcus Johnson',
      phone: '+1 (513) 555-0245',
      email: 'm.johnson@solventum.com',
    },
    warrantyStatus: 'Under Warranty',
    estimatedCost: 0,
    parts: [
      { partNumber: 'LP15-LCD-ASM', description: 'LCD Display Assembly', quantity: 1, status: 'On Order — ETA Jan 18' },
      { partNumber: 'LP15-VID-BRD', description: 'Video Processing Board', quantity: 1, status: 'On Order — ETA Jan 18' },
    ],
    workLog: [
      {
        timestamp: '2025-01-08T14:00:00Z',
        author: 'Marcus Johnson',
        entry: 'Remote diagnostics attempted. Error log shows multiple display driver timeouts. Requires on-site board-level repair.',
      },
      {
        timestamp: '2025-01-10T09:00:00Z',
        author: 'Marcus Johnson',
        entry: 'Parts ordered. LCD assembly and video board. Scheduled on-site repair for Jan 20.',
      },
    ],
    notes: 'Unit is out of service. Loaner not available — customer using backup unit from ICU.',
  },
  {
    id: 'SRV-2025-0003',
    type: 'Preventive Maintenance',
    priority: 'Standard',
    status: 'Scheduled',
    subject: 'Neptune 3 — Semi-Annual Preventive Maintenance',
    description:
      'Scheduled semi-annual PM for all 4 Neptune 3 systems installed in OR suites 1-4. Includes filter inspection, suction calibration, and software update to v4.2.0.',
    assetId: 'AST-003',
    productId: 'PRD-003',
    productName: 'Neptune 3 Waste Management System',
    serialNumber: 'NEP3-2024-41003 (+ 3 additional units)',
    customer: {
      id: 'ORG-001',
      name: 'Northwest Medical Center',
      contactName: 'Facilities Dept — Tom Rivera',
      contactEmail: 'facilities@northwestmedical.org',
      contactPhone: '+1 (206) 555-0150',
    },
    location: {
      facility: 'Northwest Medical Center',
      department: 'Surgical Services',
      floor: '2',
      room: 'OR Suites 1-4',
    },
    requestedDate: '2025-01-06T08:00:00Z',
    scheduledDate: '2025-02-10T06:00:00Z',
    completedDate: null,
    assignedTechnician: {
      name: 'David Park',
      phone: '+1 (206) 555-0177',
      email: 'd.park@solventum.com',
    },
    warrantyStatus: 'Under Warranty',
    estimatedCost: 0,
    parts: [
      { partNumber: 'NEP3-ULPA-FLT', description: 'ULPA Filter Replacement', quantity: 4, status: 'In Stock' },
      { partNumber: 'NEP3-SEAL-KIT', description: 'Canister Seal Kit', quantity: 4, status: 'In Stock' },
    ],
    workLog: [
      {
        timestamp: '2025-01-06T10:00:00Z',
        author: 'David Park',
        entry: 'PM scheduled for Feb 10. Coordinating with OR schedule — early morning block before first cases.',
      },
    ],
    notes: 'Coordinate with OR scheduler Lisa Chen at ext. 4521. PM must be completed before 7:30 AM first case.',
  },
  {
    id: 'SRV-2024-0004',
    type: 'Installation',
    priority: 'Standard',
    status: 'Completed',
    subject: 'T5 Prime Stretcher Fleet — Installation and Training',
    description:
      'Installation, configuration, and staff training for 10 T5 Prime Powered Stretchers delivered to Mercy Anderson ED.',
    assetId: 'AST-005',
    productId: 'PRD-006',
    productName: 'T5 Prime Powered Stretcher',
    serialNumber: 'T5P-2024-78001 through T5P-2024-78010',
    customer: {
      id: 'ORG-003',
      name: 'Mercy Health System',
      contactName: 'Michael Thompson',
      contactEmail: 'm.thompson@mercyhealth.org',
      contactPhone: '+1 (513) 555-0361',
    },
    location: {
      facility: 'Mercy Anderson Hospital',
      department: 'Emergency Department',
      floor: '1',
      room: 'ED Bays 1-10',
    },
    requestedDate: '2024-12-20T00:00:00Z',
    scheduledDate: '2025-01-10T07:00:00Z',
    completedDate: '2025-01-10T16:30:00Z',
    assignedTechnician: {
      name: 'Marcus Johnson',
      phone: '+1 (513) 555-0245',
      email: 'm.johnson@solventum.com',
    },
    warrantyStatus: 'N/A — New Installation',
    estimatedCost: 0,
    parts: [],
    workLog: [
      {
        timestamp: '2025-01-10T07:00:00Z',
        author: 'Marcus Johnson',
        entry: 'Arrived on-site. Confirmed 10 stretchers received. Beginning assembly and configuration.',
      },
      {
        timestamp: '2025-01-10T12:00:00Z',
        author: 'Marcus Johnson',
        entry: 'All 10 stretchers assembled and functional. Battery charging stations installed. Beginning staff in-service.',
      },
      {
        timestamp: '2025-01-10T16:30:00Z',
        author: 'Marcus Johnson',
        entry: 'Installation complete. In-service training completed for day shift (14 staff). Night shift training scheduled Jan 11.',
      },
    ],
    notes: 'Night shift training to be conducted by charge nurse using provided training materials.',
  },
  {
    id: 'SRV-2025-0005',
    type: 'Calibration',
    priority: 'Standard',
    status: 'Open',
    subject: 'System 8 Power Tools — Annual Calibration',
    description:
      'Annual calibration and performance verification for System 8 power tool fleet (6 sets). Includes torque verification, speed calibration, and safety interlock testing.',
    assetId: 'AST-007',
    productId: 'PRD-001',
    productName: 'System 8 Large Bone Power Tool Set',
    serialNumber: 'Multiple — see fleet list',
    customer: {
      id: 'ORG-005',
      name: 'Cascade Regional Medical Center',
      contactName: 'Dr. Amanda Foster',
      contactEmail: 'a.foster@cascaderegional.org',
      contactPhone: '+1 (541) 555-0130',
    },
    location: {
      facility: 'Cascade Regional Medical Center',
      department: 'Sterile Processing / Biomed',
      floor: '1',
      room: 'SPD',
    },
    requestedDate: '2025-01-14T09:00:00Z',
    scheduledDate: null,
    completedDate: null,
    assignedTechnician: null,
    warrantyStatus: 'Mixed — 2 under warranty, 4 out of warranty',
    estimatedCost: 4800.0,
    parts: [],
    workLog: [
      {
        timestamp: '2025-01-14T09:00:00Z',
        author: 'System',
        entry: 'Service request created via portal. Awaiting technician assignment and scheduling.',
      },
    ],
    notes: 'Customer requests calibration during low-volume week. Suggest Feb 17-21. Quote for out-of-warranty units needed.',
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
