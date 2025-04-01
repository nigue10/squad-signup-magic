
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TeamTrackingTable from '@/components/TeamTrackingTable';
import { 
  getAllRegistrations, 
  updateRegistration, 
  deleteRegistration,
  exportAllRegistrationsToCSV
} from '@/lib/supabaseStorage';
import { TeamRegistration, TeamStatus, TeamCategory } from '@/types/igc';
import { BarChart, Download, Settings, LogOut, FileText, RefreshCw } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { generateTeamPDF } from '@/lib/pdfGenerator';
import { toast } from 'sonner';
import { recalculateAllTeamsData } from '@/utils/teamCalculations';

interface CategorizedCounts {
  secondaire: number;
  superieur: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamRegistration[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const settings = getSettings();
  
  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem('admin_authenticated');
    if (isLoggedIn !== 'true') {
      toast.error("Accès non autorisé. Veuillez vous connecter.");
      navigate('/admin');
      return;
    }
    
    // Load registrations
    loadRegistrations();
  }, [navigate]);

  // Charger les inscriptions depuis le stockage
  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const registrations = await getAllRegistrations();
      console.log("Inscriptions chargées:", registrations);
      setTeams(registrations);
    } catch (error) {
      console.error("Erreur lors du chargement des inscriptions:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les équipes par catégorie
  const filteredTeamsByCategory = filterCategory === 'all'
    ? teams
    : teams.filter(team => team.generalInfo.category === filterCategory);

  // Filtrer les équipes par statut
  const filteredTeams = filterStatus === 'all'
    ? filteredTeamsByCategory
    : filteredTeamsByCategory.filter(team => team.status === filterStatus);

  // Exporter une équipe spécifique au format PDF
  const exportTeamPDF = async (teamId: string) => {
    try {
      await generateTeamPDF(teamId);
      toast.success("Fiche d'équipe exportée en PDF");
    } catch (error) {
      console.error("Erreur lors de l'exportation PDF:", error);
      toast.error("Erreur lors de l'exportation PDF");
    }
  };

  // Exporter toutes les équipes au format CSV
  const exportTeamsCSV = async () => {
    try {
      const csv = await exportAllRegistrationsToCSV();
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'equipes_igc.csv');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Données exportées avec succès au format CSV");
    } catch (error) {
      console.error("Erreur lors de l'exportation CSV:", error);
      toast.error("Erreur lors de l'exportation CSV");
    }
  };

  // Mettre à jour une équipe
  const handleTeamUpdate = async (teamId: string, updatedData: Partial<TeamRegistration>) => {
    try {
      await updateRegistration(teamId, updatedData);
      
      // Rafraîchir la liste des équipes
      setTeams(prev => 
        prev.map(team => 
          team.id === teamId ? { ...team, ...updatedData } : team
        )
      );
      
      toast.success("Équipe mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Supprimer une équipe
  const handleTeamDelete = async (teamId: string) => {
    try {
      await deleteRegistration(teamId);
      
      // Mettre à jour la liste des équipes
      setTeams(prev => prev.filter(team => team.id !== teamId));
      
      toast.success("Équipe supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  // Recalculer les points et les classements pour toutes les équipes
  const handleRecalculateAll = async () => {
    try {
      toast.info("Recalcul en cours...");
      
      // Get updates for all teams
      const updates = recalculateAllTeamsData(teams);
      
      // Apply updates to database and state
      for (const update of updates) {
        const teamId = update.id;
        if (teamId) {
          delete update.id; // Remove id from update object
          await updateRegistration(teamId, update);
          
          // Update local state
          setTeams(prev => 
            prev.map(team => 
              team.id === teamId ? { ...team, ...update } : team
            )
          );
        }
      }
      
      toast.success("Recalcul terminé avec succès");
      
      // Refresh data from server
      loadRegistrations();
    } catch (error) {
      console.error("Erreur lors du recalcul:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Catégoriser le nombre d'équipes
  const categorizeCounts = (): CategorizedCounts => {
    let secondaire = 0;
    let superieur = 0;

    teams.forEach(team => {
      if (team.generalInfo.category === 'Secondaire') {
        secondaire++;
      } else if (team.generalInfo.category === 'Supérieur') {
        superieur++;
      }
    });

    return { secondaire, superieur };
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    toast.success("Vous avez été déconnecté avec succès");
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-igc-navy/5 to-igc-purple/5">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-igc-navy">Tableau de bord Administrateur</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white transition-all duration-300 rounded-[47px]"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="w-4 h-4" />
              Paramètres
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 rounded-[47px]"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Statistiques générales */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total équipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams.length}</div>
              <p className="text-xs text-muted-foreground">
                {categorizeCounts().secondaire} Secondaire, {categorizeCounts().superieur} Supérieur
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Équipes qualifiées QCM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teams.filter(t => t.qcmQualified).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Seuils: {settings.secondaryQcmThreshold}% (Sec) / {settings.higherQcmThreshold}% (Sup)
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Entretiens réalisés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teams.filter(t => 
                    t.status === 'Entretien réalisé' || 
                    t.status === 'Sélectionné' || 
                    t.status === 'Non retenu'
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sur {teams.filter(t => t.qcmQualified).length} équipes qualifiées
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Équipes sélectionnées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teams.filter(t => t.decision === 'Sélectionné').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Objectif: {settings.secondaryTeamSelectionCount} (Sec) / {settings.higherTeamSelectionCount} (Sup)
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Filtres et Tableau */}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-igc-navy"></div>
          </div>
        ) : (
          <Tabs defaultValue="all" onValueChange={(value) => {
            if (value === 'secondaire' || value === 'superieur') {
              setFilterCategory(value);
            }
          }}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="all" onClick={() => setFilterCategory('all')}>Toutes les équipes</TabsTrigger>
              <TabsTrigger value="secondaire">Secondaire</TabsTrigger>
              <TabsTrigger value="superieur">Supérieur</TabsTrigger>
              <TabsTrigger value="statut">Par statut</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <TeamTrackingTable 
                teams={teams} 
                onTeamUpdate={handleTeamUpdate} 
                onTeamDelete={handleTeamDelete}
                onExportTeamPDF={exportTeamPDF}
                onRecalculatePoints={handleRecalculateAll}
              />
            </TabsContent>
            
            <TabsContent value="secondaire" className="space-y-4">
              <TeamTrackingTable 
                teams={filteredTeamsByCategory.filter(team => team.generalInfo.category === 'Secondaire')} 
                onTeamUpdate={handleTeamUpdate} 
                onTeamDelete={handleTeamDelete}
                onExportTeamPDF={exportTeamPDF}
                onRecalculatePoints={handleRecalculateAll}
              />
            </TabsContent>
            
            <TabsContent value="superieur" className="space-y-4">
              <TeamTrackingTable 
                teams={filteredTeamsByCategory.filter(team => team.generalInfo.category === 'Supérieur')} 
                onTeamUpdate={handleTeamUpdate}
                onTeamDelete={handleTeamDelete}
                onExportTeamPDF={exportTeamPDF}
                onRecalculatePoints={handleRecalculateAll}
              />
            </TabsContent>
            
            <TabsContent value="statut" className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <label htmlFor="filterStatus" className="text-sm font-medium text-gray-700">Filtrer par statut:</label>
                <select 
                  id="filterStatus" 
                  className="border border-gray-300 rounded-md p-2 text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Inscrit">Inscrit</option>
                  <option value="QCM soumis">QCM soumis</option>
                  <option value="Éliminé QCM">Éliminé QCM</option>
                  <option value="Qualifié pour entretien">Qualifié pour entretien</option>
                  <option value="Entretien réalisé">Entretien réalisé</option>
                  <option value="Sélectionné">Sélectionné</option>
                  <option value="Non retenu">Non retenu</option>
                </select>
              </div>
              <TeamTrackingTable 
                teams={filteredTeams} 
                onTeamUpdate={handleTeamUpdate}
                onTeamDelete={handleTeamDelete}
                onExportTeamPDF={exportTeamPDF}
                onRecalculatePoints={handleRecalculateAll}
              />
            </TabsContent>
          </Tabs>
        )}

        <div className="flex gap-4 mt-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white transition-all duration-300 rounded-[47px]"
            onClick={exportTeamsCSV}
          >
            <Download className="w-4 h-4" />
            Exporter données (CSV)
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white transition-all duration-300 rounded-[47px]"
            onClick={handleRecalculateAll}
          >
            <RefreshCw className="w-4 h-4" />
            Recalculer tous les classements
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
