
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";
import { TeamMember, TeamCategory } from "@/types/igc";
import { createEmptyMember } from '@/lib/helpers';
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-igc-blue flex items-center gap-2 pb-2 border-b border-gray-200">
        <Users className="w-5 h-5" /> Composition de l'Équipe
      </h2>
      
      <div className="bg-blue-50 p-3 rounded-md mb-2">
        <p className="text-sm font-medium">👉 Le chef d'équipe doit figurer dans la liste ci-dessous et y renseigner ses coordonnées.</p>
      </div>
      
      <Alert className="bg-green-50 border-green-200 mb-4">
        <AlertDescription>
          <p className="text-sm">
            ✅ Rappel composition : 
            <br />• Secondaire : 6 membres
            <br />• Supérieur : 4 à 6 membres
            <br /><span className="italic">NB : Les équipes composées de filles sont très encouragées.</span>
          </p>
        </AlertDescription>
      </Alert>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Nom & Prénoms *</th>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Sexe *</th>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Date de naissance *</th>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Classe / Niveau *</th>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Établissement *</th>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Ville *</th>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Commune *</th>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Téléphone</th>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Email</th>
              <th className="p-2 text-xs font-medium text-gray-700 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  <Input
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2 border">
                  <Select 
                    value={member.gender}
                    onValueChange={(value) => updateMember(member.id, 'gender', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2 border">
                  <Input
                    type="date"
                    value={member.birthDate}
                    onChange={(e) => updateMember(member.id, 'birthDate', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2 border">
                  <Input
                    value={member.level}
                    onChange={(e) => updateMember(member.id, 'level', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2 border">
                  <Input
                    value={member.school}
                    onChange={(e) => updateMember(member.id, 'school', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2 border">
                  <Input
                    value={member.city}
                    onChange={(e) => updateMember(member.id, 'city', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2 border">
                  <Input
                    value={member.commune}
                    onChange={(e) => updateMember(member.id, 'commune', e.target.value)}
                    className="w-full"
                    required
                  />
                </td>
                <td className="p-2 border">
                  <Input
                    type="tel"
                    value={member.phone || ''}
                    onChange={(e) => updateMember(member.id, 'phone', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="p-2 border">
                  <Input
                    type="email"
                    value={member.email || ''}
                    onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                    className="w-full"
                  />
                </td>
                <td className="p-2 border">
                  {members.length > minMembers && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeMember(member.id)}
                    >
                      Supprimer
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {members.length < maxMembers && (
        <Button 
          type="button" 
          onClick={addMember}
          className="mt-2"
        >
          Ajouter un membre
        </Button>
      )}
    </div>
  );
};

export default TeamMembersForm;
