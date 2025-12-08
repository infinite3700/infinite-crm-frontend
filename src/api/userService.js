import { API_ENDPOINTS } from '../config/api';
import { apiMethods, authHelpers } from './apiClient';

// User service methods using the common API client
export const userService = {
    // Get all users
    getAllUsers: async (params = {}) => {
        try {
            // Check authentication first
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            try {
                // Use the common API method to get users
                const response = await apiMethods.get(API_ENDPOINTS.USERS.GET_ALL, { params });

                // Backend returns { users: [...], pagination: {...} }
                const apiUsers = response.users || [];

                // Get custom users from localStorage
                const customUsers = [];
                // JSON.parse(localStorage.getItem('customUsers') || '[]');

                // Combine API users and custom users, and normalize the data structure
                const allUsers = [...apiUsers, ...customUsers]
                    .filter(user => user && user._id) // Filter out null/undefined users or users without _id
                    .map(user => ({
                        id: user._id || user.id,
                        name: user.name,
                        fullName: user.name, // Add fullName for consistency
                        email: user.email,
                        username: user.username,
                        mobile: user.mobile,
                        role: user.role, // Keep the full role object with _id and name
                        joinDate: user.joinDate,
                        company: user.company || {
                            name: 'N/A',
                            catchPhrase: 'N/A'
                        },
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        // Keep any other properties
                        ...user
                    }));

                return allUsers;
            } catch (apiError) {
                // If API fails due to backend issues, fall back to localStorage only
                console.warn('API call failed, falling back to localStorage:', apiError.message);

                // const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');

                // If no custom users, create some sample data for development

                return [];
            }
        } catch (error) {
            // Handle specific error types
            if (error.status === 401 || error.message.includes('401')) {
                throw new Error('Authentication required');
            }
            if (error.status === 403) {
                throw new Error('Access forbidden');
            }
            if (error.status === 404) {
                throw new Error('Users endpoint not found');
            }
            if (error.status === 500) {
                throw new Error('Server error occurred');
            }

            // Network or other errors
            if (!error.status) {
                throw new Error('Network error - please check your connection');
            }

            // Re-throw with more specific error message
            throw new Error(error.message || 'Failed to fetch users');
        }
    },

    // Get user by ID
    getUserById: async (userId) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const response = await apiMethods.get(API_ENDPOINTS.USERS.GET_BY_ID(userId));

            // Check if response is valid
            if (!response || !response._id) {
                throw new Error('User not found');
            }

            // Normalize the response data
            return {
                id: response._id || response.id,
                name: response.name,
                fullName: response.name,
                email: response.email,
                username: response.username,
                mobile: response.mobile,
                role: response.role, // Keep the full role object with _id and name
                joinDate: response.joinDate,
                ...response
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch user');
        }
    },

    // Get current user profile
    getCurrentUser: async () => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const response = await apiMethods.get(API_ENDPOINTS.USERS.GET_CURRENT);

            // Check if response is valid
            if (!response || !response._id) {
                throw new Error('Current user not found');
            }

            return {
                id: response._id || response.id,
                name: response.name,
                fullName: response.name,
                email: response.email,
                username: response.username,
                mobile: response.mobile,
                role: response.role, // Keep the full role object with _id and name
                joinDate: response.joinDate,
                ...response
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch current user');
        }
    },

    // Create user using auth/register endpoint
    createUser: async (userData) => {
        try {
            // Use the auth/register endpoint for user creation
            const response = await apiMethods.post('/auth/register', {
                name: userData.fullName,
                username: userData.email.split('@')[0], // Generate username from email
                email: userData.email,
                mobile: userData.mobile || '', // Optional mobile
                password: userData.tempPassword,
                role: userData.role || 'employee' // Default to employee if not specified
            });

            // Check if response is valid
            if (!response || !response._id) {
                throw new Error('Failed to create user - invalid response');
            }

            // Return normalized user data
            return {
                id: response._id || response.id,
                name: response.name,
                fullName: response.name,
                email: response.email,
                username: response.username,
                mobile: response.mobile,
                role: response.role?.name || response.role,
                joinDate: response.createdAt,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt,
                ...response
            };
        } catch (error) {
            // Handle specific registration errors
            if (error.message.includes('Email already exists') ||
                error.message.includes('email already registered') ||
                error.message.includes('duplicate')) {
                throw new Error('Email address is already registered');
            }
            if (error.message.includes('Username already exists') ||
                error.message.includes('username already taken')) {
                throw new Error('Username is already taken');
            }
            if (error.message.includes('validation')) {
                throw new Error('Please check your input data');
            }
            if (error.status === 400) {
                throw new Error('Invalid user data provided');
            }
            if (error.status === 401) {
                throw new Error('Authentication required to create users');
            }
            if (error.status === 403) {
                throw new Error('You do not have permission to create users');
            }
            if (error.status === 500) {
                throw new Error('Server error occurred while creating user');
            }

            // Network or other errors
            if (!error.status) {
                throw new Error('Network error - please check your connection');
            }

            throw new Error(error.message || 'Failed to create user');
        }
    },

    // Update user
    updateUser: async (userId, userData) => {
        try {
            // Check if this is a custom user (stored in localStorage)
            const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
            const customUserIndex = customUsers.findIndex(user => user.id === userId);

            if (customUserIndex !== -1) {
                // Update custom user in localStorage
                const updatedUser = {
                    ...customUsers[customUserIndex],
                    name: userData.fullName || userData.name,
                    fullName: userData.fullName || userData.name,
                    email: userData.email,
                    mobile: userData.mobile
                };

                customUsers[customUserIndex] = updatedUser;
                localStorage.setItem('customUsers', JSON.stringify(customUsers));
                return updatedUser;
            }

            // If not a custom user and authenticated, use API
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            const updatePayload = {
                name: userData.fullName || userData.name,
                email: userData.email,
                mobile: userData.mobile,
                role: userData.role, // Add role to the update payload
                // Include password only if it's provided (for edit mode)
                ...(userData.tempPassword && { password: userData.tempPassword })
            };

            console.log('Updating user with payload:', updatePayload);

            const response = await apiMethods.put(API_ENDPOINTS.USERS.UPDATE(userId), updatePayload);

            return {
                id: response._id || response.id,
                name: response.name,
                fullName: response.name,
                email: response.email,
                username: response.username,
                mobile: response.mobile,
                role: response.role?.name || response.role,
                ...response
            };
        } catch (error) {
            throw new Error(error.message || 'Failed to update user');
        }
    },

    // Delete user
    deleteUser: async (userId) => {
        try {
            // Check if this is a custom user (stored in localStorage)
            const customUsers = JSON.parse(localStorage.getItem('customUsers') || '[]');
            const customUserIndex = customUsers.findIndex(user => user.id === userId);

            if (customUserIndex !== -1) {
                // Remove custom user from localStorage
                customUsers.splice(customUserIndex, 1);
                localStorage.setItem('customUsers', JSON.stringify(customUsers));
                return { success: true, id: userId };
            }

            // If not a custom user and authenticated, use API
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            await apiMethods.delete(API_ENDPOINTS.USERS.DELETE(userId));
            return { success: true, id: userId };
        } catch (error) {
            throw new Error(error.message || 'Failed to delete user');
        }
    },

    // Get user posts (if needed)
    getUserPosts: async (userId) => {
        try {
            if (!authHelpers.isAuthenticated()) {
                throw new Error('Authentication required');
            }

            // This would need to be implemented on backend
            const response = await apiMethods.get(`/users/${userId}/posts`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch user posts');
        }
    },
};