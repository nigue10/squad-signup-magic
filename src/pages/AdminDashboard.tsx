
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { downloadCSV } from '@/lib/helpers';

// Données de test en attendant Supabase
const MOCK_TEAMS = [
  {
    id: '1',
    name: 'Spirit Genius',
    category: 'Supérieur',
    city: 'Abidjan',
    commune: 'Cocody',
    institution: 'Université polytechnique de Bingerville',
    teamLeader: 'Fatoumata Diawara',
    members: 5,
    createdAt: '2023-10-15',
  },
  {
    id: '2',
    name: 'Tech Eagles',
    category: 'Secondaire',
    city: 'Yamoussoukro',
    commune: 'Centre',
    institution: 'Lycée Scientifique',
    teamLeader: 'Kouassi Jean',
    members: 6,
    createdAt: '2023-10-14',
  },
  {
    id: '3',
    name: 'Robotics Masters',
    category: 'Supérieur',
    city: 'Abidjan',
    commune: 'Plateau',
    institution: 'École Supérieure de Technologie',
    teamLeader: 'Konan Armand',
    members: 4,
    createdAt: '2023-10-13',
  },
];

const AdminDashboard = () => {
  const [teams, setTeams] = useState(MOCK_TEAMS);
  const [filteredTeams, setFilteredTeams] = useState(MOCK_TEAMS);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    search: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Vérification de l'authentification
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isLoggedIn) {
      toast({
        title: "Accès restreint",
        description: "Veuillez vous connecter pour accéder à l'espace administrateur.",
        variant: "destructive",
      });
      navigate('/admin');
    }
  }, [navigate, toast]);
  
  // Filtrage des équipes
  useEffect(() => {
    let filtered = [...teams];
    
    if (filters.category) {
      filtered = filtered.filter(team => team.category === filters.category);
    }
    
    if (filters.city) {
      filtered = filtered.filter(team => team.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    
    if (filters.search) {
      filtered = filtered.filter(
        team => 
          team.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          team.institution.toLowerCase().includes(filters.search.toLowerCase()) ||
          team.teamLeader.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    setFilteredTeams(filtered);
  }, [teams, filters]);
  
  // Déconnexion
  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
    });
    navigate('/admin');
  };
  
  // Export des données
  const handleExport = () => {
    const dataToExport = filteredTeams.map(team => ({
      'ID': team.id,
      'Nom de l\'équipe': team.name,
      'Catégorie': team.category,
      'Ville': team.city,
      'Commune': team.commune,
      'Établissement': team.institution,
      'Chef d\'équipe': team.teamLeader,
      'Nombre de membres': team.members,
      'Date d\'inscription': team.createdAt,
    }));
    
    downloadCSV(dataToExport, `igc2025-equipes-${new Date().toISOString().split('T')[0]}.csv`);
    
    toast({
      title: "Export réussi",
      description: "Les données ont été exportées avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-igc-gray">
      <header className="bg-igc-blue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/526b0e79-f8fc-413d-b351-c946cb887c75.png" 
              alt="Logo IGC" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-bold">IGC 2025 Admin</h1>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-igc-blue">Tableau de bord des inscriptions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="searchFilter">Recherche</Label>
              <Input
                id="searchFilter"
                placeholder="Rechercher une équipe..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryFilter">Filtrer par catégorie</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger id="categoryFilter">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  <SelectItem value="Secondaire">Secondaire</SelectItem>
                  <SelectItem value="Supérieur">Supérieur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cityFilter">Filtrer par ville</Label>
              <Input
                id="cityFilter"
                placeholder="Entrez une ville..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex justify-end mb-4">
            <Button onClick={handleExport}>
              Exporter en CSV
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-igc-lightblue">
                  <th className="border p-2 text-left">Nom de l'équipe</th>
                  <th className="border p-2 text-left">Catégorie</th>
                  <th className="border p-2 text-left">Ville</th>
                  <th className="border p-2 text-left">Commune</th>
                  <th className="border p-2 text-left">Établissement</th>
                  <th className="border p-2 text-left">Chef d'équipe</th>
                  <th className="border p-2 text-left">Membres</th>
                  <th className="border p-2 text-left">Date d'inscription</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.length > 0 ? (
                  filteredTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="border p-2">{team.name}</td>
                      <td className="border p-2">{team.category}</td>
                      <td className="border p-2">{team.city}</td>
                      <td className="border p-2">{team.commune}</td>
                      <td className="border p-2">{team.institution}</td>
                      <td className="border p-2">{team.teamLeader}</td>
                      <td className="border p-2">{team.members}</td>
                      <td className="border p-2">{team.createdAt}</td>
                      <td className="border p-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Visualisation",
                              description: `Visualisation des détails de l'équipe ${team.name}`,
                            });
                          }}
                        >
                          Voir
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="border p-4 text-center">
                      Aucune équipe ne correspond aux critères de recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Total: {filteredTeams.length} équipes</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
