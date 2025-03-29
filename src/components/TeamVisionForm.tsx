
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lightbulb, Info } from "lucide-react";
import { TeamVision, RoboticsLevel } from "@/types/igc";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-igc-navy flex items-center gap-2 pb-2 border-b border-igc-purple/30">
        <Lightbulb className="w-5 h-5 text-igc-magenta" /> Motivation & Vision
      </h2>
      
      <Alert className="bg-igc-navy/5 border-igc-navy/20">
        <Info className="h-4 w-4 text-igc-navy" />
        <AlertDescription className="text-sm text-igc-navy">
          Expliquez vos motivations et comment votre équipe incarne les valeurs de l'IGC. Les champs marqués d'un astérisque (*) sont obligatoires.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="motivation" className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
            Pourquoi souhaitez-vous participer à l'IGC 2025 ? (3-5 lignes)
          </Label>
          <Textarea
            id="motivation"
            value={vision.motivation}
            onChange={(e) => handleChange('motivation', e.target.value)}
            className="min-h-[120px] border-igc-purple/20 focus-visible:ring-igc-magenta/30"
            placeholder="Expliquez les raisons pour lesquelles votre équipe souhaite participer à l'IGC 2025..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {vision.motivation.length}/500 caractères - {vision.motivation.split(/\s+/).filter(Boolean).length} mots
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="values" className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
            En quoi votre équipe incarne les valeurs de l'IGC ? (Créativité, esprit d'équipe, innovation)
          </Label>
          <Textarea
            id="values"
            value={vision.values}
            onChange={(e) => handleChange('values', e.target.value)}
            className="min-h-[120px] border-igc-purple/20 focus-visible:ring-igc-magenta/30"
            placeholder="Décrivez comment votre équipe incarne les valeurs de créativité, d'esprit d'équipe et d'innovation..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {vision.values.length}/500 caractères - {vision.values.split(/\s+/).filter(Boolean).length} mots
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="roboticsLevel" className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
              Niveau de connaissances en robotique de l'équipe
            </Label>
            <Select
              value={vision.roboticsLevel}
              onValueChange={(value) => handleChange('roboticsLevel', value as RoboticsLevel)}
            >
              <SelectTrigger id="roboticsLevel" className="w-full border-igc-purple/20 focus-visible:ring-igc-magenta/30">
                <SelectValue placeholder="Sélectionnez un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Débutant">Débutant - Première expérience en robotique</SelectItem>
                <SelectItem value="Intermédiaire">Intermédiaire - Quelques projets réalisés</SelectItem>
                <SelectItem value="Avancé">Avancé - Expérience significative en robotique</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
              L'équipe dispose-t-elle d'un espace de travail ?
            </Label>
            <RadioGroup
              value={vision.hasWorkspace ? "yes" : "no"}
              onValueChange={(value) => handleChange('hasWorkspace', value === "yes")}
              className="flex space-x-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="yes" 
                  id="workspace-yes" 
                  className="border-igc-navy/50 text-igc-magenta"
                />
                <Label 
                  htmlFor="workspace-yes" 
                  className="font-normal text-sm"
                >
                  Oui
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="no" 
                  id="workspace-no" 
                  className="border-igc-navy/50 text-igc-magenta"
                />
                <Label 
                  htmlFor="workspace-no" 
                  className="font-normal text-sm"
                >
                  Non
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamVisionForm;
