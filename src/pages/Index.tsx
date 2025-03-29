
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, UserCog, Mail, Info, ArrowRight } from 'lucide-react';

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
        <h1 className="text-3xl md:text-4xl font-bold text-igc-navy mb-2">IGC 2025</h1>
        <h2 className="text-xl md:text-2xl font-medium text-igc-magenta mb-8">Ivorian Genius Contest</h2>
        
        <div className="p-6 md:p-8 bg-white rounded-lg shadow-lg mb-8 border border-igc-purple/20">
          <p className="text-lg mb-6">
            Bienvenue sur la plateforme d'inscription de l'IGC 2025, le plus grand concours de robotique et d'innovation de Côte d'Ivoire.
          </p>
          
          <div className="space-y-4">
            <Button asChild className="w-full md:w-64 bg-gradient-to-r from-igc-navy to-igc-magenta hover:opacity-90" size="lg">
              <Link to="/registration" className="flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Inscription d'équipe</span>
                <ArrowRight className="w-4 h-4 ml-1" />
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
          
          <div className="mt-8 p-5 bg-gradient-to-r from-igc-navy/5 to-igc-purple/10 rounded-lg border border-igc-purple/10">
            <h3 className="text-lg font-semibold text-igc-navy mb-3 flex items-center justify-center gap-2">
              <Info className="w-5 h-5 text-igc-magenta" /> Nouveautés 2025
            </h3>
            <div className="text-sm space-y-2">
              <p className="bg-white/50 p-2 rounded-md">
                Cette année, l'IGC accueille deux catégories: <span className="font-medium text-igc-navy">Secondaire</span> et <span className="font-medium text-igc-navy">Supérieur</span>.
              </p>
              <p className="bg-white/50 p-2 rounded-md">
                Les équipes du secondaire doivent compter <span className="font-medium text-igc-magenta">6 membres</span>, tandis que les équipes 
                du supérieur peuvent participer avec un minimum de <span className="font-medium text-igc-magenta">4 membres</span>.
              </p>
              <p className="text-xs italic mt-2">
                Les équipes composées de filles sont très encouragées.
              </p>
            </div>
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
