// Mock products for Solventum B2B Portal
// Organized by division — 11 divisions, ~160 products
import { allProducts } from './products/index';

export const products = allProducts;

export const getProductById = (maId) => products.find((p) => p.maId === maId);
export const getProductsByDivision = (division) => products.filter((p) => p.division === division);
export const getProductsByCategory = (category) => products.filter((p) => p.category === category);

export const divisions = [
  'CMF',
  'Endoscopy',
  'Healthcare Systems, MedSurg',
  'Instruments',
  'Medical',
  'Neurovascular',
  'Performance Solutions',
  'Reconstructive',
  'Spine',
  'Sustainability Solutions',
  'Trauma & Extremities',
];

export const categories = [...new Set(products.map((p) => p.category))];

export default products;
