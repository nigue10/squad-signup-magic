
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('admin_authenticated') === 'true';
      setIsAuthenticated(isLoggedIn);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-igc-navy"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error("Accès restreint. Veuillez vous connecter.");
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
