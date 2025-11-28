import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentUser, selectAuthInitialized, selectAuthLoading } from '../store/authSlice';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';

/**
 * Permission Guard Component
 * Protects routes and components based on user permissions
 *
 * @param {Object} props
 * @param {string} props.permission - Single permission required
 * @param {string[]} props.permissions - Array of permissions (use with requireAll/requireAny)
 * @param {boolean} props.requireAll - Require all permissions (default: false)
 * @param {boolean} props.requireAny - Require any permission (default: true when permissions array)
 * @param {React.ReactNode} props.children - Content to render if permission granted
 * @param {React.ReactNode} props.fallback - Content to render if permission denied
 * @param {string} props.redirectTo - Path to redirect if permission denied
 */
const PermissionGuard = ({
  permission,
  permissions = [],
  requireAll = false,
  requireAny = false,
  children,
  fallback = null,
  redirectTo = null,
}) => {
  const user = useSelector(selectCurrentUser);
  const initialized = useSelector(selectAuthInitialized);
  const loading = useSelector(selectAuthLoading);

  // Wait for auth to initialize before checking permissions
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user after initialization, deny access
  if (!user) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback;
  }

  let hasAccess = false;

  // Check single permission
  if (permission) {
    hasAccess = hasPermission(user, permission);
  }
  // Check multiple permissions
  else if (permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAllPermissions(user, permissions);
    } else {
      hasAccess = hasAnyPermission(user, permissions);
    }
  }
  // No permission specified, grant access by default
  else {
    hasAccess = true;
  }

  // Handle denied access
  if (!hasAccess) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback;
  }

  return children;
};

/**
 * Higher-order component for permission-based rendering
 * @param {React.Component} Component - Component to wrap
 * @param {Object} permissionConfig - Permission configuration
 * @returns {React.Component} - Wrapped component
 */
export const withPermission = (Component, permissionConfig) => {
  return (props) => (
    <PermissionGuard {...permissionConfig}>
      <Component {...props} />
    </PermissionGuard>
  );
};

/**
 * Hook to check permissions
 * @returns {Object} - Permission checking functions
 */
export const usePermission = () => {
  const user = useSelector(selectCurrentUser);

  return {
    hasPermission: (permission) => hasPermission(user, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(user, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(user, permissions),
    user,
  };
};

export default PermissionGuard;
