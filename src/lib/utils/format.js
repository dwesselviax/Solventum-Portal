export function formatCurrency(amount, currency = 'USD') {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString, options = {}) {
  if (!dateString) return '—';
  const defaults = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', { ...defaults, ...options }).format(new Date(dateString));
}

export function formatDateTime(dateString) {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateString));
}

export function formatNumber(num) {
  if (num == null) return '—';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCompactNumber(num) {
  if (num == null) return '—';
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}

export function getStatusColor(status) {
  const s = (status || '').toLowerCase();
  if (['active', 'confirmed', 'delivered', 'paid', 'completed', 'processed', 'platinum', 'gold'].includes(s)) return 'success';
  if (['pending', 'draft', 'paused', 'submitted', 'planning', 'bronze', 'on hold'].includes(s)) return 'warning';
  if (['error', 'expired', 'cancelled', 'overdue', 'failed', 'denied'].includes(s)) return 'error';
  if (['in transit', 'in progress', 'scheduled', 'approved', 'open', 'shipped', 'silver'].includes(s)) return 'info';
  return 'neutral';
}
