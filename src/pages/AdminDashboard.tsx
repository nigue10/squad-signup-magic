
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LogoHeader from '@/components/LogoHeader';
import { getAllRegistrations, updateRegistration } from '@/lib/storage';
import { TeamRegistration, TeamCategory, TeamStatus } from '@/types/igc';
import { formatDate, downloadCSV } from '@/lib/helpers';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import TeamTrackingTable from '@/components/TeamTrackingTable';
import { 
  Users, 
  FileSpreadsheet, 
  Eye, 
  Clock,
  School,
  MapPin,
  Flag,
  Award,
  Search,
  Filter,
  LogOut,
  Download,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminTeamActions from '@/components/AdminTeamActions';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<TeamRegistration[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TeamCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TeamStatus | "all">("all");
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
  
  // Vérification de l'authentification
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_authenticated');
    if (isLoggedIn !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);
  
  // Chargement des inscriptions
  useEffect(() => {
    try {
      const teams = getAllRegistrations();
      setRegistrations(teams);
      
      // Ajouter un statut par défaut aux équipes qui n'en ont pas
      const teamsWithStatus = teams.map(team => {
        if (!team.status) {
          return {
            ...team,
            status: 'Inscrit' as TeamStatus
          };
        }
        return team;
      });
      
      // Si des équipes ont été mises à jour, sauvegarder les changements
      if (teamsWithStatus.some((team, i) => team.status !== teams[i].status)) {
        teamsWithStatus.forEach(team => {
          if (team.id) {
            updateRegistration(team.id, { status: team.status });
          }
        });
        setRegistrations(teamsWithStatus);
      }
      
    } catch (error) {
      console.error("Erreur lors du chargement des équipes:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les équipes inscrites",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Filtrage des équipes
  const filteredTeams = useMemo(() => {
    return registrations
      .filter(team => {
        // Filtre par recherche
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          team.generalInfo.name.toLowerCase().includes(searchLower) ||
          team.generalInfo.institution.toLowerCase().includes(searchLower) ||
          team.generalInfo.city.toLowerCase().includes(searchLower) ||
          team.generalInfo.teamLeaderName.toLowerCase().includes(searchLower);
        
        // Filtre par catégorie
        const matchesCategory = 
          categoryFilter === "all" || 
          team.generalInfo.category === categoryFilter;
        
        // Filtre par statut
        const matchesStatus = 
          statusFilter === "all" || 
          team.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        // Tri par date d'inscription (la plus récente en premier)
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
      });
  }, [registrations, searchTerm, categoryFilter, statusFilter]);
  
  // Mise à jour d'une équipe
  const handleTeamUpdate = (teamId: string, updatedData: Partial<TeamRegistration>) => {
    try {
      // Mettre à jour l'équipe dans la base de données
      updateRegistration(teamId, updatedData);
      
      // Mettre à jour l'état local
      const updatedTeams = registrations.map(team => {
        if (team.id === teamId) {
          return { ...team, ...updatedData };
        }
        return team;
      });
      
      setRegistrations(updatedTeams);
      
      // Si l'équipe sélectionnée est mise à jour, mettre également à jour selectedTeam
      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam({ ...selectedTeam, ...updatedData });
      }
      
      toast({
        title: "Équipe mise à jour",
        description: "Les modifications ont été enregistrées avec succès."
      });
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'équipe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'équipe",
        variant: "destructive"
      });
    }
  };
  
  // Exportation des données au format CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Il n'y a aucune équipe à exporter",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Préparation des données pour l'export CSV avec les nouveaux champs
      const flatData = registrations.map(team => ({
        id: team.id,
        equipe: team.generalInfo.name,
        categorie: team.generalInfo.category,
        ville: team.generalInfo.city,
        commune: team.generalInfo.commune,
        institution: team.generalInfo.institution,
        chef_equipe: team.generalInfo.teamLeaderName,
        referent: team.generalInfo.pedagogicalReferentName || "N/A",
        contact_referent: team.generalInfo.pedagogicalReferentPhone || "N/A",
        email_referent: team.generalInfo.pedagogicalReferentEmail || "N/A",
        nombre_membres: team.members.filter(m => m.name).length,
        niveau_robotique: team.vision.roboticsLevel,
        espace_travail: team.vision.hasWorkspace ? 'Oui' : 'Non',
        competences: Object.entries(team.skills)
          .filter(([key, value]) => value === true && key !== 'other')
          .map(([key]) => key)
          .join(', '),
        date_inscription: team.createdAt ? formatDate(team.createdAt) : 'N/A',
        statut: team.status || 'Inscrit',
        score_qcm: team.qcmScore !== undefined ? team.qcmScore : '',
        qualifie_qcm: team.qcmQualified !== undefined ? (team.qcmQualified ? 'Oui' : 'Non') : '',
        date_entretien: team.interviewDate || '',
        heure_entretien: team.interviewTime || '',
        lien_entretien: team.interviewLink || '',
        score_entretien: team.interviewScore !== undefined ? team.interviewScore : '',
        classement: team.interviewRank !== undefined ? team.interviewRank : '',
        decision: team.decision || '',
        notes_entretien: team.interviewNotes || '',
        commentaires: team.comments || ''
      }));
      
      downloadCSV(flatData, `igc_inscriptions_complet_${new Date().toISOString().slice(0, 10)}.csv`);
      
      toast({
        title: "Export réussi",
        description: "Les données ont été exportées avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  };
  
  // Exporter seulement les équipes filtrées
  const handleExportFiltered = () => {
    if (filteredTeams.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Il n'y a aucune équipe à exporter",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Préparation des données filtrées pour l'export CSV
      const flatData = filteredTeams.map(team => ({
        id: team.id,
        equipe: team.generalInfo.name,
        categorie: team.generalInfo.category,
        ville: team.generalInfo.city,
        commune: team.generalInfo.commune,
        institution: team.generalInfo.institution,
        chef_equipe: team.generalInfo.teamLeaderName,
        referent: team.generalInfo.pedagogicalReferentName || "N/A",
        contact_referent: team.generalInfo.pedagogicalReferentPhone || "N/A",
        email_referent: team.generalInfo.pedagogicalReferentEmail || "N/A",
        nombre_membres: team.members.filter(m => m.name).length,
        niveau_robotique: team.vision.roboticsLevel,
        espace_travail: team.vision.hasWorkspace ? 'Oui' : 'Non',
        competences: Object.entries(team.skills)
          .filter(([key, value]) => value === true && key !== 'other')
          .map(([key]) => key)
          .join(', '),
        date_inscription: team.createdAt ? formatDate(team.createdAt) : 'N/A',
        statut: team.status || 'Inscrit',
        score_qcm: team.qcmScore !== undefined ? team.qcmScore : '',
        qualifie_qcm: team.qcmQualified !== undefined ? (team.qcmQualified ? 'Oui' : 'Non') : '',
        date_entretien: team.interviewDate || '',
        heure_entretien: team.interviewTime || '',
        lien_entretien: team.interviewLink || '',
        score_entretien: team.interviewScore !== undefined ? team.interviewScore : '',
        classement: team.interviewRank !== undefined ? team.interviewRank : '',
        decision: team.decision || '',
        notes_entretien: team.interviewNotes || '',
        commentaires: team.comments || ''
      }));
      
      downloadCSV(flatData, `igc_inscriptions_filtrees_${new Date().toISOString().slice(0, 10)}.csv`);
      
      toast({
        title: "Export réussi",
        description: `${flatData.length} équipes exportées avec succès`,
      });
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter les données filtrées",
        variant: "destructive",
      });
    }
  };
  
  // Déconnexion
  const handleLogout = () => {
    if (isConfirmingLogout) {
      localStorage.removeItem('admin_authenticated');
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès"
      });
      navigate('/admin');
    } else {
      setIsConfirmingLogout(true);
      // Réinitialiser après 3 secondes
      setTimeout(() => setIsConfirmingLogout(false), 3000);
    }
  };
  
  // Fonction pour calculer le classement des équipes
  const calculateRankings = () => {
    try {
      // Séparer les équipes par catégorie
      const secondaryTeams = registrations.filter(team => 
        team.generalInfo.category === 'Secondaire' && 
        team.interviewScore !== undefined
      );
      
      const higherTeams = registrations.filter(team => 
        team.generalInfo.category === 'Supérieur' && 
        team.interviewScore !== undefined
      );
      
      // Trier les équipes par score d'entretien (décroissant)
      const sortedSecondary = [...secondaryTeams].sort((a, b) => 
        (b.interviewScore || 0) - (a.interviewScore || 0)
      );
      
      const sortedHigher = [...higherTeams].sort((a, b) => 
        (b.interviewScore || 0) - (a.interviewScore || 0)
      );
      
      // Attribution des rangs
      let updatedTeams = [...registrations];
      
      sortedSecondary.forEach((team, index) => {
        if (team.id) {
          const rank = index + 1;
          
          // Déterminer automatiquement la décision finale
          let decision: 'Sélectionné' | 'Non retenu' | undefined;
          if (rank <= 20) {
            decision = 'Sélectionné';
          } else {
            decision = 'Non retenu';
          }
          
          // Mettre à jour l'équipe
          updateRegistration(team.id, { 
            interviewRank: rank,
            decision,
            status: decision === 'Sélectionné' ? 'Sélectionné' : 'Non retenu'
          });
          
          // Mettre à jour l'état local
          updatedTeams = updatedTeams.map(t => {
            if (t.id === team.id) {
              return { ...t, interviewRank: rank, decision, status: decision === 'Sélectionné' ? 'Sélectionné' : 'Non retenu' };
            }
            return t;
          });
        }
      });
      
      sortedHigher.forEach((team, index) => {
        if (team.id) {
          const rank = index + 1;
          
          // Déterminer automatiquement la décision finale
          let decision: 'Sélectionné' | 'Non retenu' | undefined;
          if (rank <= 10) {
            decision = 'Sélectionné';
          } else {
            decision = 'Non retenu';
          }
          
          // Mettre à jour l'équipe
          updateRegistration(team.id, { 
            interviewRank: rank,
            decision,
            status: decision === 'Sélectionné' ? 'Sélectionné' : 'Non retenu'
          });
          
          // Mettre à jour l'état local
          updatedTeams = updatedTeams.map(t => {
            if (t.id === team.id) {
              return { ...t, interviewRank: rank, decision, status: decision === 'Sélectionné' ? 'Sélectionné' : 'Non retenu' };
            }
            return t;
          });
        }
      });
      
      setRegistrations(updatedTeams);
      
      toast({
        title: "Classement mis à jour",
        description: `${sortedSecondary.length + sortedHigher.length} équipes ont été classées`
      });
      
    } catch (error) {
      console.error("Erreur lors du calcul des classements:", error);
      toast({
        title: "Erreur",
        description: "Impossible de calculer les classements",
        variant: "destructive"
      });
    }
  };
  
  // Affichage des détails d'une équipe
  const viewTeamDetails = (team: TeamRegistration) => {
    setSelectedTeam(team);
  };

  // Statistiques des inscriptions
  const statistics = useMemo(() => {
    const totalTeams = registrations.length;
    const secondaryTeams = registrations.filter(team => team.generalInfo.category === 'Secondaire').length;
    const higherTeams = registrations.filter(team => team.generalInfo.category === 'Supérieur').length;
    const totalMembers = registrations.reduce((total, team) => total + team.members.filter(m => m.name).length, 0);
    const uniqueCities = new Set(registrations.map(team => team.generalInfo.city)).size;
    
    const qcmSubmitted = registrations.filter(team => team.status === 'QCM soumis' || team.qcmScore !== undefined).length;
    const qcmQualified = registrations.filter(team => team.qcmQualified === true).length;
    const interviewScheduled = registrations.filter(team => team.interviewDate && team.interviewTime).length;
    const interviewCompleted = registrations.filter(team => team.interviewScore !== undefined).length;
    const selected = registrations.filter(team => team.decision === 'Sélectionné').length;
    
    return {
      totalTeams,
      secondaryTeams,
      higherTeams,
      totalMembers,
      uniqueCities,
      qcmSubmitted,
      qcmQualified,
      interviewScheduled,
      interviewCompleted,
      selected
    };
  }, [registrations]);
  
  return (
    <div className="min-h-screen bg-igc-gray">
      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <LogoHeader />
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              {isConfirmingLogout ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Confirmer la déconnexion
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </>
              )}
            </Button>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-center text-igc-blue mb-6">
            Tableau de bord administrateur
          </h1>
          
          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-igc-navy/5 border-igc-navy/20">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-igc-navy">{statistics.totalTeams}</span>
                <span className="text-sm text-muted-foreground">Équipes</span>
              </CardContent>
            </Card>
            <Card className="bg-igc-magenta/5 border-igc-magenta/20">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-igc-magenta">{statistics.secondaryTeams}</span>
                <span className="text-sm text-muted-foreground">Secondaire</span>
              </CardContent>
            </Card>
            <Card className="bg-igc-purple/5 border-igc-purple/20">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-igc-purple">{statistics.higherTeams}</span>
                <span className="text-sm text-muted-foreground">Supérieur</span>
              </CardContent>
            </Card>
            <Card className="bg-igc-navy/5 border-igc-navy/20">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-igc-navy">{statistics.totalMembers}</span>
                <span className="text-sm text-muted-foreground">Participants</span>
              </CardContent>
            </Card>
            <Card className="bg-igc-magenta/5 border-igc-magenta/20">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-igc-magenta">{statistics.uniqueCities}</span>
                <span className="text-sm text-muted-foreground">Villes</span>
              </CardContent>
            </Card>
          </div>
          
          {/* Statistiques de progression */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-yellow-700">{statistics.qcmSubmitted}</span>
                <span className="text-sm text-muted-foreground">QCM soumis</span>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-green-700">{statistics.qcmQualified}</span>
                <span className="text-sm text-muted-foreground">Qualifiés QCM</span>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-blue-700">{statistics.interviewScheduled}</span>
                <span className="text-sm text-muted-foreground">Entretiens planifiés</span>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-purple-700">{statistics.interviewCompleted}</span>
                <span className="text-sm text-muted-foreground">Entretiens réalisés</span>
              </CardContent>
            </Card>
            <Card className="bg-green-100 border-green-300">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-green-800">{statistics.selected}</span>
                <span className="text-sm text-muted-foreground">Équipes sélectionnées</span>
              </CardContent>
            </Card>
          </div>
          
          {registrations.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground mb-4">Aucune équipe inscrite pour le moment.</p>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Retour à l'accueil
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="list">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                <TabsList className="mb-4 md:mb-0">
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> Liste des équipes
                  </TabsTrigger>
                  <TabsTrigger value="tracking" className="flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" /> Suivi des équipes
                  </TabsTrigger>
                  {selectedTeam && (
                    <TabsTrigger value="details" className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> Détails de l'équipe
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleExportCSV}
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Exporter tout
                  </Button>
                  
                  {filteredTeams.length > 0 && filteredTeams.length < registrations.length && (
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={handleExportFiltered}
                    >
                      <Download className="w-4 h-4" />
                      Exporter la sélection ({filteredTeams.length})
                    </Button>
                  )}
                </div>
              </div>
              
              <TabsContent value="list" className="mt-4">
                {/* Filtres */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Rechercher une équipe, institution, ville..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={categoryFilter}
                      onValueChange={(value) => setCategoryFilter(value as TeamCategory | "all")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes catégories</SelectItem>
                        <SelectItem value="Secondaire">Secondaire</SelectItem>
                        <SelectItem value="Supérieur">Supérieur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {filteredTeams.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">Aucune équipe ne correspond à votre recherche.</p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Équipe</TableHead>
                          <TableHead>Catégorie</TableHead>
                          <TableHead className="hidden md:table-cell">Institution</TableHead>
                          <TableHead className="hidden md:table-cell">Ville</TableHead>
                          <TableHead className="hidden md:table-cell text-center">Membres</TableHead>
                          <TableHead className="text-right">Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTeams.map((team) => (
                          <TableRow key={team.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{team.generalInfo.name}</TableCell>
                            <TableCell>
                              <Badge variant={team.generalInfo.category === 'Secondaire' ? 'secondary' : 'outline'}>
                                {team.generalInfo.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {team.generalInfo.institution}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {team.generalInfo.city}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-center">
                              {team.members.filter(m => m.name).length}
                            </TableCell>
                            <TableCell className="text-right">
                              {team.createdAt ? formatDate(team.createdAt) : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => viewTeamDetails(team)}
                              >
                                <Eye className="w-4 h-4" /> Voir
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="tracking" className="mt-4">
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select
                      value={categoryFilter}
                      onValueChange={(value) => setCategoryFilter(value as TeamCategory | "all")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes catégories</SelectItem>
                        <SelectItem value="Secondaire">Secondaire</SelectItem>
                        <SelectItem value="Supérieur">Supérieur</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value as TeamStatus | "all")}
                    >
                      <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Statut" />
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
                  
                  <Button 
                    onClick={calculateRankings}
                    className="bg-igc-navy hover:bg-igc-navy/90"
                  >
                    Calculer les classements
                  </Button>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <TeamTrackingTable 
                    teams={filteredTeams} 
                    onTeamUpdate={handleTeamUpdate} 
                  />
                </div>
              </TabsContent>
              
              {selectedTeam && (
                <TabsContent value="details" className="mt-4">
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
                          <div>
                            <h2 className="text-2xl font-bold text-igc-blue mb-1">
                              {selectedTeam.generalInfo.name}
                            </h2>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Badge variant={selectedTeam.generalInfo.category === 'Secondaire' ? 'secondary' : 'outline'}>
                                {selectedTeam.generalInfo.category}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {selectedTeam.createdAt ? formatDate(selectedTeam.createdAt) : 'N/A'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-sm">
                              <School className="w-4 h-4" />
                              {selectedTeam.generalInfo.institution}
                            </span>
                            <span className="flex items-center gap-1 text-sm">
                              <MapPin className="w-4 h-4" />
                              {selectedTeam.generalInfo.city}, {selectedTeam.generalInfo.commune}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          {/* Informations générales */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Informations générales</h3>
                            
                            <div>
                              <p className="text-sm font-medium">Chef d'équipe:</p>
                              <p>{selectedTeam.generalInfo.teamLeaderName}</p>
                            </div>
                            
                            {selectedTeam.generalInfo.pedagogicalReferentName && (
                              <div>
                                <p className="text-sm font-medium">Référent pédagogique:</p>
                                <p>{selectedTeam.generalInfo.pedagogicalReferentName}</p>
                                <p className="text-sm">
                                  {selectedTeam.generalInfo.pedagogicalReferentEmail && (
                                    <>Email: {selectedTeam.generalInfo.pedagogicalReferentEmail}</>
                                  )}
                                  {selectedTeam.generalInfo.pedagogicalReferentPhone && (
                                    <> • Tél: {selectedTeam.generalInfo.pedagogicalReferentPhone}</>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* Niveau et compétences */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Niveau et équipement</h3>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                Niveau: {selectedTeam.vision.roboticsLevel}
                              </Badge>
                              
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Flag className="w-4 h-4" />
                                Espace de travail: {selectedTeam.vision.hasWorkspace ? 'Oui' : 'Non'}
                              </Badge>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Compétences:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {Object.entries(selectedTeam.skills)
                                  .filter(([key, value]) => value === true && key !== 'other')
                                  .map(([key]) => (
                                    <Badge key={key} variant="secondary" className="mb-1">
                                      {key}
                                    </Badge>
                                  ))}
                                {selectedTeam.skills.other && (
                                  <Badge variant="secondary" className="mb-1">
                                    {selectedTeam.skills.otherDescription}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Motivation */}
                          <div className="space-y-4 md:col-span-2">
                            <h3 className="text-lg font-semibold border-b pb-2">Motivation & Vision</h3>
                            
                            <div>
                              <p className="text-sm font-medium">Motivation:</p>
                              <p className="whitespace-pre-line">{selectedTeam.vision.motivation}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Valeurs:</p>
                              <p className="whitespace-pre-line">{selectedTeam.vision.values}</p>
                            </div>
                          </div>
                          
                          {/* Membres de l'équipe */}
                          <div className="md:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">Membres de l'équipe</h3>
                            
                            <div className="overflow-x-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Genre</TableHead>
                                    <TableHead>Date de naissance</TableHead>
                                    <TableHead>Niveau</TableHead>
                                    <TableHead>École</TableHead>
                                    <TableHead>Ville</TableHead>
                                    <TableHead>Contact</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedTeam.members
                                    .filter(member => member.name)
                                    .map((member) => (
                                      <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>{member.gender}</TableCell>
                                        <TableCell>{formatDate(member.birthDate)}</TableCell>
                                        <TableCell>{member.level}</TableCell>
                                        <TableCell>{member.school}</TableCell>
                                        <TableCell>{member.city}</TableCell>
                                        <TableCell className="text-sm">
                                          {member.email && <div>{member.email}</div>}
                                          {member.phone && <div>{member.phone}</div>}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-end gap-2">
                      <AdminTeamActions team={selectedTeam} />
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedTeam(null)}
                      >
                        Retour à la liste
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
