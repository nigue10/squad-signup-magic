
import React from 'react';
import { Link } from 'react-router-dom';

const LogoHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-8 mt-4">
      <div className="w-24 h-24">
        <img 
          src="/lovable-uploads/526b0e79-f8fc-413d-b351-c946cb887c75.png" 
          alt="Logo gauche IGC" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="text-center">
        <h2 className="text-lg font-medium text-igc-blue">Ivorian Genius Contest 2025</h2>
      </div>
      
      <div className="w-24 h-24">
        <img 
          src="/lovable-uploads/92d82a13-96fd-45de-bfb9-2d819c386994.png" 
          alt="Logo droit IGC" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default LogoHeader;
