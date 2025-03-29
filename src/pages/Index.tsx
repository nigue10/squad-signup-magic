
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, UserCog, Mail, Info } from 'lucide-react';

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
              <Link to="/registration" className="flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                Inscription d'équipe
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full md:w-64 text-igc-magenta border-igc-magenta/30 hover:bg-igc-magenta/10" 
              size="lg"
              asChild
            >
              <Link to="/admin" className="flex items-center justify-center gap-2">
                <UserCog className="w-5 h-5" />
                Espace administrateur
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-igc-navy/5 rounded-lg">
            <h3 className="text-lg font-semibold text-igc-navy mb-2 flex items-center justify-center gap-2">
              <Info className="w-5 h-5" /> Nouveautés 2025
            </h3>
            <p className="text-sm">
              Cette année, l'IGC accueille deux catégories: Secondaire et Supérieur. 
              Les équipes du secondaire doivent compter 6 membres, tandis que les équipes 
              du supérieur peuvent participer avec un minimum de 4 membres.
            </p>
          </div>
        </div>
        
        <div className="text-sm text-igc-navy/70 flex flex-col md:flex-row items-center justify-center gap-2">
          <p>Pour toute assistance, contactez-nous</p>
          <a 
            href="mailto:igc2025@example.com" 
            className="flex items-center gap-1 text-igc-magenta hover:underline"
          >
            <Mail className="w-4 h-4" /> igc2025@example.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
