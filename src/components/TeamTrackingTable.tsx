
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TeamRegistration } from '@/types/igc';
import { toast } from 'sonner';
import { DownloadCloud, RefreshCw } from 'lucide-react';
import { calculatePoints, sortTeams } from '@/utils/teamCalculations';
import TeamTableHeader from './TeamTableHeader';
import TeamTableRow from './TeamTableRow';

type SortKey = 'name' | 'institution' | 'category' | 'qcmScore' | 'status';
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
    
    const sorted = sortTeams(teams, key, direction);
    setSortedTeams(sorted);
    setSortConfig({ key, direction });
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
            className="border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white hover:border-igc-magenta"
          >
            <DownloadCloud className="mr-2 h-4 w-4" />
            Exporter toutes les fiches
          </Button>
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
                calculatePoints={calculatePoints}
                onExportTeamPDF={onExportTeamPDF}
                onTeamDelete={onTeamDelete}
              />
            ))}
            
            {sortedTeams.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
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
