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
import { BarChart, Download, Settings, LogOut, FileText } from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { generateTeamPDF, generateAllTeamsPDF } from '@/lib/pdfGenerator';
import { toast } from 'sonner';

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
    // Charger les inscriptions depuis Supabase
    const loadRegistrations = async () => {
      try {
        setIsLoading(true);
        const registrations = await getAllRegistrations();
        setTeams(registrations);
      } catch (error) {
        console.error("Erreur lors du chargement des inscriptions:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistrations();
  }, []);

  // Filtrer les équipes par catégorie
  const filteredTeamsByCategory = filterCategory === 'all'
    ? teams
    : teams.filter(team => team.generalInfo.category === filterCategory);

  // Filtrer les équipes par statut
  const filteredTeams = filterStatus === 'all'
    ? filteredTeamsByCategory
    : filteredTeamsByCategory.filter(team => team.status === filterStatus);

  // Exporter les données au format CSV
  const exportToCSV = async () => {
    try {
      const csvData = await exportAllRegistrationsToCSV();
      if (!csvData) {
        toast.error("Aucune donnée à exporter");
        return;
      }
      
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `igc_equipes_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Données exportées avec succès");
    } catch (error) {
      console.error("Erreur lors de l'exportation CSV:", error);
      toast.error("Erreur lors de l'exportation des données");
    }
  };

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

  // Exporter toutes les équipes au format PDF
  const exportAllTeamsPDF = async () => {
    try {
      if (teams.length === 0) {
        toast.error("Aucune équipe à exporter");
        return;
      }
      
      toast.info("Génération des fiches PDF en cours...", {
        duration: 3000,
      });
      
      await generateAllTeamsPDF();
      
      toast.success(`${teams.length} fiches d'équipes exportées en PDF`);
    } catch (error) {
      console.error("Erreur lors de l'exportation des PDF:", error);
      toast.error("Erreur lors de l'exportation des fiches PDF");
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
      
      // Mettre à jour les classements si nécessaire
      if (updatedData.interviewScore !== undefined) {
        updateTeamRankings();
      }
      
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
      
      // Mettre à jour les classements après la suppression
      updateTeamRankings();
      
      toast.success("Équipe supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Mettre à jour le classement des équipes après un entretien
  const updateTeamRankings = () => {
    // Séparer les équipes par catégorie
    const secondaryTeams = teams.filter(team => team.generalInfo.category === 'Secondaire');
    const higherTeams = teams.filter(team => team.generalInfo.category === 'Supérieur');
    
    // Mettre à jour le classement pour chaque catégorie séparément
    const updateCategoryRankings = (categoryTeams: TeamRegistration[]) => {
      // Trier les équipes par score d'entretien décroissant
      const sortedTeams = [...categoryTeams].sort((a, b) => {
        // Gérer le cas où interviewScore est undefined
        const scoreA = a.interviewScore === undefined ? -1 : a.interviewScore;
        const scoreB = b.interviewScore === undefined ? -1 : b.interviewScore;
        return scoreB - scoreA;
      });
      
      // Assigner le rang en fonction du score (seulement aux équipes avec un score)
      return sortedTeams.map((team, index) => {
        if (team.interviewScore !== undefined) {
          return {
            ...team,
            interviewRank: index + 1,
            decision: determineDecision(team.generalInfo.category, index + 1)
          };
        }
        return team;
      });
    };
    
    // Déterminer la décision en fonction du classement et de la catégorie
    const determineDecision = (category: TeamCategory, rank: number): "Sélectionné" | "Non retenu" | undefined => {
      if (category === 'Secondaire' && rank <= settings.secondaryTeamSelectionCount) {
        return "Sélectionné";
      }
      if (category === 'Supérieur' && rank <= settings.higherTeamSelectionCount) {
        return "Sélectionné";
      }
      return rank ? "Non retenu" : undefined;
    };
    
    // Mettre à jour les classements
    const updatedSecondaryTeams = updateCategoryRankings(secondaryTeams);
    const updatedHigherTeams = updateCategoryRankings(higherTeams);
    
    // Mettre à jour l'état avec les équipes classées
    const updatedTeams = [...updatedSecondaryTeams, ...updatedHigherTeams];
    
    // Mettre à jour l'état et sauvegarder dans le localStorage
    setTeams(updatedTeams);
    
    // Sauvegarder les changements dans le localStorage
    updatedTeams.forEach(team => {
      if (team.interviewRank !== undefined && team.id) {
        try {
          updateRegistration(team.id, {
            interviewRank: team.interviewRank,
            decision: team.decision
          });
        } catch (error) {
          console.error(`Erreur lors de la mise à jour du rang pour l'équipe ${team.id}:`, error);
        }
      }
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-igc-navy">Tableau de bord Administrateur</h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="w-4 h-4" />
              Paramètres
            </Button>
            
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={() => navigate('/admin')}
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Statistiques générales */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
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
          <Card>
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
          <Card>
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
          <Card>
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
              />
            </TabsContent>
            
            <TabsContent value="secondaire" className="space-y-4">
              <TeamTrackingTable 
                teams={filteredTeamsByCategory.filter(team => team.generalInfo.category === 'Secondaire')} 
                onTeamUpdate={handleTeamUpdate} 
                onTeamDelete={handleTeamDelete}
                onExportTeamPDF={exportTeamPDF}
              />
            </TabsContent>
            
            <TabsContent value="superieur" className="space-y-4">
              <TeamTrackingTable 
                teams={filteredTeamsByCategory.filter(team => team.generalInfo.category === 'Supérieur')} 
                onTeamUpdate={handleTeamUpdate}
                onTeamDelete={handleTeamDelete}
                onExportTeamPDF={exportTeamPDF}
              />
            </TabsContent>
            
            <TabsContent value="statut" className="space-y-4">
              <div className="flex items-center space-x-4">
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
              />
            </TabsContent>
          </Tabs>
        )}

        <div className="flex gap-4 mt-4">
          <Button variant="secondary" onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter en CSV
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={exportAllTeamsPDF}
          >
            <FileText className="w-4 h-4" />
            Exporter toutes les fiches PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
