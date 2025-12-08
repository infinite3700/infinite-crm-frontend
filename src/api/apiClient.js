import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Create the main API client instance
const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
});

// Token management utilities
export const tokenManager = {
    getToken: () => localStorage.getItem('auth_token'),
    setToken: (token) => localStorage.setItem('auth_token', token),
    removeToken: () => localStorage.removeItem('auth_token'),
    isAuthenticated: () => !!localStorage.getItem('auth_token'),
};

// User data management utilities
export const userManager = {
    getUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    removeUser: () => localStorage.removeItem('user'),
};

// Request interceptor - automatically add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log requests in development
        if (import.meta.env.DEV) {
            // API request logging removed
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle common response scenarios
apiClient.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (import.meta.env.DEV) {
            // API response logging removed
        }

        return response;
    },
    (error) => {
        // Handle common error scenarios
        const { response, request, message } = error;

        if (response) {
            // Server responded with error status
            const { status, data } = response;

            // Log the error in development
            if (import.meta.env.DEV) {
                // API error logging removed
            }

            // Extract error message from various possible response formats
            let errorMessage = data?.message || data?.error || data?.msg;

            // Handle different status codes
            switch (status) {
                case 400:
                    break;

                case 401:
                    // Unauthorized - clear auth data and redirect to login
                    tokenManager.removeToken();
                    userManager.removeUser();

                    // Only redirect if not already on login page
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    errorMessage = errorMessage || 'Authentication failed';
                    break;

                case 403:
                    errorMessage = errorMessage || 'Access forbidden';
                    break;

                case 404:
                    errorMessage = errorMessage || 'Resource not found';
                    break;

                case 409:
                    break;

                case 422:
                    errorMessage = errorMessage || 'Validation failed';
                    break;

                case 500:
                    errorMessage = errorMessage || 'Internal server error';
                    break;

                default:
                    errorMessage = errorMessage || `HTTP ${status} Error`;
            }

            // Return formatted error with the actual message from backend
            return Promise.reject(new Error(errorMessage));

        } else if (request) {
            // Request was made but no response received (network error)
            return Promise.reject(new Error('Network error - please check your connection'));

        } else {
            // Something else happened in setting up the request
            return Promise.reject(new Error(message || 'Request failed'));
        }
    }
);

// Helper function to check response status
const checkResponseStatus = (responseData) => {
    // Check if backend returned status: false (error response with 200 status code)
    if (responseData && typeof responseData.status === 'boolean' && responseData.status === false) {
        // Extract error message from various possible fields
        const errorMessage = responseData.message || responseData.error || responseData.msg || 'Request failed';
        throw new Error(errorMessage);
    }
    return responseData;
};

// Generic API methods
export const apiMethods = {
    // GET request
    get: async (url, config = {}) => {
        const response = await apiClient.get(url, config);
        return checkResponseStatus(response.data);
    },

    // POST request
    post: async (url, data = {}, config = {}) => {
        const response = await apiClient.post(url, data, config);
        return checkResponseStatus(response.data);
    },

    // PUT request
    put: async (url, data = {}, config = {}) => {
        const response = await apiClient.put(url, data, config);
        return checkResponseStatus(response.data);
    },

    // PATCH request
    patch: async (url, data = {}, config = {}) => {
        const response = await apiClient.patch(url, data, config);
        return checkResponseStatus(response.data);
    },

    // DELETE request
    delete: async (url, config = {}) => {
        const response = await apiClient.delete(url, config);
        return checkResponseStatus(response.data);
    },
};

// Generic CRUD operations
export const crudService = {
    // Get all items with optional query parameters
    getAll: async (endpoint, params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return apiMethods.get(url);
    },

    // Get single item by ID
    getById: async (endpoint, id) => {
        return apiMethods.get(`${endpoint}/${id}`);
    },

    // Create new item
    create: async (endpoint, data) => {
        return apiMethods.post(endpoint, data);
    },

    // Update existing item
    update: async (endpoint, id, data) => {
        return apiMethods.put(`${endpoint}/${id}`, data);
    },

    // Partially update existing item
    partialUpdate: async (endpoint, id, data) => {
        return apiMethods.patch(`${endpoint}/${id}`, data);
    },

    // Delete item
    delete: async (endpoint, id) => {
        return apiMethods.delete(`${endpoint}/${id}/hard`);
    },

    // delete lead
    deleteLead: async (endpoint, id) => {
        return apiMethods.delete(`${endpoint}/${id}`);
    }
};

// Authentication helpers
export const authHelpers = {
    // Set authentication data
    setAuthData: (token, user) => {
        tokenManager.setToken(token);
        userManager.setUser(user);
    },

    // Clear authentication data
    clearAuthData: () => {
        tokenManager.removeToken();
        userManager.removeUser();
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return tokenManager.isAuthenticated() && userManager.getUser();
    },

    // Get current user
    getCurrentUser: () => {
        return userManager.getUser();
    },
};

// Export the main API client for advanced usage
export default apiClient;