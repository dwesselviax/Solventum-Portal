import { brackets } from './brackets';
import { bonding } from './bonding';
import { clarity } from './clarity';
import { archwires } from './archwires';
import { auxiliaries } from './auxiliaries';
import { orthoInstruments } from './instruments';
import { prevention } from './prevention';

export const allProducts = [
  ...brackets, ...bonding, ...clarity, ...archwires,
  ...auxiliaries, ...orthoInstruments, ...prevention,
];

export { brackets, bonding, clarity, archwires, auxiliaries, orthoInstruments, prevention };

export const getProductById = (maId) => allProducts.find((p) => p.maId === maId);
export const getProductsByCategory = (category) => allProducts.filter((p) => p.division === category);

export const productCategories = [
  'Brackets & Tubes',
  'Bonding',
  'Clarity Aligners',
  'Archwires',
  'Auxiliaries',
  'Instruments',
  'Prevention',
];
