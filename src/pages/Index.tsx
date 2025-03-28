
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-igc-gray p-4">
      <div className="flex items-center mb-6">
        <img 
          src="/lovable-uploads/526b0e79-f8fc-413d-b351-c946cb887c75.png" 
          alt="Logo gauche IGC" 
          className="w-16 h-16 md:w-24 md:h-24 object-contain"
        />
        <img 
          src="/lovable-uploads/92d82a13-96fd-45de-bfb9-2d819c386994.png" 
          alt="Logo droit IGC" 
          className="w-16 h-16 md:w-24 md:h-24 object-contain ml-4"
        />
      </div>
      
      <div className="max-w-2xl w-full mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-igc-blue mb-4">IGC 2025</h1>
        <h2 className="text-xl md:text-2xl font-medium mb-8">Ivorian Genius Contest</h2>
        
        <div className="p-6 md:p-8 bg-white rounded-lg shadow-lg mb-8">
          <p className="text-lg mb-6">
            Bienvenue sur la plateforme d'inscription de l'IGC 2025, le plus grand concours de robotique et d'innovation de Côte d'Ivoire.
          </p>
          
          <div className="space-y-4">
            <Button asChild className="w-full md:w-64" size="lg">
              <Link to="/registration">
                Inscription d'équipe
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full md:w-64" 
              size="lg"
              onClick={() => {
                toast({
                  title: "Espace administrateur",
                  description: "Accès restreint. Veuillez vous connecter.",
                });
              }}
              asChild
            >
              <Link to="/admin">
                Espace administrateur
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Pour toute assistance, contactez-nous à igc2025@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
