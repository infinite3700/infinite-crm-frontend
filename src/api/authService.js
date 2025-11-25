import { apiMethods, authHelpers } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Authentication service using the common API client
export const authService = {
    // Login user
    login: async (credentials) => {
        try {
            const response = await apiMethods.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

            // Store authentication data using the helper
            authHelpers.setAuthData(response.token, {
                id: response._id,
                username: response.username,
                email: response.email,
                name: response.name,
                mobile: response.mobile,
                role: response.role,
                joinDate: response.joinDate,
            });

            return response;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    },

    // Register user
    register: async (userData) => {
        try {
            const response = await apiMethods.post(API_ENDPOINTS.AUTH.REGISTER, userData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    },

    // Logout user
    logout: async () => {
        try {
            // Call logout endpoint if it exists
            // await apiMethods.post(API_ENDPOINTS.AUTH.LOGOUT);

            // Clear authentication data
            authHelpers.clearAuthData();

            return { success: true };
        } catch (error) {
            // Even if API call fails, clear local auth data
            authHelpers.clearAuthData();
            throw new Error(error.message || 'Logout failed');
        }
    },

    // Refresh token
    refreshToken: async () => {
        try {
            const response = await apiMethods.post(API_ENDPOINTS.AUTH.REFRESH);

            // Update stored token
            if (response.token) {
                authHelpers.setAuthData(response.token, authHelpers.getCurrentUser());
            }

            return response;
        } catch (error) {
            // If refresh fails, clear auth data and redirect to login
            authHelpers.clearAuthData();
            throw new Error(error.message || 'Token refresh failed');
        }
    },

    // Forgot password
    forgotPassword: async (email) => {
        try {
            const response = await apiMethods.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to send password reset email');
        }
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        try {
            const response = await apiMethods.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                token,
                password: newPassword
            });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to reset password');
        }
    },

    // Verify email
    verifyEmail: async (token) => {
        try {
            const response = await apiMethods.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Email verification failed');
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return authHelpers.isAuthenticated();
    },

    // Get current user
    getCurrentUser: () => {
        return authHelpers.getCurrentUser();
    },

    // Clear authentication data
    clearAuth: () => {
        authHelpers.clearAuthData();
    },
};