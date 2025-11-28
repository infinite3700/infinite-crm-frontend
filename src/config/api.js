// API Configuration
export const API_CONFIG = {
    // Backend server URL - update this based on your backend server configuration
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

    // Request timeout in milliseconds
    TIMEOUT: 10000,

    // Default headers
    HEADERS: {
        'Content-Type': 'application/json',
    }
};

// API Endpoints - organized by feature
export const API_ENDPOINTS = {
    // Authentication endpoints
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
    },

    // User management endpoints
    USERS: {
        BASE: '/users',
        GET_ALL: '/users',
        GET_BY_ID: (id) => `/users/${id}`,
        GET_CURRENT: '/users/profile',
        CREATE: '/users',
        UPDATE: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
        UPLOAD_AVATAR: (id) => `/users/${id}/avatar`,
        CHANGE_PASSWORD: (id) => `/users/${id}/password`,
    },

    // Task management endpoints
    TASKS: {
        BASE: '/tasks',
        GET_ALL: '/tasks',
        GET_BY_ID: (id) => `/tasks/${id}`,
        CREATE: '/tasks',
        UPDATE: (id) => `/tasks/${id}`,
        DELETE: (id) => `/tasks/${id}`,
        UPDATE_STATUS: (id) => `/tasks/${id}/status`,
        ASSIGN: (id) => `/tasks/${id}/assign`,
        GET_BY_USER: (userId) => `/tasks/user/${userId}`,
    },

    // Lead management endpoints
    LEADS: {
        BASE: '/leads',
        GET_ALL: '/leads',
        GET_FOLLOW_UP: '/leads/follow-up',
        GET_COUNT: '/leads/count',
        MY_LEAD: '/leads/my-leads',
        GET_BY_ID: (id) => `/leads/${id}`,
        CREATE: '/leads',
        UPDATE: (id) => `/leads/${id}`,
        DELETE: (id) => `/leads/${id}`,
        UPDATE_STAGE: (id) => `/leads/${id}/stage`,
        ASSIGN: (id) => `/leads/${id}/assign`,
        CONVERT: (id) => `/leads/${id}/convert`,
    },

    // Settings endpoints
    SETTINGS: {
        // Roles and Permissions
        ROLES: {
            BASE: '/settings/roles',
            GET_ALL: '/settings/roles',
            GET_BY_ID: (id) => `/settings/roles/${id}`,
            CREATE: '/settings/roles',
            UPDATE: (id) => `/settings/roles/${id}`,
            DELETE: (id) => `/settings/roles/${id}`,
        },

        PERMISSIONS: {
            BASE: '/settings/permissions',
            GET_ALL: '/settings/permissions',
            GET_BY_ID: (id) => `/settings/permissions/${id}`,
            CREATE: '/settings/permissions',
            UPDATE: (id) => `/settings/permissions/${id}`,
            DELETE: (id) => `/settings/permissions/${id}`,
        },

        // Products
        PRODUCTS: {
            BASE: '/settings/products',
            GET_ALL: '/settings/products',
            GET_BY_ID: (id) => `/settings/products/${id}`,
            CREATE: '/settings/products',
            UPDATE: (id) => `/settings/products/${id}`,
            DELETE: (id) => `/settings/products/${id}`,

            // Product Categories
            CATEGORIES: {
                BASE: '/settings/products/category',
                GET_ALL: '/settings/products/category',
                CREATE: '/settings/products/category',
                UPDATE: '/settings/products/category', // Backend uses POST for both create and update
            },
        },

        // Lead Stages
        LEAD_STAGES: {
            BASE: '/settings/lead-stages',
            GET_ALL: '/settings/lead-stages',
            GET_BY_ID: (id) => `/settings/lead-stages/${id}`,
            CREATE: '/settings/lead-stages',
            UPDATE: (id) => `/settings/lead-stages/${id}`,
            DELETE: (id) => `/settings/lead-stages/${id}`,
        },

        // Geographic/State settings
        STATES: {
            BASE: '/settings/state',
            GET_ALL: '/settings/state',
            GET_BY_ID: (id) => `/settings/state/${id}`,
            CREATE: '/settings/state',
            UPDATE: (id) => `/settings/state/${id}`,
            DELETE: (id) => `/settings/state/${id}`,
            // New API structure
            GET_STATES: '/settings/state',
            GET_ALL_DISTRICTS: '/settings/state?district=all',
            GET_DISTRICTS_BY_STATE: (state) => `/settings/state?state=${state}`,
        },

        // Campaigns
        CAMPAIGNS: {
            BASE: '/settings/campaigns',
            GET_ALL: '/settings/campaigns',
            GET_BY_ID: (id) => `/settings/campaigns/${id}`,
            CREATE: '/settings/campaigns',
            UPDATE: (id) => `/settings/campaigns/${id}`,
            DELETE: (id) => `/settings/campaigns/${id}`,
        },
    },

    // Dashboard and analytics
    DASHBOARD: {
        STATS: '/dashboard/stats',
        RECENT_ACTIVITIES: '/dashboard/activities',
        CHARTS: '/dashboard/charts',
        REPORTS: '/dashboard/reports',
    },

    // File upload endpoints
    UPLOADS: {
        AVATAR: '/uploads/avatar',
        DOCUMENTS: '/uploads/documents',
        BULK_IMPORT: '/uploads/bulk-import',
    },
};