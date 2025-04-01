
import React from 'react';
import { 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowUpDown } from 'lucide-react';

type SortKey = 'name' | 'category' | 'institution' | 'city' | 'email' | 'phone' | 
               'status' | 'qcmScore' | 'qcmQualified' | 'interviewDate' | 'interviewTime' | 
               'interviewLink' | 'interviewScore' | 'interviewNotes' | 'interviewRank' | 
               'decision' | 'comments';
type SortOrder = 'asc' | 'desc';

interface TeamTableHeaderProps {
  onSort: (key: SortKey) => void;
  sortConfig: {key: SortKey, direction: SortOrder};
}

const TeamTableHeader = ({ onSort, sortConfig }: TeamTableHeaderProps) => {
  const renderSortableHeader = (key: SortKey, label: string) => (
    <TableHead 
      className="cursor-pointer text-white hover:text-igc-purple transition-colors font-semibold px-3 py-3"
      onClick={() => onSort(key)}
    >
      <div className="flex items-center">
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
      </div>
    </TableHead>
  );

  return (
    <TableHeader className="bg-igc-navy text-white">
      <TableRow>
        {renderSortableHeader('name', "Nom de l'équipe")}
        {renderSortableHeader('category', "Catégorie")}
        {renderSortableHeader('institution', "École/Université")}
        {renderSortableHeader('city', "Ville")}
        {renderSortableHeader('email', "Email")}
        {renderSortableHeader('phone', "Numéro WhatsApp")}
        {renderSortableHeader('status', "Statut")}
        {renderSortableHeader('qcmScore', "Score QCM")}
        {renderSortableHeader('qcmQualified', "Qualification QCM")}
        {renderSortableHeader('interviewDate', "Date entretien")}
        {renderSortableHeader('interviewTime', "Heure entretien")}
        {renderSortableHeader('interviewLink', "Lien Google Meet")}
        {renderSortableHeader('interviewScore', "Score entretien")}
        {renderSortableHeader('interviewNotes', "Notes interviewers")}
        {renderSortableHeader('interviewRank', "Classement entretien")}
        {renderSortableHeader('decision', "Décision")}
        {renderSortableHeader('comments', "Commentaires")}
        <TableHead className="text-white">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default TeamTableHeader;
