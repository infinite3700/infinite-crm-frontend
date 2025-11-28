import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentUser } from '../store/authSlice';
import { hasRole, hasAnyRole } from '../utils/permissions';

/**
 * Role Guard Component
 * Protects routes and components based on user roles
 *
 * @param {Object} props
 * @param {string} props.role - Single role required
 * @param {string[]} props.roles - Array of roles (any role grants access)
 * @param {React.ReactNode} props.children - Content to render if role matches
 * @param {React.ReactNode} props.fallback - Content to render if role doesn't match
 * @param {string} props.redirectTo - Path to redirect if role doesn't match
 */
const RoleGuard = ({ role, roles = [], children, fallback = null, redirectTo = null }) => {
  const user = useSelector(selectCurrentUser);

  // If no user, deny access
  if (!user) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return fallback;
  }

  let hasAccess = false;

  // Check single role
  if (role) {
    hasAccess = hasRole(user, role);
  }
  // Check multiple roles
  else if (roles.length > 0) {
    hasAccess = hasAnyRole(user, roles);
  }
  // No role specified, grant access by default
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
 * Higher-order component for role-based rendering
 * @param {React.Component} Component - Component to wrap
 * @param {Object} roleConfig - Role configuration
 * @returns {React.Component} - Wrapped component
 */
export const withRole = (Component, roleConfig) => {
  return (props) => (
    <RoleGuard {...roleConfig}>
      <Component {...props} />
    </RoleGuard>
  );
};

/**
 * Hook to check roles
 * @returns {Object} - Role checking functions
 */
export const useRole = () => {
  const user = useSelector(selectCurrentUser);

  return {
    hasRole: (roleName) => hasRole(user, roleName),
    hasAnyRole: (roleNames) => hasAnyRole(user, roleNames),
    user,
  };
};

export default RoleGuard;
