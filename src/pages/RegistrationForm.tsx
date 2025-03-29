
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import LogoHeader from '@/components/LogoHeader';
import TeamGeneralInfoForm from '@/components/TeamGeneralInfoForm';
import TeamMembersForm from '@/components/TeamMembersForm';
import TeamSkillsForm from '@/components/TeamSkillsForm';
import TeamVisionForm from '@/components/TeamVisionForm';
import { TeamRegistration, TeamGeneralInfo, TeamMember, TeamSkills, TeamVision } from '@/types/igc';
import { createEmptyMember, isValidEmail, isValidPhone } from '@/lib/helpers';
import { useNavigate } from 'react-router-dom';
import { saveRegistration } from '@/lib/storage';
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle } from "lucide-react";

const RegistrationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const sections = ["Informations générales", "Membres de l'équipe", "Compétences", "Vision"];
  
  // État initial du formulaire
  const [registration, setRegistration] = useState<TeamRegistration>({
    generalInfo: {
      date: new Date().toLocaleDateString('fr-FR'),
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
  
  // Calcul de la progression du formulaire
  const getProgress = () => {
    let progress = 0;
    
    // Section 1: Informations générales
    if (registration.generalInfo.name) progress += 5;
    if (registration.generalInfo.city) progress += 5;
    if (registration.generalInfo.commune) progress += 5;
    if (registration.generalInfo.institution) progress += 5;
    if (registration.generalInfo.teamLeaderName) progress += 5;
    
    // Section 2: Membres de l'équipe
    const validMembers = registration.members.filter(m => m.name && m.birthDate && m.level && m.school);
    progress += Math.min(validMembers.length, 4) * 5; // Max 20%
    
    // Section 3: Compétences
    const skillsSelected = Object.values(registration.skills).filter(v => v === true).length;
    progress += Math.min(skillsSelected, 5) * 2; // Max 10%
    
    // Section 4: Vision
    if (registration.vision.motivation) progress += 10;
    if (registration.vision.values) progress += 10;
    
    return progress;
  };
  
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
  
  // Navigation entre les sections
  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Fonction de validation des email et téléphones
  const validateContacts = () => {
    const errors = [];
    
    // Vérifier l'email du référent pédagogique
    if (registration.generalInfo.pedagogicalReferentEmail && !isValidEmail(registration.generalInfo.pedagogicalReferentEmail)) {
      errors.push("L'email du référent pédagogique est invalide");
    }
    
    // Vérifier le téléphone du référent pédagogique
    if (registration.generalInfo.pedagogicalReferentPhone && !isValidPhone(registration.generalInfo.pedagogicalReferentPhone)) {
      errors.push("Le numéro de téléphone du référent pédagogique est invalide");
    }
    
    // Vérifier les emails et téléphones des membres
    registration.members.forEach((member, index) => {
      if (member.email && !isValidEmail(member.email)) {
        errors.push(`L'email du membre ${index + 1} (${member.name}) est invalide`);
      }
      if (member.phone && !isValidPhone(member.phone)) {
        errors.push(`Le numéro de téléphone du membre ${index + 1} (${member.name}) est invalide`);
      }
    });
    
    return errors;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Vérification des données requises
      const requiredFields = validateForm();
      if (requiredFields.length > 0) {
        toast({
          title: "Champs requis manquants",
          description: (
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Veuillez remplir tous les champs obligatoires:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {requiredFields.map((field, i) => (
                    <li key={i}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          ),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Vérification des emails et téléphones
      const contactErrors = validateContacts();
      if (contactErrors.length > 0) {
        toast({
          title: "Erreurs de validation",
          description: (
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Veuillez corriger les erreurs suivantes:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {contactErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          ),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Sauvegarde de l'inscription
      const registrationId = saveRegistration(registration);
      
      console.log("Équipe enregistrée avec l'ID:", registrationId);
      
      // Notification de succès
      toast({
        title: "Inscription envoyée !",
        description: (
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Votre équipe a été inscrite avec succès.</p>
              <p className="text-sm mt-1">Un email de confirmation vous sera envoyé prochainement.</p>
            </div>
          </div>
        ),
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
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Validation du formulaire
  const validateForm = (): string[] => {
    const missingFields: string[] = [];
    
    // Vérification des informations générales
    if (!registration.generalInfo.name) missingFields.push("Nom de l'équipe");
    if (!registration.generalInfo.city) missingFields.push("Ville");
    if (!registration.generalInfo.commune) missingFields.push("Commune");
    if (!registration.generalInfo.institution) missingFields.push("Institution");
    if (!registration.generalInfo.teamLeaderName) missingFields.push("Nom du chef d'équipe");
    
    // Vérification des membres (au moins 4 membres requis)
    const validMembers = registration.members.filter(m => m.name && m.birthDate && m.level && m.school);
    const minMembers = registration.generalInfo.category === 'Secondaire' ? 6 : 4;
    if (validMembers.length < minMembers) {
      missingFields.push(`Au moins ${minMembers} membres d'équipe avec informations complètes`);
    }
    
    // Vérification de la vision
    if (!registration.vision.motivation) missingFields.push("Motivation");
    if (!registration.vision.values) missingFields.push("Valeurs");
    
    return missingFields;
  };

  // Rendu conditionnel des sections du formulaire
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <TeamGeneralInfoForm 
            generalInfo={registration.generalInfo} 
            onChange={updateGeneralInfo} 
          />
        );
      case 1:
        return (
          <TeamMembersForm 
            members={registration.members} 
            onChange={updateMembers}
            category={registration.generalInfo.category}
          />
        );
      case 2:
        return (
          <TeamSkillsForm 
            skills={registration.skills} 
            onChange={updateSkills} 
          />
        );
      case 3:
        return (
          <TeamVisionForm 
            vision={registration.vision} 
            onChange={updateVision} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-igc-purple/5">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-igc-purple/10">
          <LogoHeader />
          
          <h1 className="text-2xl md:text-3xl font-bold text-center text-igc-navy mb-2 uppercase">
            FICHE D'INSCRIPTION – IGC 2025
          </h1>
          
          <div className="mb-8">
            <div className="flex justify-between mb-2 text-sm font-medium text-igc-navy">
              <span>Progression: {getProgress()}%</span>
              <span>Étape {currentSection + 1}/{sections.length}</span>
            </div>
            <Progress value={getProgress()} className="h-2 bg-gray-100" indicatorClassName="bg-gradient-to-r from-igc-navy to-igc-magenta" />
            
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {sections.map((section, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentSection(index)}
                  className={`${index === currentSection ? 'text-igc-magenta font-medium' : 'text-gray-500'} hover:text-igc-navy transition-colors`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            {renderCurrentSection()}
            
            <div className="flex justify-between pt-8">
              {currentSection > 0 ? (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={goToPreviousSection}
                  className="border-igc-navy/30 text-igc-navy hover:bg-igc-navy/5"
                >
                  Étape précédente
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentSection < sections.length - 1 ? (
                <Button 
                  type="button" 
                  onClick={goToNextSection}
                  className="bg-igc-navy hover:bg-igc-navy/90"
                >
                  Étape suivante
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-igc-navy to-igc-magenta hover:opacity-90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Soumettre l'inscription"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
