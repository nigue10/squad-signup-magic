
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { TeamGeneralInfo, TeamCategory } from "@/types/igc";

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
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-igc-blue flex items-center gap-2 pb-2 border-b border-gray-200">
        <MapPin className="w-5 h-5" /> Informations Générales sur l'Équipe
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium">Date</Label>
          <Input
            id="date"
            type="text"
            value={generalInfo.date}
            onChange={(e) => handleChange('date', e.target.value)}
            readOnly
            className="bg-gray-100"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-0.5">Nom de l'équipe</Label>
          <Input
            id="name"
            type="text"
            value={generalInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-0.5">Catégorie</Label>
          <Select
            value={generalInfo.category}
            onValueChange={(value) => handleChange('category', value as TeamCategory)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Secondaire">Secondaire</SelectItem>
              <SelectItem value="Supérieur">Supérieur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-0.5">Ville</Label>
          <Input
            id="city"
            type="text"
            value={generalInfo.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="commune" className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-0.5">Commune</Label>
          <Input
            id="commune"
            type="text"
            value={generalInfo.commune}
            onChange={(e) => handleChange('commune', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="institution" className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-0.5">Établissement ou structure de rattachement</Label>
          <Input
            id="institution"
            type="text"
            value={generalInfo.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pedagogicalReferentName" className="text-sm font-medium">Nom du référent pédagogique</Label>
          <Input
            id="pedagogicalReferentName"
            type="text"
            value={generalInfo.pedagogicalReferentName || ''}
            onChange={(e) => handleChange('pedagogicalReferentName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pedagogicalReferentPhone" className="text-sm font-medium">Téléphone référent pédagogique</Label>
          <Input
            id="pedagogicalReferentPhone"
            type="tel"
            value={generalInfo.pedagogicalReferentPhone || ''}
            onChange={(e) => handleChange('pedagogicalReferentPhone', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pedagogicalReferentEmail" className="text-sm font-medium">Email référent pédagogique</Label>
          <Input
            id="pedagogicalReferentEmail"
            type="email"
            value={generalInfo.pedagogicalReferentEmail || ''}
            onChange={(e) => handleChange('pedagogicalReferentEmail', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="teamLeaderName" className="text-sm font-medium">Nom du chef d'équipe</Label>
          <Input
            id="teamLeaderName"
            type="text"
            value={generalInfo.teamLeaderName}
            onChange={(e) => handleChange('teamLeaderName', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamGeneralInfoForm;
