
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Info } from "lucide-react";
import { TeamGeneralInfo, TeamCategory } from "@/types/igc";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeamGeneralInfoFormProps {
  generalInfo: TeamGeneralInfo;
  onChange: (generalInfo: TeamGeneralInfo) => void;
}

const TeamGeneralInfoForm: React.FC<TeamGeneralInfoFormProps> = ({ generalInfo, onChange }) => {
  const handleChange = (field: keyof TeamGeneralInfo, value: string) => {
    onChange({
      ...generalInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-igc-navy flex items-center gap-2 pb-2 border-b border-igc-purple/30">
        <MapPin className="w-5 h-5 text-igc-magenta" /> Informations Générales sur l'Équipe
      </h2>
      
      <Alert className="bg-igc-navy/5 border-igc-navy/20">
        <Info className="h-4 w-4 text-igc-navy" />
        <AlertDescription className="text-sm text-igc-navy">
          Complétez les informations générales de votre équipe. Les champs marqués d'un astérisque (*) sont obligatoires.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-igc-navy/90">Date d'inscription</Label>
          <Input
            id="date"
            type="text"
            value={generalInfo.date}
            onChange={(e) => handleChange('date', e.target.value)}
            readOnly
            className="bg-gray-50 border-igc-purple/20 focus-visible:ring-igc-magenta/30"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">Nom de l'équipe</Label>
          <Input
            id="name"
            type="text"
            value={generalInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
            placeholder="Ex: Robotics Master"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">Catégorie</Label>
          <Select
            value={generalInfo.category}
            onValueChange={(value) => handleChange('category', value as TeamCategory)}
          >
            <SelectTrigger className="border-igc-purple/20 focus-visible:ring-igc-magenta/30">
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Secondaire">Secondaire</SelectItem>
              <SelectItem value="Supérieur">Supérieur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">Ville</Label>
          <Input
            id="city"
            type="text"
            value={generalInfo.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
            className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
            placeholder="Ex: Abidjan"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="commune" className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">Commune</Label>
          <Input
            id="commune"
            type="text"
            value={generalInfo.commune}
            onChange={(e) => handleChange('commune', e.target.value)}
            required
            className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
            placeholder="Ex: Cocody"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institution" className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">Établissement ou structure de rattachement</Label>
          <Input
            id="institution"
            type="text"
            value={generalInfo.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            required
            className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
            placeholder="Ex: Lycée Technique d'Abidjan"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="teamLeaderName" className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">Nom du chef d'équipe</Label>
          <Input
            id="teamLeaderName"
            type="text"
            value={generalInfo.teamLeaderName}
            onChange={(e) => handleChange('teamLeaderName', e.target.value)}
            required
            className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
            placeholder="Ex: Kouamé Aya"
          />
        </div>
      </div>
      
      <div className="bg-igc-purple/5 p-4 rounded-lg space-y-4 mt-4">
        <h3 className="font-medium text-igc-navy text-sm">Informations du référent pédagogique (facultatif)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pedagogicalReferentName" className="text-sm font-medium text-igc-navy/90">Nom du référent</Label>
            <Input
              id="pedagogicalReferentName"
              type="text"
              value={generalInfo.pedagogicalReferentName || ''}
              onChange={(e) => handleChange('pedagogicalReferentName', e.target.value)}
              className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
              placeholder="Ex: Prof. Konan"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pedagogicalReferentPhone" className="text-sm font-medium text-igc-navy/90">Téléphone référent</Label>
            <Input
              id="pedagogicalReferentPhone"
              type="tel"
              value={generalInfo.pedagogicalReferentPhone || ''}
              onChange={(e) => handleChange('pedagogicalReferentPhone', e.target.value)}
              className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
              placeholder="Ex: +225 07 XX XX XX XX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pedagogicalReferentEmail" className="text-sm font-medium text-igc-navy/90">Email référent</Label>
            <Input
              id="pedagogicalReferentEmail"
              type="email"
              value={generalInfo.pedagogicalReferentEmail || ''}
              onChange={(e) => handleChange('pedagogicalReferentEmail', e.target.value)}
              className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
              placeholder="Ex: referent@ecole.edu"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamGeneralInfoForm;
