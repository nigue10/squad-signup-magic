
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { TeamSkills } from "@/types/igc";

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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-igc-blue flex items-center gap-2 pb-2 border-b border-gray-200">
        <Brain className="w-5 h-5" /> Compétences & Outils maîtrisés dans l'équipe
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="arduino"
            checked={skills.arduino}
            onCheckedChange={(checked) => handleSkillChange('arduino', checked as boolean)}
          />
          <Label htmlFor="arduino" className="text-sm font-normal leading-none mt-0.5">
            Programmation Arduino
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="sensors"
            checked={skills.sensors}
            onCheckedChange={(checked) => handleSkillChange('sensors', checked as boolean)}
          />
          <Label htmlFor="sensors" className="text-sm font-normal leading-none mt-0.5">
            Capteurs & actionneurs
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="design3d"
            checked={skills.design3d}
            onCheckedChange={(checked) => handleSkillChange('design3d', checked as boolean)}
          />
          <Label htmlFor="design3d" className="text-sm font-normal leading-none mt-0.5">
            Design 3D / Impression 3D
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="basicElectronics"
            checked={skills.basicElectronics}
            onCheckedChange={(checked) => handleSkillChange('basicElectronics', checked as boolean)}
          />
          <Label htmlFor="basicElectronics" className="text-sm font-normal leading-none mt-0.5">
            Électronique de base
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="programming"
            checked={skills.programming}
            onCheckedChange={(checked) => handleSkillChange('programming', checked as boolean)}
          />
          <Label htmlFor="programming" className="text-sm font-normal leading-none mt-0.5">
            Programmation Python / C++
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="robotDesign"
            checked={skills.robotDesign}
            onCheckedChange={(checked) => handleSkillChange('robotDesign', checked as boolean)}
          />
          <Label htmlFor="robotDesign" className="text-sm font-normal leading-none mt-0.5">
            Conception de robot mobile
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="remoteControl"
            checked={skills.remoteControl}
            onCheckedChange={(checked) => handleSkillChange('remoteControl', checked as boolean)}
          />
          <Label htmlFor="remoteControl" className="text-sm font-normal leading-none mt-0.5">
            Téléguidage / Contrôle Bluetooth
          </Label>
        </div>
        
        <div className="flex items-start space-x-2">
          <Checkbox
            id="teamwork"
            checked={skills.teamwork}
            onCheckedChange={(checked) => handleSkillChange('teamwork', checked as boolean)}
          />
          <Label htmlFor="teamwork" className="text-sm font-normal leading-none mt-0.5">
            Travail en équipe / Gestion de projet
          </Label>
        </div>
        
        <div className="flex items-start space-x-2 col-span-1 md:col-span-2">
          <Checkbox
            id="other"
            checked={skills.other}
            onCheckedChange={(checked) => handleSkillChange('other', checked as boolean)}
          />
          <div className="flex flex-col items-start">
            <Label htmlFor="other" className="text-sm font-normal leading-none mt-0.5 mb-1">
              Autre(s)
            </Label>
            {skills.other && (
              <Input
                value={skills.otherDescription || ''}
                onChange={(e) => onChange({ ...skills, otherDescription: e.target.value })}
                className="w-full md:w-96"
                placeholder="Précisez..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSkillsForm;
