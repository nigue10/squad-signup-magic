
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Mail, Info, ArrowRight, HelpCircle } from 'lucide-react';
import { getSettings } from '@/lib/settings';

const Index = () => {
  const { toast } = useToast();
  const settings = getSettings();

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
        <h1 className="text-3xl md:text-4xl font-bold text-igc-navy mb-2">IGC {settings.applicationYear}</h1>
        <h2 className="text-xl md:text-2xl font-medium text-igc-magenta mb-8">Ivorian Genius Contest</h2>
        
        <div className="p-6 md:p-8 bg-white rounded-lg shadow-lg mb-8 border border-igc-purple/20">
          <p className="text-lg mb-6">
            {settings.welcomeMessage}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button asChild className="w-full md:w-64 bg-gradient-to-r from-igc-navy to-igc-magenta hover:opacity-90" size="lg">
              <Link to="/registration" className="flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Fiche de renseignements</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full md:w-64 border-igc-navy text-igc-navy hover:bg-igc-navy/5" size="lg">
              <Link to="/guide" className="flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5" />
                <span>Guide du participant</span>
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 p-5 bg-gradient-to-r from-igc-navy/5 to-igc-purple/10 rounded-lg border border-igc-purple/10">
            <h3 className="text-lg font-semibold text-igc-navy mb-3 flex items-center justify-center gap-2">
              <Info className="w-5 h-5 text-igc-magenta" /> Nouveautés {settings.applicationYear}
            </h3>
            <div className="text-sm space-y-2">
              <p className="bg-white/50 p-2 rounded-md">
                {settings.registrationInfo}
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
            href={`mailto:${settings.contactEmail}`} 
            className="flex items-center gap-1 text-igc-magenta hover:underline"
          >
            <Mail className="w-4 h-4" /> {settings.contactEmail}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
