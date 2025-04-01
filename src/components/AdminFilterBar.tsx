
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, Search, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

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

const AdminFilterBar: React.FC<FilterProps> = ({ onFilterChange }) => {
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
  
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const handleFilterChange = (field: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('searchTerm', e.target.value);
  };
  
  const resetFilters = () => {
    const resetState: FilterState = {
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
    setFilters(resetState);
    onFilterChange(resetState);
  };
  
  const hasActiveFilters = () => {
    return (
      filters.category !== 'all' ||
      filters.status !== 'all' ||
      filters.qcmScoreMin !== null ||
      filters.qcmScoreMax !== null ||
      filters.interviewScoreMin !== null ||
      filters.interviewScoreMax !== null ||
      filters.interviewDateStart !== '' ||
      filters.interviewDateEnd !== '' ||
      filters.searchTerm !== ''
    );
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-2">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une équipe..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="pl-8 pr-4 w-full sm:w-[300px]"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`flex items-center gap-2 ${hasActiveFilters() ? 'border-igc-magenta text-igc-magenta' : 'border-igc-navy text-igc-navy'}`}
              >
                <Filter className="h-4 w-4" />
                Filtres avancés
                {hasActiveFilters() && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-igc-magenta rounded-full">
                    ✓
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] sm:w-[500px]" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Filtres</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category filter */}
                    <div className="space-y-1">
                      <Label htmlFor="category">Catégorie</Label>
                      <Select 
                        value={filters.category} 
                        onValueChange={(value) => handleFilterChange('category', value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Toutes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="Secondaire">Secondaire</SelectItem>
                          <SelectItem value="Supérieur">Supérieur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Status filter */}
                    <div className="space-y-1">
                      <Label htmlFor="status">Statut</Label>
                      <Select 
                        value={filters.status} 
                        onValueChange={(value) => handleFilterChange('status', value)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Tous" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
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
                </div>
                
                {/* Score QCM range */}
                <div className="space-y-2">
                  <Label>Score QCM</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max="100"
                      value={filters.qcmScoreMin !== null ? filters.qcmScoreMin : ''}
                      onChange={(e) => handleFilterChange('qcmScoreMin', e.target.value ? Number(e.target.value) : null)}
                    />
                    <span>à</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      min="0"
                      max="100"
                      value={filters.qcmScoreMax !== null ? filters.qcmScoreMax : ''}
                      onChange={(e) => handleFilterChange('qcmScoreMax', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                </div>
                
                {/* Score entretien range */}
                <div className="space-y-2">
                  <Label>Score entretien</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.interviewScoreMin !== null ? filters.interviewScoreMin : ''}
                      onChange={(e) => handleFilterChange('interviewScoreMin', e.target.value ? Number(e.target.value) : null)}
                    />
                    <span>à</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.interviewScoreMax !== null ? filters.interviewScoreMax : ''}
                      onChange={(e) => handleFilterChange('interviewScoreMax', e.target.value ? Number(e.target.value) : null)}
                    />
                  </div>
                </div>
                
                {/* Date d'entretien range */}
                <div className="space-y-2">
                  <Label>Période d'entretien</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="date"
                      placeholder="Début"
                      value={filters.interviewDateStart}
                      onChange={(e) => handleFilterChange('interviewDateStart', e.target.value)}
                    />
                    <span>à</span>
                    <Input
                      type="date"
                      placeholder="Fin"
                      value={filters.interviewDateEnd}
                      onChange={(e) => handleFilterChange('interviewDateEnd', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                  <Button 
                    onClick={() => setFiltersOpen(false)}
                    className="bg-igc-navy hover:bg-igc-navy/90"
                  >
                    Appliquer les filtres
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-4 w-4 mr-2" />
              Effacer
            </Button>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.category !== 'all' && (
            <Badge 
              label={`Catégorie: ${filters.category}`} 
              onRemove={() => handleFilterChange('category', 'all')} 
            />
          )}
          {filters.status !== 'all' && (
            <Badge 
              label={`Statut: ${filters.status}`} 
              onRemove={() => handleFilterChange('status', 'all')} 
            />
          )}
          {(filters.qcmScoreMin !== null || filters.qcmScoreMax !== null) && (
            <Badge 
              label={`Score QCM: ${filters.qcmScoreMin || 0} - ${filters.qcmScoreMax || 100}`} 
              onRemove={() => {
                handleFilterChange('qcmScoreMin', null);
                handleFilterChange('qcmScoreMax', null);
              }} 
            />
          )}
          {(filters.interviewScoreMin !== null || filters.interviewScoreMax !== null) && (
            <Badge 
              label={`Score entretien: ${filters.interviewScoreMin || 0} - ${filters.interviewScoreMax || 10}`} 
              onRemove={() => {
                handleFilterChange('interviewScoreMin', null);
                handleFilterChange('interviewScoreMax', null);
              }} 
            />
          )}
          {(filters.interviewDateStart !== '' || filters.interviewDateEnd !== '') && (
            <Badge 
              label={`Entretien: ${filters.interviewDateStart || 'début'} à ${filters.interviewDateEnd || 'fin'}`} 
              onRemove={() => {
                handleFilterChange('interviewDateStart', '');
                handleFilterChange('interviewDateEnd', '');
              }} 
            />
          )}
          {filters.searchTerm !== '' && (
            <Badge 
              label={`Recherche: "${filters.searchTerm}"`} 
              onRemove={() => handleFilterChange('searchTerm', '')} 
            />
          )}
        </div>
      )}
    </div>
  );
};

// Badge component for active filters
const Badge = ({ label, onRemove }: { label: string; onRemove: () => void }) => {
  return (
    <div className="inline-flex items-center rounded-full bg-igc-navy/10 px-3 py-1 text-sm text-igc-navy">
      {label}
      <button onClick={onRemove} className="ml-2 hover:text-igc-magenta">
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export default AdminFilterBar;
