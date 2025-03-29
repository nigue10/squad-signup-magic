import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TeamTrackingTable from '@/components/TeamTrackingTable';
import { getAllRegistrations, updateRegistration } from '@/lib/storage';
import { TeamRegistration, TeamStatus, TeamCategory } from '@/types/igc';
import { BarChart, Download, Settings, LogOut } from 'lucide-react';
import { getSettings } from '@/lib/settings';

interface CategorizedCounts {
  secondaire: number;
  superieur: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamRegistration[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const settings = getSettings();

  useEffect(() => {
    // Charger les inscriptions depuis le localStorage
    const loadRegistrations = () => {
      const registrations = getAllRegistrations();
      setTeams(registrations);
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
  const exportToCSV = () => {
    const csvRows = [];
    const headers = Object.keys(teams[0].generalInfo);
    csvRows.push(headers.join(','));

    for (const team of teams) {
      const values = Object.values(team.generalInfo).map(value => `"${value}"`);
      csvRows.push(values.join(','));
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'igc_registrations.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Mettre à jour une équipe
  const handleTeamUpdate = (teamId: string, updatedData: Partial<TeamRegistration>) => {
    updateRegistration(teamId, updatedData);
    
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
  };

  // Mettre à jour le classement des équipes après un entretien
  const updateTeamRankings = () => {
    // Trier les équipes par score d'entretien décroissant
    const sortedTeams = [...teams].sort((a, b) => {
      // Gérer le cas où interviewScore est undefined
      const scoreA = a.interviewScore === undefined ? -1 : a.interviewScore;
      const scoreB = b.interviewScore === undefined ? -1 : b.interviewScore;
      return scoreB - scoreA;
    });

    // Assigner le rang en fonction du score
    const rankedTeams = sortedTeams.map((team, index) => ({
      ...team,
      interviewRank: index + 1,
    }));

    // Mettre à jour l'état avec les équipes classées
    setTeams(rankedTeams);
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
                {teams.filter(t => t.status === 'Entretien réalisé' || t.status === 'Sélectionné' || t.status === 'Non retenu').length}
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
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="all">Toutes les équipes</TabsTrigger>
            <TabsTrigger value="secondaire">Secondaire</TabsTrigger>
            <TabsTrigger value="superieur">Supérieur</TabsTrigger>
            <TabsTrigger value="statut">Par statut</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <TeamTrackingTable teams={teams} onTeamUpdate={handleTeamUpdate} />
          </TabsContent>
          
          <TabsContent value="secondaire" className="space-y-4">
            <TeamTrackingTable teams={filteredTeamsByCategory.filter(team => team.generalInfo.category === 'Secondaire')} onTeamUpdate={handleTeamUpdate} />
          </TabsContent>
          
          <TabsContent value="superieur" className="space-y-4">
            <TeamTrackingTable teams={filteredTeamsByCategory.filter(team => team.generalInfo.category === 'Supérieur')} onTeamUpdate={handleTeamUpdate} />
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
            <TeamTrackingTable teams={filteredTeams} onTeamUpdate={handleTeamUpdate} />
          </TabsContent>
        </Tabs>

        <Button variant="secondary" onClick={exportToCSV} className="mt-4 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter en CSV
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
