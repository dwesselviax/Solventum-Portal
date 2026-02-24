const useMock = () => process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function fetchProducts(filters = {}) {
  if (useMock()) {
    const { products } = await import('@/lib/mock-data/products');
    let result = [...products];
    if (filters.division?.length > 0) result = result.filter((p) => filters.division.includes(p.division));
    if (filters.category?.length > 0) result = result.filter((p) => filters.category.includes(p.category));
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter((p) => p.maName.toLowerCase().includes(s) || p.maDescription?.toLowerCase().includes(s));
    }
    return result;
  }
  return [];
}

export async function fetchProduct(maId) {
  if (useMock()) {
    const { products } = await import('@/lib/mock-data/products');
    return products.find((p) => p.maId === maId) || null;
  }
  return null;
}
