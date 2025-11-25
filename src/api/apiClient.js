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
            console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - handle common response scenarios
apiClient.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (import.meta.env.DEV) {
            console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
        }

        return response;
    },
    (error) => {
        // Handle common error scenarios
        const { response, request, message } = error;

        if (response) {
            // Server responded with error status
            const { status, data } = response;

            switch (status) {
                case 401:
                    // Unauthorized - clear auth data and redirect to login
                    console.warn('🔐 Authentication failed - redirecting to login');
                    tokenManager.removeToken();
                    userManager.removeUser();

                    // Only redirect if not already on login page
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    console.error('🚫 Access forbidden');
                    break;

                case 404:
                    console.error('🔍 Resource not found');
                    break;

                case 422:
                    console.error('📝 Validation errors:', data);
                    break;

                case 500:
                    console.error('🔥 Server error');
                    break;

                default:
                    console.error(`❌ HTTP ${status}:`, data?.message || 'Unknown error');
            }

            // Return formatted error
            return Promise.reject(new Error(data?.message || `HTTP ${status} Error`));

        } else if (request) {
            // Network error
            console.error('🌐 Network Error:', message);
            return Promise.reject(new Error('Network error - please check your connection'));

        } else {
            // Something else happened
            console.error('⚠️ Request Error:', message);
            return Promise.reject(new Error(message || 'Request failed'));
        }
    }
);

// Generic API methods
export const apiMethods = {
    // GET request
    get: async (url, config = {}) => {
        const response = await apiClient.get(url, config);
        return response.data;
    },

    // POST request
    post: async (url, data = {}, config = {}) => {
        const response = await apiClient.post(url, data, config);
        return response.data;
    },

    // PUT request
    put: async (url, data = {}, config = {}) => {
        const response = await apiClient.put(url, data, config);
        return response.data;
    },

    // PATCH request
    patch: async (url, data = {}, config = {}) => {
        const response = await apiClient.patch(url, data, config);
        return response.data;
    },

    // DELETE request
    delete: async (url, config = {}) => {
        const response = await apiClient.delete(url, config);
        return response.data;
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
        return apiMethods.delete(`${endpoint}/${id}`);
    },
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