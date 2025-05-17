import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function PrivateRoute({ element, allowedRoles = [] }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Show loading spinner while checking authentication status
        return <div className="text-center p-5"><div className="spinner-border" role="status" /></div>;
    }

    // Check if user is logged in
    if (!user) {
        // Redirect to login and save the intended destination
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Check role permissions if needed
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // User is logged in but doesn't have the required role
        return <Navigate to="/unauthorized" replace />;
    }

    // If everything passes, render the protected component
    return element;
}

export default PrivateRoute;