
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Mail, Info, ArrowRight, HelpCircle } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import LogoHeader from '@/components/LogoHeader';

const Index = () => {
  const { toast } = useToast();
  const settings = getSettings();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Staggered animation effect for elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));
    
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  // Handle button ripple effect
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    ripple.classList.add('ripple');
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <LogoHeader />
      
      {/* Hero Section */}
      <section className="section-full bg-gradient-to-br from-igc-navy/5 to-igc-purple/5 pt-20" ref={heroRef}>
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center">
          <div className="mb-12 flex items-center justify-center gap-6 animate-on-scroll opacity-0" style={{ transitionDelay: '0.1s' }}>
            <img 
              src="/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png" 
              alt="Logo robot IGC" 
              className="w-24 h-24 md:w-32 md:h-32 object-contain hover-scale"
            />
            <img 
              src="/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png" 
              alt="Logo texte IGC" 
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
          </div>
          
          <h1 className="animate-on-scroll opacity-0" style={{ transitionDelay: '0.2s' }}>
            IGC {settings.applicationYear}
          </h1>
          
          <h2 className="text-xl md:text-2xl font-medium text-igc-magenta mb-8 animate-on-scroll opacity-0" style={{ transitionDelay: '0.3s' }}>
            Ivorian Genius Contest
          </h2>
          
          <div className="max-w-2xl w-full mx-auto text-center">
            <div className="section-card mb-12 animate-on-scroll opacity-0" style={{ transitionDelay: '0.4s' }}>
              <p className="text-lg mb-8 leading-relaxed">
                {settings.welcomeMessage}
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-10">
                <Link 
                  to="/registration" 
                  className="btn-igc group"
                >
                  <span className="relative z-10 flex items-center gap-2 text-igc-navy group-hover:text-white">
                    <UserPlus className="w-5 h-5" />
                    Fiche de renseignements
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                
                <Link 
                  to="/guide" 
                  className="btn-igc group border-igc-purple/50"
                >
                  <span className="relative z-10 flex items-center gap-2 text-igc-navy group-hover:text-white">
                    <HelpCircle className="w-5 h-5" />
                    Guide du participant
                  </span>
                </Link>
              </div>
            </div>
            
            <div className="animate-on-scroll opacity-0" style={{ transitionDelay: '0.5s' }}>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-igc-purple/10 mb-8">
                <h3 className="text-lg font-semibold text-igc-navy mb-3 flex items-center justify-center gap-2">
                  <Info className="w-5 h-5 text-igc-magenta" /> Nouveautés {settings.applicationYear}
                </h3>
                <div className="text-sm space-y-2">
                  <p className="bg-gradient-to-br from-igc-navy/5 to-igc-purple/5 p-3 rounded-md">
                    {settings.registrationInfo}
                  </p>
                  <p className="text-xs italic mt-2 text-igc-navy/70">
                    Les équipes composées de filles sont très encouragées.
                  </p>
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
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 md:px-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-center mb-12 animate-on-scroll opacity-0">Pourquoi participer ?</h2>
          
          <div className="process-grid">
            {[
              {
                icon: "🏆",
                title: "Concours d'excellence",
                desc: "Participez à un concours prestigieux qui récompense l'excellence et l'innovation."
              },
              {
                icon: "🤝",
                title: "Travail d'équipe",
                desc: "Développez vos compétences en collaboration et résolution de problèmes."
              },
              {
                icon: "💡",
                title: "Créativité",
                desc: "Exprimez votre créativité à travers des projets innovants et impactants."
              },
              {
                icon: "🚀",
                title: "Opportunités",
                desc: "Accédez à des opportunités uniques pour votre avenir académique et professionnel."
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="process-card animate-on-scroll opacity-0" 
                style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 px-4 md:px-12 bg-gradient-to-br from-igc-navy/10 to-igc-purple/10">
        <div className="container mx-auto text-center">
          <h2 className="mb-8 animate-on-scroll opacity-0">Prêt à relever le défi ?</h2>
          
          <div className="animate-on-scroll opacity-0" style={{ transitionDelay: '0.2s' }}>
            <Link 
              to="/registration" 
              className="btn-igc group"
            >
              <span className="relative z-10 flex items-center gap-2 text-igc-navy group-hover:text-white">
                <UserPlus className="w-5 h-5" />
                Commencer mon inscription
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
