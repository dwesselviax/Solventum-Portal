const useMock = () => process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function fetchQuotes(filters = {}) {
  if (useMock()) {
    const { quotes } = await import('@/lib/mock-data/quotes');
    let result = [...quotes];
    if (filters.status?.length > 0) result = result.filter((q) => filters.status.includes(q.status));
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter((q) => q.biId.toLowerCase().includes(s) || q.biName?.toLowerCase().includes(s));
    }
    return result;
  }
  return [];
}

export async function fetchQuote(biId) {
  if (useMock()) {
    const { quotes } = await import('@/lib/mock-data/quotes');
    return quotes.find((q) => q.biId === biId) || null;
  }
  return null;
}
