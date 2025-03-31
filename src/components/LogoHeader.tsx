
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LogoHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Check authentication status for admin link
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';

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
      <header className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-white/95 shadow-lg' : 'bg-transparent'} transition-all duration-300`}>
        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
              alt="Logo robot IGC" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 hover:scale-110"
            />
            <img 
              src="/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png" 
              alt="Logo texte IGC" 
              className="h-8 md:h-10 object-contain"
            />
          </div>
          
          <div 
            className={`menu-trigger relative cursor-pointer z-50 ${isMenuOpen ? 'active' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block w-8 h-0.5 bg-igc-navy transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-8 h-0.5 bg-igc-navy transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-8 h-0.5 bg-igc-navy transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Fullscreen Menu */}
      <div className={`fixed inset-0 bg-white z-40 transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'} ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center">
          <nav className="text-center">
            <ul className="space-y-8">
              <li className="overflow-hidden">
                <Link 
                  to="/" 
                  className="block text-3xl md:text-4xl font-medium text-igc-navy hover:text-igc-magenta transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
              </li>
              <li className="overflow-hidden">
                <Link 
                  to="/registration" 
                  className="block text-3xl md:text-4xl font-medium text-igc-navy hover:text-igc-magenta transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </li>
              <li className="overflow-hidden">
                <Link 
                  to="/guide" 
                  className="block text-3xl md:text-4xl font-medium text-igc-navy hover:text-igc-magenta transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Guide
                </Link>
              </li>
              <li className="overflow-hidden">
                <Link 
                  to={isAdminAuthenticated ? "/admin/dashboard" : "/admin"} 
                  className="block text-3xl md:text-4xl font-medium text-igc-navy hover:text-igc-magenta transition-all duration-300 transform hover:translate-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="mt-16 flex justify-center items-center gap-8">
            <img 
              src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
              alt="Logo robot IGC" 
              className="w-20 h-20 object-contain animate-bounce"
            />
            <img 
              src="/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png" 
              alt="Logo texte IGC" 
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoHeader;
