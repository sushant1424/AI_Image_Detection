import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTES } from 'src/constants';
import Spinner from '../common/Spinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Spinner className="w-10 h-10 text-primary" />
        <span className="text-sm text-text-secondary font-medium animate-pulse">
          Verifying security clearance...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and store the attempted location
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
