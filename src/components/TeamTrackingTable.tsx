
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TeamRegistration } from '@/types/igc';
import { toast } from 'sonner';
import { DownloadCloud, RefreshCw, Filter } from 'lucide-react';
import { calculateQcmQualification, sortTeams, updateTeamRankings } from '@/utils/teamCalculations';
import TeamTableHeader from './TeamTableHeader';
import TeamTableRow from './TeamTableRow';

type SortKey = 'name' | 'category' | 'institution' | 'city' | 'email' | 'phone' | 
               'status' | 'qcmScore' | 'qcmQualified' | 'interviewDate' | 'interviewTime' | 
               'interviewLink' | 'interviewScore' | 'interviewNotes' | 'interviewRank' | 
               'decision' | 'comments';
type SortOrder = 'asc' | 'desc';

interface TeamTrackingTableProps {
  teams: TeamRegistration[];
  onTeamUpdate: (teamId: string, updatedData: Partial<TeamRegistration>) => void;
  onTeamDelete?: (teamId: string) => void;
  onExportTeamPDF?: (teamId: string) => void;
  onRecalculatePoints?: () => void;
}

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
  
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Initialize sorted teams
  useEffect(() => {
    setSortedTeams([...teams]);
  }, [teams]);
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...teams];
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(team => team.generalInfo.category === filterCategory);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(team => team.status === filterStatus);
    }
    
    // Apply sorting
    const sorted = sortTeams(filtered, sortConfig.key as string, sortConfig.direction);
    setSortedTeams(sorted);
  }, [teams, filterCategory, filterStatus, sortConfig]);
  
  // Function to handle table sorting
  const handleSort = (key: SortKey) => {
    let direction: SortOrder = 'asc';
    
    // If already sorting by this key, toggle direction
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Function to handle team updates with automatic calculations
  const handleTeamUpdate = (teamId: string, updatedData: Partial<TeamRegistration>) => {
    // First update the team with provided data
    onTeamUpdate(teamId, updatedData);
    
    // Find the team that was updated
    const updatedTeam = teams.find(team => team.id === teamId);
    if (!updatedTeam) return;
    
    // Check if we need to perform additional calculations
    const needToUpdateQcmQualification = updatedData.qcmScore !== undefined;
    const needToUpdateRankings = updatedData.interviewScore !== undefined;
    
    // Calculate QCM Qualification if QCM Score was changed
    if (needToUpdateQcmQualification && updatedTeam) {
      const qcmQualified = calculateQcmQualification(
        updatedTeam.generalInfo.category,
        updatedData.qcmScore || 0
      );
      
      onTeamUpdate(teamId, { qcmQualified });
    }
    
    // Update rankings if interview score was changed
    if (needToUpdateRankings) {
      // Update all teams of the same category
      const updatedRankings = updateTeamRankings(
        teams,
        updatedTeam.generalInfo.category
      );
      
      // Update each team with its new ranking
      updatedRankings.forEach(rankingUpdate => {
        if (rankingUpdate.id !== teamId) { // Skip the team we just updated to avoid double update
          onTeamUpdate(rankingUpdate.id!, {
            interviewRank: rankingUpdate.interviewRank,
            decision: rankingUpdate.decision
          });
        }
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-igc-navy">Tableau de Suivi des Équipes</h2>
        <div className="flex gap-2">
          <Button 
            onClick={onRecalculatePoints} 
            variant="outline"
            className="border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white hover:border-igc-magenta transition-all duration-300 rounded-[47px]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
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
            className="border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white hover:border-igc-magenta transition-all duration-300 rounded-[47px]"
          >
            <DownloadCloud className="mr-2 h-4 w-4" />
            Exporter toutes les fiches
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-igc-navy" />
          <span className="font-medium text-sm">Filtres:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="filterCategory" className="text-sm">Catégorie:</label>
          <select 
            id="filterCategory" 
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="Secondaire">Secondaire</option>
            <option value="Supérieur">Supérieur</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="filterStatus" className="text-sm">Statut:</label>
          <select 
            id="filterStatus" 
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous</option>
            <option value="Inscrit">Inscrit</option>
            <option value="QCM soumis">QCM soumis</option>
            <option value="Éliminé QCM">Éliminé QCM</option>
            <option value="Qualifié pour entretien">Qualifié pour entretien</option>
            <option value="Entretien réalisé">Entretien réalisé</option>
            <option value="Sélectionné">Sélectionné</option>
            <option value="Non retenu">Non retenu</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <Table>
          <TeamTableHeader 
            onSort={handleSort}
            sortConfig={sortConfig}
          />
          
          <TableBody>
            {sortedTeams.map((team) => (
              <TeamTableRow 
                key={team.id}
                team={team}
                onTeamUpdate={handleTeamUpdate}
                onExportTeamPDF={onExportTeamPDF}
                onTeamDelete={onTeamDelete}
              />
            ))}
            
            {sortedTeams.length === 0 && (
              <tr>
                <td colSpan={18} className="text-center py-8 text-gray-500">
                  Aucune équipe inscrite. 
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamTrackingTable;
