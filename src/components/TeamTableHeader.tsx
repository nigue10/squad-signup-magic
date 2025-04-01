
import React from 'react';
import { 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowUpDown } from 'lucide-react';

type SortKey = 'name' | 'institution' | 'category' | 'qcmScore' | 'status';
type SortOrder = 'asc' | 'desc';

interface TeamTableHeaderProps {
  onSort: (key: SortKey) => void;
  sortConfig: {key: SortKey, direction: SortOrder};
}

const TeamTableHeader = ({ onSort, sortConfig }: TeamTableHeaderProps) => {
  return (
    <TableHeader className="bg-igc-navy text-white">
      <TableRow>
        <TableHead 
          className="cursor-pointer text-white hover:text-igc-purple transition-colors"
          onClick={() => onSort('name')}
        >
          Nom de l'équipe
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead 
          className="cursor-pointer text-white hover:text-igc-purple transition-colors"
          onClick={() => onSort('institution')}
        >
          École/Institution
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead 
          className="cursor-pointer text-white hover:text-igc-purple transition-colors"
          onClick={() => onSort('category')}
        >
          Catégorie
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead 
          className="cursor-pointer text-white hover:text-igc-purple transition-colors"
          onClick={() => onSort('qcmScore')}
        >
          Points
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead 
          className="cursor-pointer text-white hover:text-igc-purple transition-colors"
          onClick={() => onSort('status')}
        >
          Statut
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead className="text-white">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TeamTableHeader;
