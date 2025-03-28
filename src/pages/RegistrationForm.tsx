
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import LogoHeader from '@/components/LogoHeader';
import TeamGeneralInfoForm from '@/components/TeamGeneralInfoForm';
import TeamMembersForm from '@/components/TeamMembersForm';
import TeamSkillsForm from '@/components/TeamSkillsForm';
import TeamVisionForm from '@/components/TeamVisionForm';
import { TeamRegistration, TeamGeneralInfo, TeamMember, TeamSkills, TeamVision } from '@/types/igc';
import { createEmptyMember } from '@/lib/helpers';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // État initial du formulaire
  const [registration, setRegistration] = useState<TeamRegistration>({
    generalInfo: {
      date: '28/03/2025',
      name: '',
      category: 'Secondaire',
      city: '',
      commune: '',
      institution: '',
      pedagogicalReferentName: '',
      pedagogicalReferentPhone: '',
      pedagogicalReferentEmail: '',
      teamLeaderName: '',
    },
    members: Array(6).fill(null).map(() => createEmptyMember()),
    skills: {
      arduino: false,
      sensors: false,
      design3d: false,
      basicElectronics: false,
      programming: false,
      robotDesign: false,
      remoteControl: false,
      teamwork: false,
      other: false,
      otherDescription: '',
    },
    vision: {
      motivation: '',
      values: '',
      roboticsLevel: 'Débutant',
      hasWorkspace: false,
    },
  });
  
  // Gestionnaires de mise à jour
  const updateGeneralInfo = (generalInfo: TeamGeneralInfo) => {
    setRegistration({ ...registration, generalInfo });
    
    // Mise à jour du nombre de membres si la catégorie change
    if (generalInfo.category !== registration.generalInfo.category) {
      const minMembers = generalInfo.category === 'Secondaire' ? 6 : 4;
      let newMembers = [...registration.members];
      
      if (newMembers.length < minMembers) {
        // Ajouter des membres si nécessaire
        while (newMembers.length < minMembers) {
          newMembers.push(createEmptyMember());
        }
      } else if (newMembers.length > 6) {
        // Réduire à 6 membres maximum
        newMembers = newMembers.slice(0, 6);
      }
      
      setRegistration(prev => ({
        ...prev,
        generalInfo,
        members: newMembers,
      }));
    }
  };
  
  const updateMembers = (members: TeamMember[]) => {
    setRegistration({ ...registration, members });
  };
  
  const updateSkills = (skills: TeamSkills) => {
    setRegistration({ ...registration, skills });
  };
  
  const updateVision = (vision: TeamVision) => {
    setRegistration({ ...registration, vision });
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Cette partie sera implémentée avec Supabase dans l'étape suivante
      toast({
        title: "Inscription envoyée !",
        description: "Votre équipe a été inscrite avec succès. Vous recevrez une confirmation par email.",
      });
      
      // Redirection vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur lors de l'inscription",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-igc-gray">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <LogoHeader />
          
          <h1 className="text-2xl md:text-3xl font-bold text-center text-igc-blue mb-8 uppercase">
            FICHE D'IDENTIFICATION DE L'ÉQUIPE – IGC 2025
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <TeamGeneralInfoForm 
              generalInfo={registration.generalInfo} 
              onChange={updateGeneralInfo} 
            />
            
            <TeamMembersForm 
              members={registration.members} 
              onChange={updateMembers}
              category={registration.generalInfo.category}
            />
            
            <TeamSkillsForm 
              skills={registration.skills} 
              onChange={updateSkills} 
            />
            
            <TeamVisionForm 
              vision={registration.vision} 
              onChange={updateVision} 
            />
            
            <div className="flex justify-center pt-8">
              <Button type="submit" size="lg" className="w-full md:w-64">
                Soumettre l'inscription
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
