import { executeQuery } from '@/lib/graphql-client';

const useMock = () => process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export async function fetchOrders(filters = {}) {
  if (useMock()) {
    const { orders } = await import('@/lib/mock-data/orders');
    let result = [...orders];
    if (filters.status?.length > 0) result = result.filter((o) => filters.status.includes(o.status));
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter((o) => o.biId.toLowerCase().includes(s) || o.biName?.toLowerCase().includes(s));
    }
    return result;
  }
  const query = 'query { filterPaloozaShopifyOrder(_first: 50) { edges { node { biId biName biDescription biCreatedAt biCompletedAt biConfigurationStateResult { state } pricPrice_TOTAL { amount currency } prPartyCustomer { paName } } } } }';
  const data = await executeQuery(query);
  return data.filterPaloozaShopifyOrder?.edges?.map((e) => e.node) || [];
}

export async function fetchOrder(biId) {
  if (useMock()) {
    const { orders } = await import('@/lib/mock-data/orders');
    return orders.find((o) => o.biId === biId) || null;
  }
  const query = 'query($biId: String!) { getPaloozaShopifyOrder(biId: $biId) { biId biName biDescription biCreatedAt biCompletedAt pricPrice_TOTAL { amount currency } pricPrice_SUBTOTAL { amount currency } pricPrice_TAX { amount currency } prPartyCustomer { paName } prPartyShipTo { paName } hiConsistsOf { edges { node { ... on BusinessInteractionItem { biiId biiName biiQuantity { quQuantity } } } } } } }';
  const data = await executeQuery(query, { biId });
  return data.getPaloozaShopifyOrder;
}
