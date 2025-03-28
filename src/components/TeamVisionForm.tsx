
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lightbulb } from "lucide-react";
import { TeamVision, RoboticsLevel } from "@/types/igc";

interface TeamVisionFormProps {
  vision: TeamVision;
  onChange: (vision: TeamVision) => void;
}

const TeamVisionForm: React.FC<TeamVisionFormProps> = ({ vision, onChange }) => {
  const handleChange = (field: keyof TeamVision, value: string | boolean) => {
    onChange({
      ...vision,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-igc-blue flex items-center gap-2 pb-2 border-b border-gray-200">
        <Lightbulb className="w-5 h-5" /> Motivation & Vision
      </h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="motivation" className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-0.5">
            Pourquoi souhaitez-vous participer à l'IGC 2025 ? (3-5 lignes)
          </Label>
          <Textarea
            id="motivation"
            value={vision.motivation}
            onChange={(e) => handleChange('motivation', e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="values" className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-0.5">
            En quoi votre équipe incarne les valeurs de l'IGC ? (Créativité, esprit d'équipe, innovation)
          </Label>
          <Textarea
            id="values"
            value={vision.values}
            onChange={(e) => handleChange('values', e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="roboticsLevel" className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-0.5">
            Niveau de connaissances en robotique de l'équipe
          </Label>
          <Select
            value={vision.roboticsLevel}
            onValueChange={(value) => handleChange('roboticsLevel', value as RoboticsLevel)}
          >
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="Sélectionnez un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Débutant">Débutant</SelectItem>
              <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
              <SelectItem value="Avancé">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-0.5">
            L'équipe dispose-t-elle d'un espace de travail ?
          </Label>
          <RadioGroup
            value={vision.hasWorkspace ? "yes" : "no"}
            onValueChange={(value) => handleChange('hasWorkspace', value === "yes")}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="workspace-yes" />
              <Label htmlFor="workspace-yes" className="font-normal">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="workspace-no" />
              <Label htmlFor="workspace-no" className="font-normal">Non</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default TeamVisionForm;
