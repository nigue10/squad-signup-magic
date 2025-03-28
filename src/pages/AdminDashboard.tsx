
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import LogoHeader from '@/components/LogoHeader';
import { getAllRegistrations } from '@/lib/storage';
import { TeamRegistration } from '@/types/igc';
import { formatDate, downloadCSV } from '@/lib/helpers';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileSpreadsheet, 
  Eye, 
  Clock,
  School,
  MapPin,
  Flag,
  Award
} from 'lucide-react';

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<TeamRegistration[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamRegistration | null>(null);
  
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
    } catch (error) {
      console.error("Erreur lors du chargement des équipes:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les équipes inscrites",
        variant: "destructive",
      });
    }
  }, [toast]);
  
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
      // Préparation des données pour l'export CSV
      const flatData = registrations.map(team => ({
        id: team.id,
        team_name: team.generalInfo.name,
        category: team.generalInfo.category,
        city: team.generalInfo.city,
        commune: team.generalInfo.commune,
        institution: team.generalInfo.institution,
        team_leader: team.generalInfo.teamLeaderName,
        members_count: team.members.filter(m => m.name).length,
        robotics_level: team.vision.roboticsLevel,
        has_workspace: team.vision.hasWorkspace ? 'Oui' : 'Non',
        created_at: team.createdAt,
      }));
      
      downloadCSV(flatData, `igc_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
      
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
  
  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };
  
  // Affichage des détails d'une équipe
  const viewTeamDetails = (team: TeamRegistration) => {
    setSelectedTeam(team);
  };
  
  return (
    <div className="min-h-screen bg-igc-gray">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <LogoHeader />
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-center text-igc-blue mb-8">
            Tableau de bord administrateur
          </h1>
          
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
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="list" className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> Liste des équipes
                  </TabsTrigger>
                  {selectedTeam && (
                    <TabsTrigger value="details" className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> Détails de l'équipe
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleExportCSV}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Exporter CSV
                </Button>
              </div>
              
              <TabsContent value="list" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full form-table">
                    <thead>
                      <tr>
                        <th>Équipe</th>
                        <th>Catégorie</th>
                        <th>Institution</th>
                        <th>Ville</th>
                        <th>Membres</th>
                        <th>Date d'inscription</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((team) => (
                        <tr key={team.id}>
                          <td className="font-medium">{team.generalInfo.name}</td>
                          <td>
                            <Badge variant={team.generalInfo.category === 'Secondaire' ? 'secondary' : 'outline'}>
                              {team.generalInfo.category}
                            </Badge>
                          </td>
                          <td>{team.generalInfo.institution}</td>
                          <td>{team.generalInfo.city}</td>
                          <td className="text-center">
                            {team.members.filter(m => m.name).length}
                          </td>
                          <td>
                            {team.createdAt ? formatDate(team.createdAt) : 'N/A'}
                          </td>
                          <td>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => viewTeamDetails(team)}
                            >
                              <Eye className="w-4 h-4" /> Voir
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                              <table className="w-full form-table">
                                <thead>
                                  <tr>
                                    <th>Nom</th>
                                    <th>Genre</th>
                                    <th>Date de naissance</th>
                                    <th>Niveau</th>
                                    <th>École</th>
                                    <th>Ville</th>
                                    <th>Contact</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedTeam.members
                                    .filter(member => member.name)
                                    .map((member) => (
                                      <tr key={member.id}>
                                        <td className="font-medium">{member.name}</td>
                                        <td>{member.gender}</td>
                                        <td>{formatDate(member.birthDate)}</td>
                                        <td>{member.level}</td>
                                        <td>{member.school}</td>
                                        <td>{member.city}</td>
                                        <td className="text-sm">
                                          {member.email && <div>{member.email}</div>}
                                          {member.phone && <div>{member.phone}</div>}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex justify-end">
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
