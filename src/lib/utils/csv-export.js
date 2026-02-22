/**
 * Export product price list as CSV and trigger browser download.
 * Supports optional contract pricing columns.
 */
export function exportProductsPriceListCSV(products, customerName, options = {}) {
  const { contractPricing, tierInfo } = options;

  const headers = contractPricing
    ? ['Product ID', 'Product Name', 'Category', 'Subcategory', 'SKU', 'List Price', 'Contract Price', 'Tier', 'Availability']
    : ['Product ID', 'Product Name', 'Category', 'Subcategory', 'SKU', 'List Price', 'Your Price', 'Availability'];

  const escapeField = (value) => {
    const str = value == null ? '' : String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const rows = products.map((p) => {
    const contractPrice = contractPricing?.[p.maId];
    if (contractPricing) {
      return [
        p.maId,
        p.maName,
        p.division,
        p.category,
        p.sku,
        p.listPrice != null ? p.listPrice.toFixed(2) : '',
        contractPrice != null ? contractPrice.toFixed(2) : (p.price != null ? p.price.toFixed(2) : ''),
        tierInfo || '',
        p.availability || '',
      ].map(escapeField).join(',');
    }
    return [
      p.maId,
      p.maName,
      p.division,
      p.category,
      p.sku,
      p.listPrice != null ? p.listPrice.toFixed(2) : '',
      p.price != null ? p.price.toFixed(2) : '',
      p.availability || '',
    ].map(escapeField).join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().slice(0, 10);
  const safeName = (customerName || 'Customer').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Price_List_${safeName}_${date}.csv`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
