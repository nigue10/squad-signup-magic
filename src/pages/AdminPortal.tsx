
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Shield } from 'lucide-react';

const AdminPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Shield className="h-12 w-12 text-igc-navy" />
        </div>
        <h1 className="text-2xl font-bold text-center text-igc-navy mb-6">
          Portail Administrateur IGC
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ce portail est réservé à l'équipe administrative de l'IGC. 
          Veuillez vous connecter pour accéder au système de gestion.
        </p>
        <Button 
          className="w-full bg-igc-navy hover:bg-igc-navy/90"
          onClick={() => navigate('/admin')}
        >
          Accéder à l'interface d'administration
        </Button>
      </div>
    </div>
  );
};

export default AdminPortal;
