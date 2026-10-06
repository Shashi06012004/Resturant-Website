import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * GuestRoute wrapper prevents already authenticated users from accessing
 * guest-only routes like /login or /register.
 */
export const GuestRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-brand-gold text-xs">
        Loading...
      </div>
    );
  }

  if (user) {
    // If logged-in user tries to access /login or /register, redirect them
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  return children ? children : <Outlet />;
};

export default GuestRoute;
