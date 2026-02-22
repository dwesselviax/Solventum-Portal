import { allProducts, getProductById, getProductsByCategory, productCategories } from './products/index';

export const products = allProducts;
export const divisions = productCategories;
export const categories = productCategories;
export { getProductById, getProductsByCategory };
export const getProductsByDivision = getProductsByCategory;
export default products;
