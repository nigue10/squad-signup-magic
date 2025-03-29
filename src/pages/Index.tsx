
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-igc-navy/5 to-igc-purple/5 p-4">
      <div className="flex items-center mb-6">
        <img 
          src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
          alt="Logo robot IGC" 
          className="w-16 h-16 md:w-24 md:h-24 object-contain"
        />
        <img 
          src="/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png" 
          alt="Logo texte IGC" 
          className="w-16 h-16 md:w-24 md:h-24 object-contain ml-4"
        />
      </div>
      
      <div className="max-w-2xl w-full mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-igc-navy mb-4">IGC 2025</h1>
        <h2 className="text-xl md:text-2xl font-medium text-igc-magenta mb-8">Ivorian Genius Contest</h2>
        
        <div className="p-6 md:p-8 bg-white rounded-lg shadow-lg mb-8 border border-igc-purple/20">
          <p className="text-lg mb-6">
            Bienvenue sur la plateforme d'inscription de l'IGC 2025, le plus grand concours de robotique et d'innovation de Côte d'Ivoire.
          </p>
          
          <div className="space-y-4">
            <Button asChild className="w-full md:w-64 bg-igc-navy hover:bg-igc-navy/90" size="lg">
              <Link to="/registration">
                Inscription d'équipe
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full md:w-64 text-igc-magenta border-igc-magenta/30 hover:bg-igc-magenta/10" 
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
        
        <div className="text-sm text-igc-navy/70">
          <p>Pour toute assistance, contactez-nous à igc2025@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
