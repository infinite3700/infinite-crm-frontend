import {
    GitBranch,
    Home,
    MapPin,
    Megaphone,
    Package,
    PhoneCall,
    Settings,
    Shield,
    User,
    UserCheck,
    Users,
} from 'lucide-react';
import { PERMISSIONS } from '../utils/permissions';

/**
 * Main Navigation Configuration
 * Maps sidebar menu items with their permissions
 */
export const MAIN_NAVIGATION = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        href: '/',
        icon: Home,
        permission: null, // Everyone can access dashboard
    },
    {
        id: 'users',
        name: 'Users',
        href: '/users',
        icon: Users,
        permission: PERMISSIONS.USERS_READ,
    },
    {
        id: 'leads',
        name: 'Leads',
        href: '/leads',
        icon: UserCheck,
        permission: PERMISSIONS.LEADS_READ,
    },
    {
        id: 'campaigns',
        name: 'Campaigns',
        href: '/campaigns',
        icon: Megaphone,
        permission: PERMISSIONS.CAMPAIGNS_READ,
    },
    {
        id: 'settings',
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_MANAGE,
    },
];

/**
 * Mobile Navigation Configuration
 * Includes additional items like Follow Up
 */
export const MOBILE_NAVIGATION = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        href: '/',
        icon: Home,
        permission: null, // Everyone can access dashboard
    },
    {
        id: 'leads',
        name: 'Leads',
        href: '/leads',
        icon: UserCheck,
        permission: PERMISSIONS.LEADS_READ,
    },
    {
        id: 'follow-up',
        name: 'Follow Up',
        href: '/leads/follow-up',
        icon: PhoneCall,
        permission: PERMISSIONS.LEADS_READ,
    },
    {
        id: 'campaigns',
        name: 'Campaigns',
        href: '/campaigns',
        icon: Megaphone,
        permission: PERMISSIONS.CAMPAIGNS_READ,
    },
    {
        id: 'settings',
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_MANAGE,
    },
];

/**
 * Settings Tabs Configuration
 * Maps settings tabs with their permissions
 */
export const SETTINGS_TABS = [
    {
        id: 'profile',
        label: 'Profile',
        shortLabel: 'Profile',
        icon: User,
        permission: null, // Everyone can access
    },
    {
        id: 'geography',
        label: 'Geography',
        shortLabel: 'Geography',
        icon: MapPin,
        permission: null, // Everyone can access
    },
    {
        id: 'lead-stages',
        label: 'Lead Stages',
        shortLabel: 'Stages',
        icon: GitBranch,
        permission: null, // Everyone can access
    },
    {
        id: 'products-categories',
        label: 'Products & Categories',
        shortLabel: 'Products',
        icon: Package,
        permission: null, // Everyone can access
    },
    {
        id: 'roles-permissions',
        label: 'Roles & Permissions',
        shortLabel: 'Roles',
        icon: Shield,
        permission: null, // Everyone can access
    },
];

/**
 * Filter navigation items based on user permissions
 * @param {Array} navItems - Navigation items to filter
 * @param {Object} user - Current user object with role and permissions
 * @param {Function} hasPermissionFn - Permission check function
 * @returns {Array} Filtered navigation items
 */
export const filterNavigation = (navItems, user, hasPermissionFn) => {
    if (!user) {
        return [];
    }



    const filtered = navItems.filter((item) => {
        // If no permission specified, show the item (accessible to all authenticated users)
        if (!item.permission) {
            return true;
        }

        // Check if user has the required permission
        const hasAccess = hasPermission(user, item.permission);
        return hasAccess;
    });

    return filtered;
};

/**
 * Get first accessible route for a user
 * Used for smart redirects when user doesn't have access to their current route
 * @param {Object} user - Current user object
 * @param {Function} hasPermissionFn - Permission check function
 * @returns {string} First accessible route path or '/unauthorized'
 */
export const getFirstAccessibleRoute = (user, hasPermissionFn) => {
    const accessibleNavItems = filterNavigation(MAIN_NAVIGATION, user, hasPermissionFn);

    if (accessibleNavItems.length > 0) {
        return accessibleNavItems[0].href;
    }

    return '/unauthorized';
};

/**
 * Get accessible settings tabs for a user
 * @param {Object} user - Current user object
 * @param {Function} hasPermissionFn - Permission check function
 * @returns {Array} Accessible settings tabs
 */
export const getAccessibleSettingsTabs = (user, hasPermissionFn) => {
    return filterNavigation(SETTINGS_TABS, user, hasPermissionFn);
};

