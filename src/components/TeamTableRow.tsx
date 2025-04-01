
import React from 'react';
import { 
  TableCell, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeamRegistration, TeamStatus } from '@/types/igc';
import { MoreHorizontal, FileText } from 'lucide-react';
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
  calculatePoints: (team: TeamRegistration) => number;
  onExportTeamPDF?: (teamId: string) => void;
  onTeamDelete?: (teamId: string) => void;
}

const TeamTableRow = ({ team, calculatePoints, onExportTeamPDF, onTeamDelete }: TeamTableRowProps) => {
  
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
  
  return (
    <TableRow 
      key={team.id} 
      className="transition-colors hover:bg-igc-navy/5"
    >
      <TableCell className="font-medium">{team.generalInfo.name}</TableCell>
      <TableCell>{team.generalInfo.institution}</TableCell>
      <TableCell>
        <Badge variant={team.generalInfo.category === 'Secondaire' ? 'secondary' : 'outline'}>
          {team.generalInfo.category}
        </Badge>
      </TableCell>
      <TableCell className="font-semibold">
        {calculatePoints(team)}
      </TableCell>
      <TableCell>
        {getStatusBadge(team.status as TeamStatus)}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
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
      </TableCell>
    </TableRow>
  );
};

export default TeamTableRow;
