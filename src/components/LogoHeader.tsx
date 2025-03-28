
import React from 'react';
import { Link } from 'react-router-dom';

const LogoHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-8 mt-4">
      <div className="w-24 h-24">
        <img 
          src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
          alt="Logo robot IGC" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="text-center">
        <h2 className="text-lg font-medium text-igc-blue">Ivorian Genius Contest 2025</h2>
      </div>
      
      <div className="w-24 h-24">
        <img 
          src="/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png" 
          alt="Logo texte IGC" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default LogoHeader;
