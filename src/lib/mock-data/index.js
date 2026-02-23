// Solventum B2B Portal — Mock Data Index
// Re-exports all mock data modules for centralized access

export { users, getCurrentUser } from './users';
export { products, getProductById, getProductsByDivision, getProductsByCategory, divisions, categories } from './products';
export { orders, getOrderById, getOrdersByStatus, getOrdersByCustomer, orderStatuses } from './orders';
export { invoices, getInvoiceById, getInvoicesByStatus, getInvoicesByCustomer, invoiceStatuses } from './invoices';
export { quotes, getQuoteById, getQuotesByStatus, getQuotesByCustomer, quoteStatuses } from './quotes';
export { subscriptions, getSubscriptionById, getSubscriptionsByStatus, getSubscriptionsByCustomer, subscriptionStatuses } from './subscriptions';
export { shipments, getShipmentById, getShipmentsByOrder, getShipmentsByStatus, shipmentStatuses } from './shipments';
export { consignment, getConsignmentById, getConsignmentByFacility, getConsignmentByStatus, getConsignmentByProduct, consignmentStatuses } from './consignment';
export { assets, getAssetById, getAssetsByOwner, getAssetsByStatus, getAssetsByProduct, assetStatuses } from './assets';
export { returns, getReturnById, getReturnsByStatus, getReturnsByCustomer, returnStatuses } from './returns';
export { serviceRequests, getServiceRequestById, getServiceRequestsByStatus, getServiceRequestsByCustomer, serviceRequestStatuses } from './service-requests';
export { documentation, getDocumentById, getDocumentsByProduct, getDocumentsByType, getDocumentsByDivision, documentTypes } from './documentation';
export { training, getTrainingById, getTrainingByProduct, getTrainingByType, getTrainingByDivision, trainingTypes } from './training';
export { parties, getPartyById, getPartiesByType, partyTypes } from './parties';
export { contracts, getContractById, getContractsByCustomer, getActiveContracts, contractStatuses } from './contracts';
export { promotions, getPromotionById, getActivePromotions, getPromotionsByProduct } from './promotions';
export { samples, sampleableProducts, getSampleById, getSamplesByStatus, getSamplesByCustomer, sampleStatuses } from './samples';
export { treatmentPlans, getTreatmentPlanById, getTreatmentPlansByOrg, getTreatmentPlansByStatus, treatmentPlanStatuses } from './treatment-plans';
export { notifications, getNotificationsByRole, getUnreadCount } from './notifications';
export { quoteTimelineEvents, getTimelineEventsForQuote } from './quote-timeline-events';
export { seedComments, getCommentsByQuoteId } from './comments';
export { seedMembers, getMembersByOrganization, getMemberById, ACCESS_TYPES, NOTIFICATION_TYPES, NOTIFICATION_CHANNELS } from './account-members';
export { shipToAddresses, getAddressesByCustomerId } from './ship-to-addresses';
export { marketingMaterials, materialTypes, materialChannels, getMaterialsByType, getMaterialsByChannel, searchMaterials } from './marketing-materials';
export { apiPartners, getPartnerById, getPartnersByStatus, API_PERMISSIONS } from './api-partners';
