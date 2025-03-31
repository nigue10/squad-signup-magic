
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TeamRegistration, TeamStatus, TeamCategory, TeamDecision } from '@/types/igc';
import { toast } from 'sonner';
import { ArrowUpDown, MoreHorizontal, DownloadCloud, FileText } from 'lucide-react';

interface TeamTrackingTableProps {
  teams: TeamRegistration[];
  onTeamUpdate: (teamId: string, updatedData: Partial<TeamRegistration>) => void;
  onTeamDelete?: (teamId: string) => void;
  onExportTeamPDF?: (teamId: string) => void;
  onRecalculatePoints?: () => void;
}

type SortKey = 'name' | 'institution' | 'category' | 'qcmScore' | 'status';
type SortOrder = 'asc' | 'desc';

const TeamTrackingTable = ({ 
  teams, 
  onTeamUpdate, 
  onTeamDelete, 
  onExportTeamPDF,
  onRecalculatePoints 
}: TeamTrackingTableProps) => {
  const [sortedTeams, setSortedTeams] = useState<TeamRegistration[]>([]);
  const [sortConfig, setSortConfig] = useState<{key: SortKey, direction: SortOrder}>({
    key: 'name',
    direction: 'asc'
  });
  
  // Initialize sorted teams
  useEffect(() => {
    setSortedTeams([...teams]);
  }, [teams]);
  
  // Function to handle table sorting
  const handleSort = (key: SortKey) => {
    let direction: SortOrder = 'asc';
    
    // If already sorting by this key, toggle direction
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedData = [...teams].sort((a, b) => {
      // Handle nested properties
      if (key === 'name') {
        const valueA = a.generalInfo?.name || '';
        const valueB = b.generalInfo?.name || '';
        return direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      if (key === 'institution') {
        const valueA = a.generalInfo?.institution || '';
        const valueB = b.generalInfo?.institution || '';
        return direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      if (key === 'category') {
        const valueA = a.generalInfo?.category || '';
        const valueB = b.generalInfo?.category || '';
        return direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      // Handle numeric values
      if (key === 'qcmScore') {
        const valueA = a.qcmScore || 0;
        const valueB = b.qcmScore || 0;
        return direction === 'asc' 
          ? valueA - valueB 
          : valueB - valueA;
      }
      
      // Handle status
      if (key === 'status') {
        const valueA = a.status || '';
        const valueB = b.status || '';
        return direction === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return 0;
    });
    
    setSortedTeams(sortedData);
    setSortConfig({ key, direction });
  };
  
  // Function to format the status badge
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
  
  // Calculate points for an individual team based on various factors
  const calculatePoints = (team: TeamRegistration): number => {
    let points = 0;
    
    // Points from QCM score (if available)
    if (team.qcmScore) {
      points += team.qcmScore;
    }
    
    // Points from interview score (if available, scaled to match QCM scale)
    if (team.interviewScore !== undefined && team.interviewScore !== null) {
      // Interview score is on scale of 0-10, multiply by 10 to match QCM scale
      points += team.interviewScore * 10;
    }
    
    // Bonus points for team composition diversity
    if (team.members) {
      const hasMaleMembers = team.members.some(member => member.gender === 'M');
      const hasFemaleMembers = team.members.some(member => member.gender === 'F');
      
      // Bonus for gender diversity
      if (hasMaleMembers && hasFemaleMembers) {
        points += 5;
      }
    }
    
    // Bonus points for skills diversity
    if (team.skills) {
      let skillCount = 0;
      if (team.skills.arduino) skillCount++;
      if (team.skills.sensors) skillCount++;
      if (team.skills.design3d) skillCount++;
      if (team.skills.basicElectronics) skillCount++;
      if (team.skills.programming) skillCount++;
      if (team.skills.robotDesign) skillCount++;
      if (team.skills.remoteControl) skillCount++;
      if (team.skills.teamwork) skillCount++;
      if (team.skills.other) skillCount++;
      
      // Add bonus points based on skill diversity
      points += skillCount * 2;
    }
    
    return Math.round(points);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-igc-navy">Tableau de Suivi des Équipes</h2>
        <div className="flex gap-2">
          <Button 
            onClick={onRecalculatePoints} 
            variant="outline"
            className="border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white hover:border-igc-magenta"
          >
            Recalculer les points
          </Button>
          
          <Button
            onClick={() => {
              const allTeamsIds = teams.map(team => team.id);
              allTeamsIds.forEach(id => {
                if (id && onExportTeamPDF) {
                  onExportTeamPDF(id);
                }
              });
              toast.success(`${teams.length} fiches exportées avec succès`);
            }}
            variant="outline"
            className="border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white hover:border-igc-magenta"
          >
            <DownloadCloud className="mr-2 h-4 w-4" />
            Exporter toutes les fiches
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <Table>
          <TableHeader className="bg-igc-navy text-white">
            <TableRow>
              <TableHead 
                className="cursor-pointer text-white hover:text-igc-purple transition-colors"
                onClick={() => handleSort('name')}
              >
                Nom de l'équipe
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white hover:text-igc-purple transition-colors"
                onClick={() => handleSort('institution')}
              >
                École/Institution
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white hover:text-igc-purple transition-colors"
                onClick={() => handleSort('category')}
              >
                Catégorie
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white hover:text-igc-purple transition-colors"
                onClick={() => handleSort('qcmScore')}
              >
                Points
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead 
                className="cursor-pointer text-white hover:text-igc-purple transition-colors"
                onClick={() => handleSort('status')}
              >
                Statut
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTeams.map((team) => (
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
            ))}
            
            {sortedTeams.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Aucune équipe inscrite. 
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamTrackingTable;
