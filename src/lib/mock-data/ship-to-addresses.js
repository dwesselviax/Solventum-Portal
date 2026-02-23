const shipToAddresses = [
  // ORG-001 — Chen Orthodontics
  { id: 'ADDR-001', customerId: 'ORG-001', label: 'Main Office', street: '1200 Madison Ave', city: 'Seattle', state: 'WA', zip: '98104', country: 'US', isDefault: true },
  { id: 'ADDR-002', customerId: 'ORG-001', label: 'Bellevue Satellite', street: '456 108th Ave NE', city: 'Bellevue', state: 'WA', zip: '98004', country: 'US', isDefault: false },
  { id: 'ADDR-003', customerId: 'ORG-001', label: 'Tacoma Office', street: '789 Pacific Ave', city: 'Tacoma', state: 'WA', zip: '98402', country: 'US', isDefault: false },

  // ORG-002 — Smile DSO Group
  { id: 'ADDR-004', customerId: 'ORG-002', label: 'Central Distribution', street: '4500 W Diversey Ave', city: 'Chicago', state: 'IL', zip: '60639', country: 'US', isDefault: true },
  { id: 'ADDR-005', customerId: 'ORG-002', label: 'Schaumburg Location', street: '1601 N Roselle Rd', city: 'Schaumburg', state: 'IL', zip: '60195', country: 'US', isDefault: false },
  { id: 'ADDR-006', customerId: 'ORG-002', label: 'Naperville Location', street: '2244 S Washington St', city: 'Naperville', state: 'IL', zip: '60565', country: 'US', isDefault: false },
  { id: 'ADDR-007', customerId: 'ORG-002', label: 'Evanston Location', street: '820 Davis St', city: 'Evanston', state: 'IL', zip: '60201', country: 'US', isDefault: false },

  // ORG-003 — Bright Smiles Orthodontics
  { id: 'ADDR-008', customerId: 'ORG-003', label: 'Main Office', street: '615 Elsinore Pl', city: 'Cincinnati', state: 'OH', zip: '45202', country: 'US', isDefault: true },
  { id: 'ADDR-009', customerId: 'ORG-003', label: 'Fairfield Satellite', street: '3000 Mack Rd', city: 'Fairfield', state: 'OH', zip: '45014', country: 'US', isDefault: false },

  // ORG-004 — Metro Dental Partners
  { id: 'ADDR-010', customerId: 'ORG-004', label: 'Headquarters', street: '100 W Monroe St', city: 'Chicago', state: 'IL', zip: '60603', country: 'US', isDefault: true },
  { id: 'ADDR-011', customerId: 'ORG-004', label: 'North Side Office', street: '3542 N Clark St', city: 'Chicago', state: 'IL', zip: '60657', country: 'US', isDefault: false },
  { id: 'ADDR-012', customerId: 'ORG-004', label: 'Oak Park Office', street: '210 Lake St', city: 'Oak Park', state: 'IL', zip: '60302', country: 'US', isDefault: false },

  // ORG-005 — Lakeside Family Orthodontics
  { id: 'ADDR-013', customerId: 'ORG-005', label: 'Main Office', street: '2501 Mountain View Dr', city: 'Bend', state: 'OR', zip: '97701', country: 'US', isDefault: true },
  { id: 'ADDR-014', customerId: 'ORG-005', label: 'Redmond Office', street: '645 SW Cascade Ave', city: 'Redmond', state: 'OR', zip: '97756', country: 'US', isDefault: false },
];

export { shipToAddresses };
export const getAddressesByCustomerId = (orgId) => shipToAddresses.filter(a => a.customerId === orgId);
export default shipToAddresses;
