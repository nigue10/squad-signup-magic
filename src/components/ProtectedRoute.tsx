
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: JSX.Element;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = true }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('admin_authenticated') === 'true';
      
      // Pour extra security, also check expiration
      const authExpiry = localStorage.getItem('admin_auth_expiry');
      const isExpired = authExpiry ? new Date(authExpiry) < new Date() : true;
      
      if (isLoggedIn && !isExpired) {
        setIsAuthenticated(true);
      } else {
        // Clear expired auth data
        if (isLoggedIn && isExpired) {
          localStorage.removeItem('admin_authenticated');
          localStorage.removeItem('admin_auth_expiry');
          toast.error("Votre session a expiré. Veuillez vous reconnecter.");
        }
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Check if the path requires admin access
  const isAdminRoute = requireAdmin && location.pathname.startsWith('/admin') && location.pathname !== '/admin';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-igc-navy" />
          <p className="text-igc-navy font-medium">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && isAdminRoute) {
    toast.error("Accès restreint. Veuillez vous connecter.");
    
    // Redirect to login and save the intended destination
    return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
