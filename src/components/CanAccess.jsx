import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../utils/permissions';

/**
 * Conditional rendering component based on permissions
 * Use this to show/hide UI elements based on user permissions
 *
 * @param {Object} props
 * @param {string} props.permission - Single permission required
 * @param {string[]} props.permissions - Array of permissions
 * @param {boolean} props.requireAll - Require all permissions (default: false)
 * @param {React.ReactNode} props.children - Content to render if permission granted
 * @param {React.ReactNode} props.fallback - Content to render if permission denied
 */
const CanAccess = ({
  permission,
  permissions = [],
  requireAll = false,
  children,
  fallback = null,
}) => {
  const user = useSelector(selectCurrentUser);

  // If no user, don't show anything
  if (!user) {
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

  return hasAccess ? children : fallback;
};

export default CanAccess;
