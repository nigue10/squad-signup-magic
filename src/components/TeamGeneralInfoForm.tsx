
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
      <h2 className="form-section-title">
        <MapPin className="w-5 h-5" /> Informations Générales sur l'Équipe
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-field">
          <Label htmlFor="date" className="form-label">Date</Label>
          <Input
            id="date"
            type="text"
            value={generalInfo.date}
            onChange={(e) => handleChange('date', e.target.value)}
            readOnly
            className="bg-gray-100"
          />
        </div>
        
        <div className="form-field">
          <Label htmlFor="name" className="form-label required">Nom de l'équipe</Label>
          <Input
            id="name"
            type="text"
            value={generalInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="form-field">
          <Label htmlFor="category" className="form-label required">Catégorie</Label>
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
        
        <div className="form-field">
          <Label htmlFor="city" className="form-label required">Ville</Label>
          <Input
            id="city"
            type="text"
            value={generalInfo.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
          />
        </div>
        
        <div className="form-field">
          <Label htmlFor="commune" className="form-label required">Commune</Label>
          <Input
            id="commune"
            type="text"
            value={generalInfo.commune}
            onChange={(e) => handleChange('commune', e.target.value)}
            required
          />
        </div>
        
        <div className="form-field">
          <Label htmlFor="institution" className="form-label required">Établissement ou structure de rattachement</Label>
          <Input
            id="institution"
            type="text"
            value={generalInfo.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            required
          />
        </div>
        
        <div className="form-field">
          <Label htmlFor="pedagogicalReferentName" className="form-label">Nom du référent pédagogique</Label>
          <Input
            id="pedagogicalReferentName"
            type="text"
            value={generalInfo.pedagogicalReferentName || ''}
            onChange={(e) => handleChange('pedagogicalReferentName', e.target.value)}
          />
        </div>
        
        <div className="form-field">
          <Label htmlFor="pedagogicalReferentPhone" className="form-label">Téléphone référent pédagogique</Label>
          <Input
            id="pedagogicalReferentPhone"
            type="tel"
            value={generalInfo.pedagogicalReferentPhone || ''}
            onChange={(e) => handleChange('pedagogicalReferentPhone', e.target.value)}
          />
        </div>
        
        <div className="form-field">
          <Label htmlFor="pedagogicalReferentEmail" className="form-label">Email référent pédagogique</Label>
          <Input
            id="pedagogicalReferentEmail"
            type="email"
            value={generalInfo.pedagogicalReferentEmail || ''}
            onChange={(e) => handleChange('pedagogicalReferentEmail', e.target.value)}
          />
        </div>
        
        <div className="form-field">
          <Label htmlFor="teamLeaderName" className="form-label">Nom du chef d'équipe</Label>
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
