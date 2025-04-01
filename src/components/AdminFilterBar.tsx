
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, X } from "lucide-react";

export interface FilterState {
  category: string;
  status: string;
  qcmScoreMin: number | null;
  qcmScoreMax: number | null;
  interviewScoreMin: number | null;
  interviewScoreMax: number | null;
  interviewDateStart: string;
  interviewDateEnd: string;
  searchTerm: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

const AdminFilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    status: 'all',
    qcmScoreMin: null,
    qcmScoreMax: null,
    interviewScoreMin: null,
    interviewScoreMax: null,
    interviewDateStart: '',
    interviewDateEnd: '',
    searchTerm: ''
  });

  const handleFilterChange = (field: keyof FilterState, value: any) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      category: 'all',
      status: 'all',
      qcmScoreMin: null,
      qcmScoreMax: null,
      interviewScoreMin: null,
      interviewScoreMax: null,
      interviewDateStart: '',
      interviewDateEnd: '',
      searchTerm: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-igc-navy" />
          <h3 className="text-lg font-medium text-igc-navy">Filtres</h3>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="text-igc-navy border-igc-navy hover:bg-igc-magenta hover:text-white hover:border-igc-magenta transition-colors"
          >
            {expanded ? 'Réduire' : 'Plus de filtres'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters}
            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition-colors"
          >
            <X className="w-4 h-4 mr-1" /> Réinitialiser
          </Button>
        </div>
      </div>
      
      {/* Basic filters (always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="searchTerm">Recherche</Label>
          <Input
            id="searchTerm"
            type="text"
            placeholder="Nom de l'équipe, école..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Select 
            value={filters.category} 
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="Secondaire">Secondaire</SelectItem>
              <SelectItem value="Supérieur">Supérieur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="Inscrit">Inscrit</SelectItem>
              <SelectItem value="QCM soumis">QCM soumis</SelectItem>
              <SelectItem value="Éliminé QCM">Éliminé QCM</SelectItem>
              <SelectItem value="Qualifié pour entretien">Qualifié pour entretien</SelectItem>
              <SelectItem value="Entretien réalisé">Entretien réalisé</SelectItem>
              <SelectItem value="Sélectionné">Sélectionné</SelectItem>
              <SelectItem value="Non retenu">Non retenu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Advanced filters (expandable) */}
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 mt-4 animate-fade-in">
          <div>
            <Label htmlFor="qcmScoreRange">Plage de Score QCM</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="qcmScoreMin"
                type="number"
                placeholder="Min"
                min="0"
                max="100"
                value={filters.qcmScoreMin || ''}
                onChange={(e) => handleFilterChange('qcmScoreMin', e.target.value ? Number(e.target.value) : null)}
                className="w-1/2"
              />
              <span>à</span>
              <Input
                id="qcmScoreMax"
                type="number"
                placeholder="Max"
                min="0"
                max="100"
                value={filters.qcmScoreMax || ''}
                onChange={(e) => handleFilterChange('qcmScoreMax', e.target.value ? Number(e.target.value) : null)}
                className="w-1/2"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="interviewScoreRange">Plage de Score Entretien</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="interviewScoreMin"
                type="number"
                placeholder="Min"
                min="0"
                max="10"
                step="0.1"
                value={filters.interviewScoreMin || ''}
                onChange={(e) => handleFilterChange('interviewScoreMin', e.target.value ? Number(e.target.value) : null)}
                className="w-1/2"
              />
              <span>à</span>
              <Input
                id="interviewScoreMax"
                type="number"
                placeholder="Max"
                min="0"
                max="10"
                step="0.1"
                value={filters.interviewScoreMax || ''}
                onChange={(e) => handleFilterChange('interviewScoreMax', e.target.value ? Number(e.target.value) : null)}
                className="w-1/2"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="interviewDateRange">Dates d'entretien</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="interviewDateStart"
                type="date"
                value={filters.interviewDateStart}
                onChange={(e) => handleFilterChange('interviewDateStart', e.target.value)}
                className="w-1/2"
              />
              <span>à</span>
              <Input
                id="interviewDateEnd"
                type="date"
                value={filters.interviewDateEnd}
                onChange={(e) => handleFilterChange('interviewDateEnd', e.target.value)}
                className="w-1/2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFilterBar;
