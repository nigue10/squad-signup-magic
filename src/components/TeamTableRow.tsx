
import React, { useState } from 'react';
import { 
  TableCell, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamRegistration, TeamStatus } from '@/types/igc';
import { MoreHorizontal, FileText, Save } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface TeamTableRowProps {
  team: TeamRegistration;
  onTeamUpdate: (teamId: string, updatedData: Partial<TeamRegistration>) => void;
  onExportTeamPDF?: (teamId: string) => void;
  onTeamDelete?: (teamId: string) => void;
}

const TeamTableRow = ({ team, onTeamUpdate, onExportTeamPDF, onTeamDelete }: TeamTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: team.status || 'Inscrit',
    qcmScore: team.qcmScore,
    interviewDate: team.interviewDate || '',
    interviewTime: team.interviewTime || '',
    interviewLink: team.interviewLink || '',
    interviewScore: team.interviewScore,
    interviewNotes: team.interviewNotes || '',
    comments: team.comments || ''
  });

  const [errors, setErrors] = useState({
    qcmScore: false,
    interviewScore: false
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate QCM Score (0-100)
    if (field === 'qcmScore') {
      const numValue = parseFloat(value);
      const isValid = !isNaN(numValue) && numValue >= 0 && numValue <= 100;
      setErrors(prev => ({ ...prev, qcmScore: !isValid }));
    }
    
    // Validate Interview Score (0-10)
    if (field === 'interviewScore') {
      const numValue = parseFloat(value);
      const isValid = !isNaN(numValue) && numValue >= 0 && numValue <= 10;
      setErrors(prev => ({ ...prev, interviewScore: !isValid }));
    }
  };

  const handleSaveChanges = () => {
    // Check for validation errors
    if (errors.qcmScore || errors.interviewScore) {
      toast.error("Veuillez corriger les erreurs avant de sauvegarder");
      return;
    }

    // Prepare updated data
    const updatedData: Partial<TeamRegistration> = {
      status: formData.status as TeamStatus,
      qcmScore: formData.qcmScore !== undefined ? Number(formData.qcmScore) : undefined,
      interviewDate: formData.interviewDate,
      interviewTime: formData.interviewTime,
      interviewLink: formData.interviewLink,
      interviewScore: formData.interviewScore !== undefined ? Number(formData.interviewScore) : undefined,
      interviewNotes: formData.interviewNotes,
      comments: formData.comments
    };

    // Save changes
    onTeamUpdate(team.id!, updatedData);
    setIsEditing(false);
    toast.success("Modifications enregistrées");
  };
  
  const getStatusBadge = (status?: TeamStatus) => {
    if (!status) return <Badge variant="outline">Non défini</Badge>;
    
    switch(status) {
      case 'Inscrit':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Inscrit</Badge>;
      case 'QCM soumis':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">QCM soumis</Badge>;
      case 'Éliminé QCM':
        return <Badge variant="destructive">Éliminé QCM</Badge>;
      case 'Qualifié pour entretien':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Qualifié</Badge>;
      case 'Entretien réalisé':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Entretien réalisé</Badge>;
      case 'Sélectionné':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Sélectionné</Badge>;
      case 'Non retenu':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700">Non retenu</Badge>;
      default:
        return <Badge variant="outline">Non défini</Badge>;
    }
  };

  const getQualificationBadge = (isQualified?: boolean) => {
    if (isQualified === undefined) return null;
    
    return isQualified ? 
      <Badge className="bg-green-500 text-white">Oui</Badge> : 
      <Badge className="bg-red-500 text-white">Non</Badge>;
  };
  
  const getDecisionBadge = (decision?: string) => {
    if (!decision) return null;
    
    return decision === 'Sélectionné' ? 
      <Badge className="bg-green-500 text-white">Sélectionné</Badge> : 
      <Badge className="bg-red-500 text-white">Non retenu</Badge>;
  };
  
  return (
    <TableRow 
      key={team.id} 
      className="transition-colors hover:bg-igc-navy/5 border-b border-gray-200"
    >
      <TableCell className="font-medium">{team.generalInfo.name}</TableCell>
      <TableCell>
        <Badge variant={team.generalInfo.category === 'Secondaire' ? 'secondary' : 'outline'}>
          {team.generalInfo.category}
        </Badge>
      </TableCell>
      <TableCell>{team.generalInfo.institution}</TableCell>
      <TableCell>{team.generalInfo.city}</TableCell>
      <TableCell>{team.generalInfo.pedagogicalReferentEmail || '-'}</TableCell>
      <TableCell>{team.generalInfo.pedagogicalReferentPhone || '-'}</TableCell>
      
      <TableCell>
        {isEditing ? (
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleInputChange('status', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inscrit">Inscrit</SelectItem>
              <SelectItem value="QCM soumis">QCM soumis</SelectItem>
              <SelectItem value="Éliminé QCM">Éliminé QCM</SelectItem>
              <SelectItem value="Qualifié pour entretien">Qualifié pour entretien</SelectItem>
              <SelectItem value="Entretien réalisé">Entretien réalisé</SelectItem>
              <SelectItem value="Sélectionné">Sélectionné</SelectItem>
              <SelectItem value="Non retenu">Non retenu</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          getStatusBadge(team.status as TeamStatus)
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input 
            type="number" 
            min="0" 
            max="100"
            value={formData.qcmScore || ''} 
            onChange={(e) => handleInputChange('qcmScore', e.target.value)}
            className={errors.qcmScore ? 'border-red-500' : ''}
          />
        ) : (
          team.qcmScore || '-'
        )}
      </TableCell>
      
      <TableCell>
        {getQualificationBadge(team.qcmQualified)}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input 
            type="date" 
            value={formData.interviewDate || ''} 
            onChange={(e) => handleInputChange('interviewDate', e.target.value)}
          />
        ) : (
          team.interviewDate || '-'
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input 
            type="time" 
            value={formData.interviewTime || ''} 
            onChange={(e) => handleInputChange('interviewTime', e.target.value)}
          />
        ) : (
          team.interviewTime || '-'
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input 
            type="text" 
            value={formData.interviewLink || ''} 
            onChange={(e) => handleInputChange('interviewLink', e.target.value)}
            placeholder="meet.google.com/xxx"
          />
        ) : (
          team.interviewLink || '-'
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input 
            type="number" 
            min="0" 
            max="10"
            step="0.1"
            value={formData.interviewScore || ''} 
            onChange={(e) => handleInputChange('interviewScore', e.target.value)}
            className={errors.interviewScore ? 'border-red-500' : ''}
          />
        ) : (
          team.interviewScore || '-'
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input 
            type="text" 
            value={formData.interviewNotes || ''} 
            onChange={(e) => handleInputChange('interviewNotes', e.target.value)}
          />
        ) : (
          team.interviewNotes || '-'
        )}
      </TableCell>
      
      <TableCell className="font-semibold">
        {team.interviewRank || '-'}
      </TableCell>
      
      <TableCell>
        {getDecisionBadge(team.decision)}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Input 
            type="text" 
            value={formData.comments || ''} 
            onChange={(e) => handleInputChange('comments', e.target.value)}
          />
        ) : (
          team.comments || '-'
        )}
      </TableCell>
      
      <TableCell>
        {isEditing ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSaveChanges}
            className="border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white hover:border-igc-magenta"
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Modifier
              </DropdownMenuItem>
              
              {onExportTeamPDF && (
                <DropdownMenuItem onClick={() => onExportTeamPDF(team.id!)}>
                  <FileText className="mr-2 h-4 w-4" /> Télécharger PDF
                </DropdownMenuItem>
              )}
              
              {onTeamDelete && (
                <DropdownMenuItem 
                  onClick={() => {
                    if (confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${team.generalInfo.name}" ?`)) {
                      onTeamDelete(team.id!);
                      toast.success("Équipe supprimée avec succès");
                    }
                  }}
                  className="text-red-600 hover:text-red-700 focus:text-red-700"
                >
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TeamTableRow;
