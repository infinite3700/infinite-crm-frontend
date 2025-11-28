import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import { hasPermission } from '../utils/permissions';
import { PERMISSIONS } from '../utils/permissions';

/**
 * Smart Redirect Component
 * Redirects users to the first page they have access to
 * Used when a user tries to access a page they don't have permission for
 */
const SmartRedirect = () => {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    // Define routes in order of priority
    const routes = [
      { path: '/', permission: null }, // Dashboard accessible to all
      { path: '/leads', permission: PERMISSIONS.LEADS_READ },
      { path: '/campaigns', permission: PERMISSIONS.CAMPAIGNS_READ },
      { path: '/users', permission: PERMISSIONS.USERS_READ },
      { path: '/settings', permission: PERMISSIONS.SETTINGS_MANAGE },
    ];

    // Find first accessible route
    const accessibleRoute = routes.find((route) => hasPermission(user, route.permission));

    if (accessibleRoute) {
      navigate(accessibleRoute.path, { replace: true });
    } else {
      // If no routes are accessible, show unauthorized
      navigate('/unauthorized', { replace: true });
    }
  }, [user, navigate]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default SmartRedirect;
