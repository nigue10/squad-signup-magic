
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import TeamTrackingTable from '@/components/TeamTrackingTable';
import AdminDashboardStats from '@/components/AdminDashboardStats';
import AdminFilterBar, { FilterState } from '@/components/AdminFilterBar';
import { 
  getAllRegistrations, 
  updateRegistration, 
  deleteRegistration,
  exportAllRegistrationsToCSV
} from '@/lib/supabaseStorage';
import { 
  sendRegistrationConfirmation, 
  sendInterviewInvitation, 
  sendDecisionNotification 
} from '@/lib/emailService';
import { TeamRegistration, TeamStatus, TeamCategory } from '@/types/igc';
import { 
  Download, 
  Settings, 
  LogOut, 
  FileText, 
  RefreshCw, 
  Mail 
} from 'lucide-react';
import { getSettings } from '@/lib/settings';
import { generateTeamPDF, generateAllTeamsPDF } from '@/lib/pdfGenerator';
import { toast } from 'sonner';
import { recalculateAllTeamsData } from '@/utils/teamCalculations';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamRegistration[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<TeamRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
  const settings = getSettings();
  
  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem('admin_authenticated');
    const authExpiry = localStorage.getItem('admin_auth_expiry');
    const isExpired = authExpiry ? new Date(authExpiry) < new Date() : true;
    
    if (isLoggedIn !== 'true' || isExpired) {
      toast.error("Accès non autorisé. Veuillez vous connecter.");
      navigate('/admin');
      return;
    }
    
    // Load registrations
    loadRegistrations();
  }, [navigate]);

  // Apply filters when teams or filters change
  useEffect(() => {
    applyFilters();
  }, [teams, filters]);

  // Charger les inscriptions depuis le stockage
  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const registrations = await getAllRegistrations();
      console.log("Inscriptions chargées:", registrations.length);
      setTeams(registrations);
    } catch (error) {
      console.error("Erreur lors du chargement des inscriptions:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply all filters to the teams
  const applyFilters = () => {
    let result = [...teams];
    
    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(team => team.generalInfo.category === filters.category);
    }
    
    // Status filter
    if (filters.status !== 'all') {
      result = result.filter(team => team.status === filters.status);
    }
    
    // QCM Score range
    if (filters.qcmScoreMin !== null) {
      result = result.filter(team => 
        team.qcmScore !== undefined && team.qcmScore >= filters.qcmScoreMin!
      );
    }
    if (filters.qcmScoreMax !== null) {
      result = result.filter(team => 
        team.qcmScore !== undefined && team.qcmScore <= filters.qcmScoreMax!
      );
    }
    
    // Interview Score range
    if (filters.interviewScoreMin !== null) {
      result = result.filter(team => 
        team.interviewScore !== undefined && team.interviewScore >= filters.interviewScoreMin!
      );
    }
    if (filters.interviewScoreMax !== null) {
      result = result.filter(team => 
        team.interviewScore !== undefined && team.interviewScore <= filters.interviewScoreMax!
      );
    }
    
    // Interview date range
    if (filters.interviewDateStart) {
      result = result.filter(team => 
        team.interviewDate && team.interviewDate >= filters.interviewDateStart
      );
    }
    if (filters.interviewDateEnd) {
      result = result.filter(team => 
        team.interviewDate && team.interviewDate <= filters.interviewDateEnd
      );
    }
    
    // Search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(team => 
        team.generalInfo.name.toLowerCase().includes(term) ||
        team.generalInfo.institution.toLowerCase().includes(term) ||
        team.generalInfo.city.toLowerCase().includes(term) ||
        (team.generalInfo.pedagogicalReferentEmail && team.generalInfo.pedagogicalReferentEmail.toLowerCase().includes(term))
      );
    }
    
    setFilteredTeams(result);
  };

  // Exporter une équipe spécifique au format PDF
  const exportTeamPDF = async (teamId: string) => {
    try {
      toast.info("Génération du PDF en cours...");
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
      toast.info("Exportation des données en CSV...");
      const csv = await exportAllRegistrationsToCSV();
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `equipes_igc_${new Date().toISOString().split('T')[0]}.csv`);
      
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
      // Track if we should send emails
      const team = teams.find(t => t.id === teamId);
      let sendInterviewEmail = false;
      let sendDecisionEmail = false;
      
      // Check if we've added interview details
      if (team && 
          (!team.interviewDate || !team.interviewTime || !team.interviewLink) && 
          updatedData.interviewDate && updatedData.interviewTime && updatedData.interviewLink) {
        sendInterviewEmail = true;
      }
      
      // Check if decision has been updated
      if (team && 
          (!team.decision) && 
          updatedData.decision) {
        sendDecisionEmail = true;
      }
      
      // Update in Supabase
      await updateRegistration(teamId, updatedData);
      
      // Refresh local data
      const updatedTeam = { ...team, ...updatedData } as TeamRegistration;
      setTeams(prev => 
        prev.map(team => 
          team.id === teamId ? updatedTeam : team
        )
      );
      
      // Send emails if needed
      if (sendInterviewEmail && updatedTeam.qcmQualified) {
        toast.info("Envoi de l'invitation à l'entretien...");
        const success = await sendInterviewInvitation(updatedTeam);
        if (success) {
          toast.success("Email d'invitation à l'entretien envoyé avec succès");
        } else {
          toast.error("Échec de l'envoi de l'email d'invitation");
        }
      }
      
      if (sendDecisionEmail && updatedTeam.decision) {
        toast.info("Envoi de la notification de décision...");
        const success = await sendDecisionNotification(updatedTeam);
        if (success) {
          toast.success("Email de notification de décision envoyé avec succès");
        } else {
          toast.error("Échec de l'envoi de l'email de notification");
        }
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
    } catch (error) {
      console.error("Erreur lors du recalcul:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Send test emails to verify the email service is working
  const sendTestEmail = async () => {
    try {
      // Check if we have at least one team with email
      const teamWithEmail = teams.find(team => team.generalInfo.pedagogicalReferentEmail);
      
      if (!teamWithEmail) {
        toast.error("Aucune équipe avec un email n'a été trouvée");
        return;
      }
      
      toast.info("Envoi d'un email de test...");
      const success = await sendRegistrationConfirmation(teamWithEmail);
      
      if (success) {
        toast.success(`Email de test envoyé à ${teamWithEmail.generalInfo.pedagogicalReferentEmail}`);
      } else {
        toast.error("Échec de l'envoi de l'email de test");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de test:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_auth_expiry');
    toast.success("Vous avez été déconnecté avec succès");
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-igc-navy/5 to-igc-purple/5 animate-fade-in">
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

        {/* Statistics Dashboard */}
        <div className="mb-8">
          <AdminDashboardStats teams={teams} />
        </div>
        
        {/* Advanced Filters */}
        <AdminFilterBar onFilterChange={setFilters} />
        
        {/* Teams Table with Tabs */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-igc-navy"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTeams.length > 0 ? (
              <TeamTrackingTable 
                teams={filteredTeams} 
                onTeamUpdate={handleTeamUpdate} 
                onTeamDelete={handleTeamDelete}
                onExportTeamPDF={exportTeamPDF}
                onRecalculatePoints={handleRecalculateAll}
              />
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <p className="text-lg text-gray-500 mb-2">Aucune équipe ne correspond aux critères de recherche</p>
                <p className="text-sm text-gray-400">Essayez de modifier vos filtres ou d'ajouter de nouvelles équipes</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-6">
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
            onClick={() => generateAllTeamsPDF()}
          >
            <FileText className="w-4 h-4" />
            Exporter toutes les fiches PDF
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white transition-all duration-300 rounded-[47px]"
            onClick={handleRecalculateAll}
          >
            <RefreshCw className="w-4 h-4" />
            Recalculer tous les classements
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-igc-navy text-igc-navy hover:bg-igc-magenta hover:text-white transition-all duration-300 rounded-[47px]"
            onClick={sendTestEmail}
          >
            <Mail className="w-4 h-4" />
            Tester l'envoi d'emails
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
