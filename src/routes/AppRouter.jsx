import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, selectIsAuthenticated } from '../store/authSlice';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../views/Dashboard';
import Users from '../views/Users';
import Leads from '../views/Leads';
import LeadDetailPage from '../views/LeadDetailPage';
import LeadEditPage from '../views/LeadEditPage';
import Campaigns from '../views/Campaigns';
import Settings from '../views/Settings';
import ProfileEditPage from '../views/ProfileEditPage';
import Login from '../views/Login';

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRouter = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already authenticated on app startup
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes inside AdminLayout */}
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/follow-up" element={<Leads />} />
          <Route path="leads/new" element={<LeadEditPage />} />
          <Route path="leads/:id" element={<LeadDetailPage />} />
          <Route path="leads/:id/edit" element={<LeadEditPage />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/profile/edit" element={<ProfileEditPage />} />
          
          {/* Catch all route for 404 */}
          <Route 
            path="*" 
            element={
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-muted-foreground">404</h1>
                  <p className="text-muted-foreground">Page not found</p>
                </div>
              </div>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;