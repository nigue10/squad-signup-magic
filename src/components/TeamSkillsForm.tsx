
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Info } from "lucide-react";
import { TeamSkills } from "@/types/igc";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeamSkillsFormProps {
  skills: TeamSkills;
  onChange: (skills: TeamSkills) => void;
}

const TeamSkillsForm: React.FC<TeamSkillsFormProps> = ({ skills, onChange }) => {
  const handleSkillChange = (field: keyof TeamSkills, value: boolean) => {
    onChange({
      ...skills,
      [field]: value,
    });
  };

  // Liste des compétences avec leur libellé et description
  const skillsList = [
    {
      id: "arduino",
      label: "Programmation Arduino",
      description: "Expérience avec la programmation de cartes Arduino et le langage Arduino C"
    },
    {
      id: "sensors",
      label: "Capteurs & actionneurs",
      description: "Connaissance et utilisation de capteurs (ultrasons, infrarouges, etc.) et d'actionneurs"
    },
    {
      id: "design3d",
      label: "Design 3D / Impression 3D",
      description: "Expérience avec les logiciels de CAO et l'impression 3D"
    },
    {
      id: "basicElectronics",
      label: "Électronique de base",
      description: "Connaissances des circuits électroniques simples, soudure, breadboard"
    },
    {
      id: "programming",
      label: "Programmation Python / C++",
      description: "Compétences en programmation avec Python, C++ ou autres langages"
    },
    {
      id: "robotDesign",
      label: "Conception de robot mobile",
      description: "Expérience dans la conception de structures robotiques mobiles"
    },
    {
      id: "remoteControl",
      label: "Téléguidage / Contrôle Bluetooth",
      description: "Expérience avec les systèmes de contrôle à distance et Bluetooth"
    },
    {
      id: "teamwork",
      label: "Travail en équipe / Gestion de projet",
      description: "Expérience de travail en équipe et compétences en gestion de projet"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-igc-navy flex items-center gap-2 pb-2 border-b border-igc-purple/30">
        <Brain className="w-5 h-5 text-igc-magenta" /> Compétences & Outils maîtrisés dans l'équipe
      </h2>
      
      <Alert className="bg-igc-navy/5 border-igc-navy/20">
        <Info className="h-4 w-4 text-igc-navy" />
        <AlertDescription className="text-sm text-igc-navy">
          Sélectionnez les compétences que possèdent les membres de votre équipe. Cela nous aidera à adapter nos formations préliminaires.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillsList.map((skill) => (
          <div 
            key={skill.id} 
            className={`flex items-start p-4 space-x-3 rounded-lg border transition-colors ${
              skills[skill.id as keyof TeamSkills] 
                ? 'bg-igc-purple/10 border-igc-purple/30' 
                : 'border-gray-200 hover:border-igc-purple/20'
            }`}
          >
            <Checkbox
              id={skill.id}
              checked={skills[skill.id as keyof TeamSkills] as boolean}
              onCheckedChange={(checked) => handleSkillChange(skill.id as keyof TeamSkills, checked as boolean)}
              className="mt-1 border-igc-navy/50 data-[state=checked]:bg-igc-magenta data-[state=checked]:border-igc-magenta"
            />
            <div>
              <Label htmlFor={skill.id} className="text-sm font-medium text-igc-navy">
                {skill.label}
              </Label>
              <p className="text-xs text-gray-500 mt-1">{skill.description}</p>
            </div>
          </div>
        ))}
        
        <div className={`col-span-1 md:col-span-2 flex flex-col p-4 space-y-3 rounded-lg border transition-colors ${
          skills.other 
            ? 'bg-igc-purple/10 border-igc-purple/30' 
            : 'border-gray-200 hover:border-igc-purple/20'
        }`}>
          <div className="flex items-start space-x-3">
            <Checkbox
              id="other"
              checked={skills.other}
              onCheckedChange={(checked) => handleSkillChange('other', checked as boolean)}
              className="mt-1 border-igc-navy/50 data-[state=checked]:bg-igc-magenta data-[state=checked]:border-igc-magenta"
            />
            <div>
              <Label htmlFor="other" className="text-sm font-medium text-igc-navy">
                Autre(s) compétence(s)
              </Label>
              <p className="text-xs text-gray-500 mt-1">Autres compétences non listées ci-dessus</p>
            </div>
          </div>
          
          {skills.other && (
            <div className="ml-7">
              <Input
                value={skills.otherDescription || ''}
                onChange={(e) => onChange({ ...skills, otherDescription: e.target.value })}
                className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
                placeholder="Précisez les autres compétences de votre équipe..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamSkillsForm;
