const useMock = () => process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function fetchInvoices(filters = {}) {
  if (useMock()) {
    const { invoices } = await import('@/lib/mock-data/invoices');
    let result = [...invoices];
    if (filters.status?.length > 0) result = result.filter((i) => filters.status.includes(i.status));
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter((i) => i.biId.toLowerCase().includes(s) || i.invoiceNumber?.toLowerCase().includes(s));
    }
    return result;
  }
  return [];
}

export async function fetchInvoice(biId) {
  if (useMock()) {
    const { invoices } = await import('@/lib/mock-data/invoices');
    return invoices.find((i) => i.biId === biId) || null;
  }
  return null;
}
