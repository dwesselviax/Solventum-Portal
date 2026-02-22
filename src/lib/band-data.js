/**
 * Band ordering domain data.
 * Derived from the existing OrderBands.jsp form mapping and BandFormEnum.
 */

export const BAND_TYPES = [
  {
    id: 'FirstMolars',
    prefix: 'FMO',
    formCode: '01',
    label: 'First Molars',
    description: 'Standard first molar bands for primary orthodontic treatment.',
    columns: ['Upper Right', 'Upper Left', 'Lower Right', 'Lower Left'],
    fields: ['UpR', 'UpL', 'LoR', 'LoL'],
    requiresTemper: true,
    requiresWidth: true,
    category: 'Molars',
  },
  {
    id: 'SecondMolars',
    prefix: 'SMO',
    formCode: '02',
    label: 'Second Molars',
    description: 'Second molar bands for extended anchorage and molar control.',
    columns: ['Upper Right', 'Upper Left', 'Lower Right', 'Lower Left'],
    fields: ['UpR', 'UpL', 'LoR', 'LoL'],
    requiresTemper: true,
    requiresWidth: true,
    category: 'Molars',
  },
  {
    id: 'FirstSecondMolarsHard',
    prefix: 'MHT',
    formCode: '03',
    label: 'First & Second General Purpose Molars — Hard Temper',
    description: 'Hard temper molar bands for general-purpose use. Default: hard + wide.',
    columns: ['Upper', 'Lower'],
    fields: ['Up', 'Lo'],
    requiresTemper: false,
    requiresWidth: false,
    defaultTemper: 'H',
    defaultWidth: 'W',
    category: 'Molars',
  },
  {
    id: 'FirstSecondMolarsRegular',
    prefix: 'MRE',
    formCode: '04',
    label: 'First & Second General Purpose Molars — Regular',
    description: 'Regular temper molar bands for general-purpose orthodontic use.',
    columns: ['Upper', 'Lower'],
    fields: ['Up', 'Lo'],
    requiresTemper: true,
    requiresWidth: true,
    category: 'Molars',
  },
  {
    id: 'FirstSecondMolarsPedo',
    prefix: 'MPE',
    formCode: '05',
    label: 'First & Second General Purpose Molars — Pedodontic',
    description: 'Smaller pedodontic bands for pediatric patients. Default: regular + narrow.',
    columns: ['Upper', 'Lower'],
    fields: ['Up', 'Lo'],
    requiresTemper: false,
    requiresWidth: false,
    defaultTemper: 'R',
    defaultWidth: 'N',
    category: 'Molars',
  },
  {
    id: 'ProportionalBicuspids',
    prefix: 'PBI',
    formCode: '06',
    label: 'Proportional Bicuspids',
    description: 'Proportionally sized bicuspid bands for accurate fit.',
    columns: ['Upper', 'Lower'],
    fields: ['Up', 'Lo'],
    requiresTemper: false,
    requiresWidth: false,
    category: 'Bicuspids',
  },
  {
    id: 'GeneralPurposeBicuspids',
    prefix: 'GPB',
    formCode: '07',
    label: 'General Purpose Bicuspids',
    description: 'Versatile bicuspid bands with right/left positioning.',
    columns: ['Upper Right', 'Upper Left', 'Lower Right', 'Lower Left'],
    fields: ['UpR', 'UpL', 'LoR', 'LoL'],
    requiresTemper: false,
    requiresWidth: true,
    category: 'Bicuspids',
  },
  {
    id: 'ContouredBicuspids',
    prefix: 'CBI',
    formCode: '08',
    label: 'Contoured Bicuspids',
    description: 'Anatomically contoured bicuspid bands for enhanced fit.',
    columns: ['Upper', 'Lower'],
    fields: ['Up', 'Lo'],
    requiresTemper: false,
    requiresWidth: false,
    category: 'Bicuspids',
  },
];

/** Generate sizes array for the quantity grid (whole + half sizes). */
export function generateSizes(start = 22, end = 42) {
  const sizes = [];
  for (let s = start; s <= end; s++) {
    sizes.push({ value: String(s), label: String(s) });
    if (s < end) {
      sizes.push({ value: `${s}.`, label: `${s} 1/2` });
    }
  }
  return sizes;
}

export const SIZES = generateSizes();

export const TEMPER_OPTIONS = [
  { value: 'R', label: 'Regular' },
  { value: 'H', label: 'Hard' },
];

export const WIDTH_OPTIONS = [
  { value: 'W', label: 'Wide' },
  { value: 'N', label: 'Narrow' },
];

export const PRESCRIPTION_OPTIONS = [
  { value: 'plainband', label: 'Bands only — without attachments' },
  { value: 'perprescription', label: 'Per prescription — with attachments' },
];

/** Mock prescriptions for the prototype. */
export const MOCK_PRESCRIPTIONS = [
  { prescriptionNumber: '0051', sequenceNumber: '47', pageNumber: '1', lastOrdered: '2026-01-15' },
  { prescriptionNumber: '0103', sequenceNumber: '12', pageNumber: '1', lastOrdered: '2025-11-22' },
];

/**
 * Encode quantities into the band_order string format.
 * e.g. { FMOUpR31: 2, FMOUpL31.: 1 } → "FMOUpR31:2;FMOUpL31.:1;"
 */
export function encodeBandOrder(quantities, prefix) {
  return Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([key, qty]) => `${key}:${qty}`)
    .join(';') + ';';
}

/**
 * Build the REST payload matching the existing API contract.
 */
export function buildPayload(bandType, quantities, settings) {
  const items = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([key, qty]) => {
      const field = key.slice(3); // strip prefix
      const archMatch = field.match(/^(Up|Lo)/);
      const sideMatch = field.match(/(R|L)(?=\d)/);
      const sizeMatch = field.match(/(\d+)(\.?)$/);
      return {
        arch: archMatch?.[1] === 'Up' ? 'U' : 'L',
        side: sideMatch ? (sideMatch[1] === 'R' ? 'Rt' : 'Lt') : 'Lt/Rt',
        size: sizeMatch ? sizeMatch[1] + (sizeMatch[2] ? '+' : '') : '',
        quantity: String(qty),
      };
    });

  return {
    bandOrderReq: {
      bandForm: bandType.formCode,
      items,
      temper: settings.temper || '',
      width: settings.width || '',
      countryName: 'US',
      companyNumber: '0001',
      hasAttachment: settings.prescription === 'perprescription',
      isPrescription: settings.prescription === 'perprescription',
      prescription: settings.prescription === 'perprescription'
        ? {
            prescriptionNumber: settings.prescriptionNumber || '',
            sequenceNumber: settings.sequenceNumber || '',
            pageNumber: settings.pageNumber || '',
          }
        : null,
    },
  };
}
