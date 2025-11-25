import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated } from '../store/authSlice';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Check if user has a valid token in localStorage
  const hasToken = localStorage.getItem('auth_token');
  
  if (!isAuthenticated && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;