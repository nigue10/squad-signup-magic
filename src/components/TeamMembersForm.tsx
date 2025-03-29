
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Info, Plus, Trash2, UserPlus } from "lucide-react";
import { TeamMember, TeamCategory } from "@/types/igc";
import { createEmptyMember } from '@/lib/helpers';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TeamMembersFormProps {
  members: TeamMember[];
  onChange: (members: TeamMember[]) => void;
  category: TeamCategory;
}

const TeamMembersForm: React.FC<TeamMembersFormProps> = ({ members, onChange, category }) => {
  const minMembers = category === 'Secondaire' ? 6 : 4;
  const maxMembers = category === 'Secondaire' ? 6 : 6;
  
  const addMember = () => {
    if (members.length < maxMembers) {
      onChange([...members, createEmptyMember()]);
    }
  };
  
  const removeMember = (id: string) => {
    onChange(members.filter((member) => member.id !== id));
  };
  
  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    onChange(
      members.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  // Fonction pour compter le nombre d'information complètes pour un membre
  const getMemberCompletionStatus = (member: TeamMember) => {
    const requiredFields = ['name', 'gender', 'birthDate', 'level', 'school', 'city', 'commune'];
    const completedFields = requiredFields.filter(field => !!member[field as keyof TeamMember]);
    return {
      completed: completedFields.length,
      total: requiredFields.length,
      percentage: Math.round((completedFields.length / requiredFields.length) * 100)
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-igc-navy flex items-center gap-2 pb-2 border-b border-igc-purple/30">
        <Users className="w-5 h-5 text-igc-magenta" /> Composition de l'Équipe
      </h2>
      
      <Alert className="bg-igc-navy/5 border-igc-navy/20">
        <Info className="h-4 w-4 text-igc-navy" />
        <AlertDescription className="text-sm text-igc-navy">
          <p>👉 Le chef d'équipe doit figurer dans la liste ci-dessous et y renseigner ses coordonnées.</p>
          <p className="mt-1">
            ✅ Rappel composition : 
            <span className="font-medium text-igc-magenta"> {category === 'Secondaire' ? '6 membres obligatoires' : '4 à 6 membres'}</span>
          </p>
          <p className="mt-1 italic text-xs">NB : Les équipes composées de filles sont très encouragées.</p>
        </AlertDescription>
      </Alert>
      
      <div className="overflow-x-auto">
        {members.map((member, index) => {
          const status = getMemberCompletionStatus(member);
          return (
            <div key={member.id} className="mb-6 p-4 border border-igc-purple/10 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-igc-navy text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-medium text-igc-navy">
                    {member.name ? member.name : `Membre ${index + 1}`}
                  </h3>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-xs text-gray-500">
                    Complété à <span className={`font-medium ${status.percentage === 100 ? 'text-green-500' : 'text-amber-500'}`}>{status.percentage}%</span>
                  </div>

                  {members.length > minMembers && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeMember(member.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Supprimer ce membre</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <label htmlFor={`name-${member.id}`} className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
                    Nom & Prénoms
                  </label>
                  <Input
                    id={`name-${member.id}`}
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
                    placeholder="Ex: Diallo Mamadou"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`gender-${member.id}`} className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
                    Sexe
                  </label>
                  <Select 
                    value={member.gender}
                    onValueChange={(value) => updateMember(member.id, 'gender', value)}
                  >
                    <SelectTrigger id={`gender-${member.id}`} className="border-igc-purple/20 focus-visible:ring-igc-magenta/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`birthDate-${member.id}`} className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
                    Date de naissance
                  </label>
                  <Input
                    id={`birthDate-${member.id}`}
                    type="date"
                    value={member.birthDate}
                    onChange={(e) => updateMember(member.id, 'birthDate', e.target.value)}
                    className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <label htmlFor={`level-${member.id}`} className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
                    Classe / Niveau
                  </label>
                  <Input
                    id={`level-${member.id}`}
                    value={member.level}
                    onChange={(e) => updateMember(member.id, 'level', e.target.value)}
                    className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
                    placeholder="Ex: Terminal D ou Licence 2"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`school-${member.id}`} className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
                    Établissement
                  </label>
                  <Input
                    id={`school-${member.id}`}
                    value={member.school}
                    onChange={(e) => updateMember(member.id, 'school', e.target.value)}
                    className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
                    placeholder="Ex: Lycée Technique d'Abidjan"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`city-${member.id}`} className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
                    Ville
                  </label>
                  <Input
                    id={`city-${member.id}`}
                    value={member.city}
                    onChange={(e) => updateMember(member.id, 'city', e.target.value)}
                    className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
                    placeholder="Ex: Abidjan"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor={`commune-${member.id}`} className="text-sm font-medium text-igc-navy/90 after:content-['*'] after:text-igc-magenta after:ml-0.5">
                    Commune
                  </label>
                  <Input
                    id={`commune-${member.id}`}
                    value={member.commune}
                    onChange={(e) => updateMember(member.id, 'commune', e.target.value)}
                    className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
                    placeholder="Ex: Cocody"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`phone-${member.id}`} className="text-sm font-medium text-igc-navy/90">
                    Téléphone (facultatif)
                  </label>
                  <Input
                    id={`phone-${member.id}`}
                    type="tel"
                    value={member.phone || ''}
                    onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                    className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
                    placeholder="Ex: +225 07 XX XX XX XX"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor={`email-${member.id}`} className="text-sm font-medium text-igc-navy/90">
                    Email (facultatif)
                  </label>
                  <Input
                    id={`email-${member.id}`}
                    type="email"
                    value={member.email || ''}
                    onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                    className="border-igc-purple/20 focus-visible:ring-igc-magenta/30"
                    placeholder="Ex: membre@email.com"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {members.length < maxMembers && (
        <Button 
          type="button" 
          onClick={addMember}
          variant="outline"
          className="mt-4 border-igc-purple text-igc-magenta hover:bg-igc-purple/10"
        >
          <UserPlus className="mr-2 h-4 w-4" /> Ajouter un membre
        </Button>
      )}
    </div>
  );
};

export default TeamMembersForm;
