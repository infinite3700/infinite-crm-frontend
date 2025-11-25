import { crudService, authHelpers, apiMethods } from './apiClient';
import { API_ENDPOINTS, API_CONFIG } from '../config/api';

// Settings service using the common API client
export const settingsService = {
    // Role management
    roles: {
        getAll: async (params = {}) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.getAll(API_ENDPOINTS.SETTINGS.ROLES.BASE, params);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch roles');
            }
        },

        getById: async (roleId) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.getById(API_ENDPOINTS.SETTINGS.ROLES.BASE, roleId);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch role');
            }
        },

        create: async (roleData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.create(API_ENDPOINTS.SETTINGS.ROLES.BASE, roleData);
            } catch (error) {
                throw new Error(error.message || 'Failed to create role');
            }
        },

        update: async (roleId, roleData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.update(API_ENDPOINTS.SETTINGS.ROLES.BASE, roleId, roleData);
            } catch (error) {
                throw new Error(error.message || 'Failed to update role');
            }
        },

        delete: async (roleId) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.delete(API_ENDPOINTS.SETTINGS.ROLES.BASE, roleId);
            } catch (error) {
                throw new Error(error.message || 'Failed to delete role');
            }
        },
    },

    // Permission management
    permissions: {
        getAll: async (params = {}) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.getAll(API_ENDPOINTS.SETTINGS.PERMISSIONS.BASE, params);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch permissions');
            }
        },

        getById: async (permissionId) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.getById(API_ENDPOINTS.SETTINGS.PERMISSIONS.BASE, permissionId);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch permission');
            }
        },

        create: async (permissionData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.create(API_ENDPOINTS.SETTINGS.PERMISSIONS.BASE, permissionData);
            } catch (error) {
                throw new Error(error.message || 'Failed to create permission');
            }
        },

        update: async (permissionId, permissionData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.update(API_ENDPOINTS.SETTINGS.PERMISSIONS.BASE, permissionId, permissionData);
            } catch (error) {
                throw new Error(error.message || 'Failed to update permission');
            }
        },

        delete: async (permissionId) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.delete(API_ENDPOINTS.SETTINGS.PERMISSIONS.BASE, permissionId);
            } catch (error) {
                throw new Error(error.message || 'Failed to delete permission');
            }
        },
    },

    // Product management
    products: {
        getAll: async (params = {}) => {
            try {
                if (!authHelpers.isAuthenticated()) {
                    throw new Error('Authentication required');
                }
                return await crudService.getAll(API_ENDPOINTS.SETTINGS.PRODUCTS.BASE, params);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch products');
            }
        },

        getById: async (productId) => {
            try {
                if (!authHelpers.isAuthenticated()) {
                    throw new Error('Authentication required');
                }
                return await crudService.getById(API_ENDPOINTS.SETTINGS.PRODUCTS.BASE, productId);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch product');
            }
        },

        create: async (productData) => {
            try {
                if (!authHelpers.isAuthenticated()) {
                    throw new Error('Authentication required');
                }
                return await crudService.create(API_ENDPOINTS.SETTINGS.PRODUCTS.BASE, productData);
            } catch (error) {
                throw new Error(error.message || 'Failed to create product');
            }
        },

        update: async (productId, productData) => {
            try {
                if (!authHelpers.isAuthenticated()) {
                    throw new Error('Authentication required');
                }
                return await crudService.update(API_ENDPOINTS.SETTINGS.PRODUCTS.BASE, productId, productData);
            } catch (error) {
                throw new Error(error.message || 'Failed to update product');
            }
        },

        delete: async (productId) => {
            try {
                if (!authHelpers.isAuthenticated()) {
                    throw new Error('Authentication required');
                }
                return await crudService.delete(API_ENDPOINTS.SETTINGS.PRODUCTS.BASE, productId);
            } catch (error) {
                throw new Error(error.message || 'Failed to delete product');
            }
        },
    },

    // Lead stage management
    leadStages: {
        getAll: async (params = {}) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.getAll(API_ENDPOINTS.SETTINGS.LEAD_STAGES.BASE, params);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch lead stages');
            }
        },

        getById: async (stageId) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.getById(API_ENDPOINTS.SETTINGS.LEAD_STAGES.BASE, stageId);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch lead stage');
            }
        },

        create: async (stageData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.create(API_ENDPOINTS.SETTINGS.LEAD_STAGES.BASE, stageData);
            } catch (error) {
                throw new Error(error.message || 'Failed to create lead stage');
            }
        },

        update: async (stageId, stageData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.update(API_ENDPOINTS.SETTINGS.LEAD_STAGES.BASE, stageId, stageData);
            } catch (error) {
                throw new Error(error.message || 'Failed to update lead stage');
            }
        },

        delete: async (stageId) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.delete(API_ENDPOINTS.SETTINGS.LEAD_STAGES.BASE, stageId);
            } catch (error) {
                throw new Error(error.message || 'Failed to delete lead stage');
            }
        },
    },

    // State/Geographic management
    states: {
        getAll: async () => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }

                // Try the original GET_ALL endpoint which might include IDs
                console.log('🔄 Trying GET_ALL endpoint for full objects...');
                try {
                    const result = await apiMethods.get(API_ENDPOINTS.SETTINGS.STATES.GET_ALL);
                    console.log('✅ GET_ALL result:', result);
                    if (result && result[0] && result[0]._id) {
                        console.log('✅ GET_ALL has IDs, using this endpoint');
                        return result;
                    }
                } catch {
                    console.log('⚠️ GET_ALL failed, falling back to GET_STATES');
                }

                // Fallback to GET_STATES
                return await apiMethods.get(API_ENDPOINTS.SETTINGS.STATES.GET_STATES);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch states');
            }
        },

        getEnums: async () => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                // Get state list and extract unique state names for enums
                const states = await apiMethods.get(API_ENDPOINTS.SETTINGS.STATES.GET_STATES);
                // Extract unique state names from the response
                const stateNames = [...new Set(states.map(state => state.state))].filter(Boolean);
                return { state: stateNames };
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch state enums');
            }
        },

        getDistrictEnums: async (state = 'all') => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }

                if (state === 'all') {
                    // Get all districts
                    return await apiMethods.get(API_ENDPOINTS.SETTINGS.STATES.GET_ALL_DISTRICTS);
                } else {
                    // Get districts for specific state
                    return await apiMethods.get(API_ENDPOINTS.SETTINGS.STATES.GET_DISTRICTS_BY_STATE(state));
                }
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch district enums');
            }
        },

        getDistricts: async (stateFilter = null) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }

                if (stateFilter) {
                    // Get districts for specific state
                    return await apiMethods.get(API_ENDPOINTS.SETTINGS.STATES.GET_DISTRICTS_BY_STATE(stateFilter));
                } else {
                    // Get all districts
                    return await apiMethods.get(API_ENDPOINTS.SETTINGS.STATES.GET_ALL_DISTRICTS);
                }
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch districts');
            }
        },

        create: async (stateData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }

                // New API structure: POST /api/settings/state with body { state: "StateName" }
                const body = {
                    state: stateData.state
                };

                // Include status if provided
                if ('status' in stateData) {
                    body.status = stateData.status;
                }

                return await apiMethods.post(API_ENDPOINTS.SETTINGS.STATES.CREATE, body);
            } catch (error) {
                throw new Error(error.message || 'Failed to create state');
            }
        },

        updateStatus: async (stateId, status) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }

                // New API structure: PUT /api/settings/state/{id} with body { status: true/false }
                const body = { status };

                return await apiMethods.put(API_ENDPOINTS.SETTINGS.STATES.UPDATE(stateId), body);
            } catch (error) {
                throw new Error(error.message || 'Failed to update state status');
            }
        },

        updateState: async (stateData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }

                // New API structure: PUT /api/settings/state?state=StateName with body { state: "NewStateName", status: true }
                const queryParam = stateData.originalState || stateData.state;
                const endpoint = `${API_ENDPOINTS.SETTINGS.STATES.BASE}/${encodeURIComponent(queryParam)}`;

                const body = {
                    state: stateData.state
                };

                // Include status if provided
                if ('status' in stateData) {
                    body.status = stateData.status;
                }

                console.log('🔄 Updating state with query param API:', { endpoint, body });
                return await apiMethods.post(endpoint, body);
            } catch (error) {
                throw new Error(error.message || 'Failed to update state');
            }
        },

        getById: async (stateId) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.getById(API_ENDPOINTS.SETTINGS.STATES.BASE, stateId);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch state');
            }
        },

        update: async (itemData, isDistrict = false) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }

                if (isDistrict) {
                    // For districts, use MongoDB ID approach: PUT /api/settings/state/{id}
                    if (!itemData._id) {
                        throw new Error('District ID is required for update');
                    }

                    const body = {
                        state: itemData.state,
                        district: itemData.district
                    };

                    // Include status if provided
                    if ('status' in itemData) {
                        body.status = itemData.status;
                    }

                    console.log('🔄 Updating district with ID API:', { id: itemData._id, body });
                    return await apiMethods.put(API_ENDPOINTS.SETTINGS.STATES.UPDATE(itemData._id), body);
                } else {
                    // For states, use query parameter approach: PUT /api/settings/state?state=StateName
                    const queryParam = itemData.originalState || itemData.state;
                    const endpoint = `${API_ENDPOINTS.SETTINGS.STATES.BASE}?state=${encodeURIComponent(queryParam)}`;

                    const body = {
                        state: itemData.state
                    };

                    // Include status if provided
                    if ('status' in itemData) {
                        body.status = itemData.status;
                    }

                    console.log('🔄 Updating state with query param API:', { endpoint, body });
                    return await apiMethods.put(endpoint, body);
                }
            } catch (error) {
                throw new Error(error.message || 'Failed to update item');
            }
        },

        delete: async (stateId) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }
                return await crudService.delete(API_ENDPOINTS.SETTINGS.STATES.BASE, stateId);
            } catch (error) {
                throw new Error(error.message || 'Failed to delete state');
            }
        },

        // District management functions - using the same backend endpoint as states
        createDistrict: async (districtData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }

                // New API structure: POST /api/settings/state with body { state: "StateName", district: "DistrictName" }
                const body = {
                    state: districtData.state,
                    district: districtData.district
                };

                // Include status if provided
                if ('status' in districtData) {
                    body.status = districtData.status;
                }

                return await apiMethods.post(API_ENDPOINTS.SETTINGS.STATES.CREATE, body);
            } catch (error) {
                throw new Error(error.message || 'Failed to create district');
            }
        },

        updateDistrict: async (districtId, districtData) => {
            try {
                // Note: Temporarily removing auth requirement for testing
                // if (!authHelpers.isAuthenticated()) {
                //     throw new Error('Authentication required');
                // }

                // API structure: PUT /api/settings/state/{objectId} with body
                // Example: PUT http://localhost:3000/api/settings/state/68e23f01c344868037baf5a4
                const body = {
                    state: districtData.state,
                    district: districtData.district
                };

                // Include status if provided
                if ('status' in districtData) {
                    body.status = districtData.status;
                }

                console.log('🔄 Updating district with ObjectId API:', {
                    objectId: districtId,
                    endpoint: API_ENDPOINTS.SETTINGS.STATES.UPDATE(districtId),
                    body
                });

                return await apiMethods.put(API_ENDPOINTS.SETTINGS.STATES.UPDATE(districtId), body);
            } catch (error) {
                throw new Error(error.message || 'Failed to update district');
            }
        },
    },

    // Campaign management
    campaigns: {
        getAll: async (params = {}) => {
            try {
                return await crudService.getAll(API_ENDPOINTS.SETTINGS.CAMPAIGNS.BASE, params);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch campaigns');
            }
        },

        getById: async (campaignId) => {
            try {
                return await crudService.getById(API_ENDPOINTS.SETTINGS.CAMPAIGNS.BASE, campaignId);
            } catch (error) {
                throw new Error(error.message || 'Failed to fetch campaign');
            }
        },

        create: async (campaignData) => {
            try {
                return await crudService.create(API_ENDPOINTS.SETTINGS.CAMPAIGNS.BASE, campaignData);
            } catch (error) {
                throw new Error(error.message || 'Failed to create campaign');
            }
        },

        update: async (campaignId, campaignData) => {
            try {
                return await crudService.update(API_ENDPOINTS.SETTINGS.CAMPAIGNS.BASE, campaignId, campaignData);
            } catch (error) {
                throw new Error(error.message || 'Failed to update campaign');
            }
        },

        delete: async (campaignId) => {
            try {
                return await crudService.delete(API_ENDPOINTS.SETTINGS.CAMPAIGNS.BASE, campaignId);
            } catch (error) {
                throw new Error(error.message || 'Failed to delete campaign');
            }
        },
    },
};