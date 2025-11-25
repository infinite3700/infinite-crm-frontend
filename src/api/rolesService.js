import { apiMethods } from './apiClient';

export const rolesService = {
    // Get all roles
    getAllRoles: async () => {
        try {
            const response = await apiMethods.get('/settings/roles');

            // The backend returns { success: true, count: number, data: roles[] }
            if (response?.success && response?.data) {
                return response.data;
            }

            return [];
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw new Error(error?.message || 'Failed to fetch roles');
        }
    },

    // Get role by ID
    getRoleById: async (roleId) => {
        try {
            const response = await apiMethods.get(`/settings/roles/${roleId}`);

            if (response?.success && response?.data) {
                return response.data;
            }

            return null;
        } catch (error) {
            console.error('Error fetching role:', error);
            throw new Error(error?.message || 'Failed to fetch role');
        }
    }
};