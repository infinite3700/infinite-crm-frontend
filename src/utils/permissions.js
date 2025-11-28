// Permission constants - Simplified CRUD-based permissions
export const PERMISSIONS = {
    // Leads
    LEADS_READ: 'leads.read',
    LEADS_CREATE: 'leads.create',
    LEADS_UPDATE: 'leads.update',
    LEADS_DELETE: 'leads.delete',

    // Users
    USERS_READ: 'users.read',
    USERS_CREATE: 'users.create',
    USERS_UPDATE: 'users.update',
    USERS_DELETE: 'users.delete',

    // Campaigns
    CAMPAIGNS_READ: 'campaigns.read',
    CAMPAIGNS_CREATE: 'campaigns.create',
    CAMPAIGNS_UPDATE: 'campaigns.update',
    CAMPAIGNS_DELETE: 'campaigns.delete',

    // Settings - Admin only
    SETTINGS_MANAGE: 'settings.manage',
};

// Role constants
export const ROLES = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    SALES_REP: 'Sales Representative',
    VIEWER: 'Viewer',
};

// Default role permissions mapping
export const DEFAULT_ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // All permissions

    // Admin - Full CRUD on all modules + Settings access
    [ROLES.ADMIN]: [
        // Leads - Full CRUD
        PERMISSIONS.LEADS_READ,
        PERMISSIONS.LEADS_CREATE,
        PERMISSIONS.LEADS_UPDATE,
        PERMISSIONS.LEADS_DELETE,

        // Users - Full CRUD
        PERMISSIONS.USERS_READ,
        PERMISSIONS.USERS_CREATE,
        PERMISSIONS.USERS_UPDATE,
        PERMISSIONS.USERS_DELETE,

        // Campaigns - Full CRUD
        PERMISSIONS.CAMPAIGNS_READ,
        PERMISSIONS.CAMPAIGNS_CREATE,
        PERMISSIONS.CAMPAIGNS_UPDATE,
        PERMISSIONS.CAMPAIGNS_DELETE,

        // Settings - Admin only access
        PERMISSIONS.SETTINGS_MANAGE,
    ],

    // Manager - Read all, Create/Update leads and campaigns
    [ROLES.MANAGER]: [
        // Leads - Create, Read, Update
        PERMISSIONS.LEADS_READ,
        PERMISSIONS.LEADS_CREATE,
        PERMISSIONS.LEADS_UPDATE,

        // Users - Read only
        PERMISSIONS.USERS_READ,

        // Campaigns - Read only
        PERMISSIONS.CAMPAIGNS_READ,
    ],

    // Sales Rep - Create and manage own leads
    [ROLES.SALES_REP]: [
        // Leads - Create, Read, Update
        PERMISSIONS.LEADS_READ,
        PERMISSIONS.LEADS_CREATE,
        PERMISSIONS.LEADS_UPDATE,

        // Campaigns - Read only
        PERMISSIONS.CAMPAIGNS_READ,
    ],

    // Viewer - Read only access
    [ROLES.VIEWER]: [
        PERMISSIONS.LEADS_READ,
        PERMISSIONS.CAMPAIGNS_READ,
    ],

    // Employee - Can manage leads
    Employee: [
        PERMISSIONS.LEADS_READ,
        PERMISSIONS.LEADS_CREATE,
        PERMISSIONS.LEADS_UPDATE,
    ],
};

/**
 * Check if user has a specific permission
 * @param {Object} user - User object containing role information
 * @param {string} permission - Permission key to check
 * @returns {boolean} - Whether user has the permission
 */
export const hasPermission = (user, permission) => {
    if (!user || !user.role) return false;

    // Get role information
    const role = user.role;

    // If role is an object (populated from backend)
    const roleName = typeof role === 'object' ? role.name : role;

    // Extract permissions from role object - handle multiple formats
    let rolePermissions = [];

    if (typeof role === 'object') {
        if (Array.isArray(role.permission)) {
            // Format 1: role.permission = [{key: "leads.read"}, {key: "leads.create"}]
            // Format 2: role.permission = ["leads.read", "leads.create"]
            rolePermissions = role.permission.map(p => typeof p === 'object' ? p.key : p);
        } else if (Array.isArray(role.permissions)) {
            // Format 3: role.permissions (plural) = ["leads.read", "leads.create"]
            rolePermissions = role.permissions.map(p => typeof p === 'object' ? p.key : p);
        }
    }

    // Debug logging in development
    if (import.meta.env.DEV) {
        // Permission checking debug logs removed
    }

    // Super Admin has all permissions
    if (roleName === ROLES.SUPER_ADMIN) {
        return true;
    }

    // Check if permission exists in role's permissions
    if (rolePermissions.length > 0) {
        const hasIt = rolePermissions.includes(permission);
        return hasIt;
    }

    // Fallback to default role permissions
    const defaultPermissions = DEFAULT_ROLE_PERMISSIONS[roleName] || [];
    const hasDefault = defaultPermissions.includes(permission);
    return hasDefault;
};

/**
 * Check if user has any of the specified permissions
 * @param {Object} user - User object containing role information
 * @param {string[]} permissions - Array of permission keys to check
 * @returns {boolean} - Whether user has any of the permissions
 */
export const hasAnyPermission = (user, permissions) => {
    return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {Object} user - User object containing role information
 * @param {string[]} permissions - Array of permission keys to check
 * @returns {boolean} - Whether user has all of the permissions
 */
export const hasAllPermissions = (user, permissions) => {
    return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user has a specific role
 * @param {Object} user - User object containing role information
 * @param {string} roleName - Role name to check
 * @returns {boolean} - Whether user has the role
 */
export const hasRole = (user, roleName) => {
    if (!user || !user.role) return false;
    const role = user.role;
    const userRoleName = typeof role === 'object' ? role.name : role;
    return userRoleName === roleName;
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object containing role information
 * @param {string[]} roleNames - Array of role names to check
 * @returns {boolean} - Whether user has any of the roles
 */
export const hasAnyRole = (user, roleNames) => {
    return roleNames.some(roleName => hasRole(user, roleName));
};

/**
 * Get user's role name
 * @param {Object} user - User object containing role information
 * @returns {string} - Role name
 */
export const getUserRole = (user) => {
    if (!user || !user.role) return null;
    const role = user.role;
    return typeof role === 'object' ? role.name : role;
};

/**
 * Get all permissions for a user
 * @param {Object} user - User object containing role information
 * @returns {string[]} - Array of permission keys
 */
export const getUserPermissions = (user) => {
    if (!user || !user.role) return [];

    const role = user.role;
    const roleName = typeof role === 'object' ? role.name : role;

    // Super Admin has all permissions
    if (roleName === ROLES.SUPER_ADMIN) {
        return Object.values(PERMISSIONS);
    }

    // Get permissions from role object
    if (typeof role === 'object' && Array.isArray(role.permission)) {
        return role.permission.map(p => typeof p === 'object' ? p.key : p);
    }

    // Fallback to default role permissions
    return DEFAULT_ROLE_PERMISSIONS[roleName] || [];
};

