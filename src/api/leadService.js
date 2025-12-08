import { API_ENDPOINTS } from '../config/api';
import { apiMethods, crudService } from './apiClient';

// Lead service using the common API client
export const leadService = {
  // Get all leads with optional filters
  getAllLeads: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.LEADS.GET_ALL, { params });
      
      // Normalize response structure
      return Array.isArray(response) ? response : response.leads || response.data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch leads');
    }
  },

  getMyLeads: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.LEADS.MY_LEAD, { params });
      
      // Normalize response structure
      return Array.isArray(response) ? response : response.leads || response.data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch leads');
    }
  },

  // Get follow-up leads
  getFollowUpLeads: async (params = {}) => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.LEADS.GET_FOLLOW_UP, { params });
      
      // Normalize response structure
      return Array.isArray(response) ? response : response.leads || response.data || [];
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch follow-up leads');
    }
  },

  // Get lead counts
  getLeadCounts: async () => {
    try {
      const response = await apiMethods.get(API_ENDPOINTS.LEADS.GET_COUNT);
      return response || { assignedCount: 0, followUpCount: 0 };
    } catch (error) {
      console.error('Failed to fetch lead counts:', error);
      return { assignedCount: 0, followUpCount: 0 };
    }
  },

  // Get lead by ID
  getLeadById: async (leadId) => {
    try {
      return await crudService.getById(API_ENDPOINTS.LEADS.BASE, leadId);
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch lead');
    }
  },

  // Create new lead
  createLead: async (leadData) => {
    try {
      return await crudService.create(API_ENDPOINTS.LEADS.BASE, leadData);
    } catch (error) {
      throw new Error(error.message || 'Failed to create lead');
    }
  },

  // Update lead
  updateLead: async (leadId, leadData) => {
    try {
      return await crudService.update(API_ENDPOINTS.LEADS.BASE, leadId, leadData);
    } catch (error) {
      throw new Error(error.message || 'Failed to update lead');
    }
  },

  // Delete lead
  deleteLead: async (leadId) => {
    try {
      return await crudService.deleteLead(API_ENDPOINTS.LEADS.BASE, leadId);
    } catch (error) {
      throw new Error(error.message || 'Failed to delete lead');
    }
  },

  // Update lead stage
  updateLeadStage: async (leadId, stageId) => {
    try {
      return await apiMethods.put(API_ENDPOINTS.LEADS.UPDATE_STAGE(leadId), { stage: stageId });
    } catch (error) {
      throw new Error(error.message || 'Failed to update lead stage');
    }
  },

  // Assign lead to user
  assignLead: async (leadId, userId) => {
    try {
      return await apiMethods.put(API_ENDPOINTS.LEADS.ASSIGN(leadId), { assignTo: userId });
    } catch (error) {
      throw new Error(error.message || 'Failed to assign lead');
    }
  },

  // Convert lead
  convertLead: async (leadId, conversionData = {}) => {
    try {
      return await apiMethods.post(API_ENDPOINTS.LEADS.CONVERT(leadId), conversionData);
    } catch (error) {
      throw new Error(error.message || 'Failed to convert lead');
    }
  },
};

