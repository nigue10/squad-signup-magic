
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LogoHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`igc-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
              alt="Logo robot IGC" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain hover-scale"
            />
            <img 
              src="/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png" 
              alt="Logo texte IGC" 
              className="h-8 md:h-10 object-contain"
            />
          </div>
          
          <div 
            className={`menu-lines ${isMenuOpen ? 'menu-open' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </div>
        </div>
      </header>
      
      {/* Fullscreen Menu */}
      <div className={`menu-wrapper ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <nav className="text-center">
            <ul className="space-y-6">
              <li className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <Link to="/" className="menu-link" onClick={() => setIsMenuOpen(false)}>
                  Accueil
                </Link>
              </li>
              <li className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Link to="/registration" className="menu-link" onClick={() => setIsMenuOpen(false)}>
                  Inscription
                </Link>
              </li>
              <li className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Link to="/guide" className="menu-link" onClick={() => setIsMenuOpen(false)}>
                  Guide
                </Link>
              </li>
              <li className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Link to="/admin" className="menu-link" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="mt-16 flex justify-center gap-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <img 
              src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
              alt="Logo robot IGC" 
              className="w-20 h-20 object-contain"
            />
            <img 
              src="/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png" 
              alt="Logo texte IGC" 
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoHeader;
