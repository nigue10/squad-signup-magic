import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TeamRegistration, TeamStatus, TeamCategory, TeamDecision } from '@/types/igc';
import { useToast } from "@/components/ui/use-toast";
import { Check, X, MoreHorizontal, Calendar, Clock, Link2, Edit, Save, FileCheck } from 'lucide-react';
import { getSettings } from '@/lib/settings';

interface TeamTrackingTableProps {
  teams: TeamRegistration[];
  onTeamUpdate: (teamId: string, updatedData: Partial<TeamRegistration>) => void;
}

const TeamTrackingTable = ({ teams, onTeamUpdate }: TeamTrackingTableProps) => {
  const { toast } = useToast();
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [tempData, setTempData] = useState<Partial<TeamRegistration>>({});
  const [planningDialog, setPlanningDialog] = useState<string | null>(null);
  const [editScoreDialog, setEditScoreDialog] = useState<string | null>(null);
  const [editNotesDialog, setEditNotesDialog] = useState<string | null>(null);
  
  // Récupérer les paramètres configurables
  const settings = getSettings();
  
  // Fonction pour calculer si une équipe est qualifiée pour l'entretien
  const calculateQcmQualification = (score: number, category: TeamCategory): boolean => {
    const threshold = category === 'Secondaire' 
      ? settings.secondaryQcmThreshold 
      : settings.higherQcmThreshold;
    return score >= threshold;
  };
  
  // Fonction pour formater l'affichage du statut
  const getStatusBadge = (status?: TeamStatus) => {
    if (!status) return <Badge variant="outline">Non défini</Badge>;
    
    switch(status) {
      case 'Inscrit':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Inscrit</Badge>;
      case 'QCM soumis':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">QCM soumis</Badge>;
      case 'Éliminé QCM':
        return <Badge variant="destructive">Éliminé QCM</Badge>;
      case 'Qualifié pour entretien':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Qualifié pour entretien</Badge>;
      case 'Entretien réalisé':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Entretien réalisé</Badge>;
      case 'Sélectionné':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Sélectionné</Badge>;
      case 'Non retenu':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700">Non retenu</Badge>;
      default:
        return <Badge variant="outline">Non défini</Badge>;
    }
  };
  
  // Fonction pour formater l'affichage de la qualification QCM
  const getQcmQualificationBadge = (qualified?: boolean) => {
    if (qualified === undefined) return <span className="text-gray-400">-</span>;
    
    return qualified ? 
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Oui</Badge> : 
      <Badge variant="destructive">Non</Badge>;
  };
  
  // Fonction pour formater l'affichage de la décision finale
  const getDecisionBadge = (decision?: TeamDecision) => {
    if (!decision) return <span className="text-gray-400">-</span>;
    
    return decision === 'Sélectionné' ? 
      <Badge className="bg-green-100 text-green-800">Sélectionné</Badge> : 
      <Badge variant="outline" className="bg-gray-100 text-gray-700">Non retenu</Badge>;
  };
  
  // Gérer l'envoi des mises à jour d'une équipe
  const handleSaveTeam = (teamId: string) => {
    if (!teamId || !tempData) return;
    
    try {
      // Mise à jour de la qualification QCM si le score a été modifié
      if (tempData.qcmScore !== undefined && teams.find(t => t.id === teamId)) {
        const team = teams.find(t => t.id === teamId)!;
        const category = team.generalInfo.category;
        tempData.qcmQualified = calculateQcmQualification(tempData.qcmScore, category);
        
        // Mise à jour automatique du statut en fonction du score QCM
        if (tempData.qcmQualified) {
          tempData.status = 'Qualifié pour entretien';
        } else {
          tempData.status = 'Éliminé QCM';
        }
      }
      
      // Appliquer les mises à jour
      onTeamUpdate(teamId, tempData);
      
      toast({
        title: "Modifications enregistrées",
        description: "Les informations de l'équipe ont été mises à jour."
      });
      
      // Réinitialiser l'état d'édition
      setEditingTeam(null);
      setTempData({});
      setPlanningDialog(null);
      setEditScoreDialog(null);
      setEditNotesDialog(null);
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive"
      });
    }
  };
  
  // Initialiser les données temporaires pour l'édition
  const initTempData = (team: TeamRegistration) => {
    setTempData({
      status: team.status,
      qcmScore: team.qcmScore,
      qcmQualified: team.qcmQualified,
      interviewDate: team.interviewDate,
      interviewTime: team.interviewTime,
      interviewLink: team.interviewLink,
      interviewScore: team.interviewScore,
      interviewNotes: team.interviewNotes,
      decision: team.decision,
      comments: team.comments
    });
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-igc-navy/5">
          <TableRow>
            <TableHead>Nom de l'équipe</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>École/Université</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Score QCM</TableHead>
            <TableHead>Qualification QCM</TableHead>
            <TableHead>Date d'entretien</TableHead>
            <TableHead>Heure</TableHead>
            <TableHead>Score entretien</TableHead>
            <TableHead>Classement</TableHead>
            <TableHead>Décision</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => (
            <TableRow key={team.id} className="hover:bg-igc-purple/5">
              <TableCell className="font-medium">{team.generalInfo.name}</TableCell>
              <TableCell>
                <Badge variant={team.generalInfo.category === 'Secondaire' ? 'secondary' : 'outline'}>
                  {team.generalInfo.category}
                </Badge>
              </TableCell>
              <TableCell>{team.generalInfo.institution}</TableCell>
              <TableCell>{team.generalInfo.city}</TableCell>
              <TableCell className="text-sm">
                <div>{team.generalInfo.pedagogicalReferentEmail || '-'}</div>
                <div>{team.generalInfo.pedagogicalReferentPhone || '-'}</div>
              </TableCell>
              <TableCell>
                {editingTeam === team.id ? (
                  <Select 
                    value={tempData.status || ''} 
                    onValueChange={(value) => setTempData({...tempData, status: value as TeamStatus})}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inscrit">Inscrit</SelectItem>
                      <SelectItem value="QCM soumis">QCM soumis</SelectItem>
                      <SelectItem value="Éliminé QCM">Éliminé QCM</SelectItem>
                      <SelectItem value="Qualifié pour entretien">Qualifié pour entretien</SelectItem>
                      <SelectItem value="Entretien réalisé">Entretien réalisé</SelectItem>
                      <SelectItem value="Sélectionné">Sélectionné</SelectItem>
                      <SelectItem value="Non retenu">Non retenu</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getStatusBadge(team.status)
                )}
              </TableCell>
              <TableCell>
                {editingTeam === team.id ? (
                  <Input 
                    type="number" 
                    className="w-16"
                    value={tempData.qcmScore || ''} 
                    onChange={(e) => setTempData({...tempData, qcmScore: parseInt(e.target.value) || 0})}
                    min="0"
                    max="100"
                  />
                ) : (
                  team.qcmScore !== undefined ? team.qcmScore : '-'
                )}
              </TableCell>
              <TableCell>
                {getQcmQualificationBadge(team.qcmQualified)}
              </TableCell>
              <TableCell>
                {team.interviewDate || '-'}
              </TableCell>
              <TableCell>
                {team.interviewTime || '-'}
              </TableCell>
              <TableCell>
                {team.interviewScore !== undefined ? team.interviewScore.toFixed(1) : '-'}
              </TableCell>
              <TableCell>
                {team.interviewRank !== undefined ? `#${team.interviewRank}` : '-'}
              </TableCell>
              <TableCell>
                {editingTeam === team.id ? (
                  <Select 
                    value={tempData.decision || ''} 
                    onValueChange={(value) => setTempData({...tempData, decision: value as TeamDecision})}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Décision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Non défini</SelectItem>
                      <SelectItem value="Sélectionné">Sélectionné</SelectItem>
                      <SelectItem value="Non retenu">Non retenu</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  getDecisionBadge(team.decision)
                )}
              </TableCell>
              <TableCell>
                {editingTeam === team.id ? (
                  <div className="flex space-x-1">
                    <Button 
                      variant="default" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleSaveTeam(team.id!)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingTeam(null);
                        setTempData({});
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => {
                        setEditingTeam(team.id!);
                        initTempData(team);
                      }}>
                        <Edit className="mr-2 h-4 w-4" /> Modifier le statut
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => {
                        setEditScoreDialog(team.id!);
                        initTempData(team);
                      }}>
                        <FileCheck className="mr-2 h-4 w-4" /> Entrer scores QCM
                      </DropdownMenuItem>
                      
                      {team.qcmQualified && (
                        <DropdownMenuItem onClick={() => {
                          setPlanningDialog(team.id!);
                          initTempData(team);
                        }}>
                          <Calendar className="mr-2 h-4 w-4" /> Planifier entretien
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuItem onClick={() => {
                        setEditNotesDialog(team.id!);
                        initTempData(team);
                      }}>
                        <Edit className="mr-2 h-4 w-4" /> Éditer notes/commentaires
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Dialog pour la planification des entretiens */}
      <Dialog open={!!planningDialog} onOpenChange={(open) => !open && setPlanningDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Planifier un entretien</DialogTitle>
            <DialogDescription>
              Définissez la date, l'heure et le lien pour l'entretien de l'équipe.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interview-date" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Input
                  id="interview-date"
                  type="date"
                  value={tempData.interviewDate || ''}
                  onChange={(e) => setTempData({...tempData, interviewDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interview-time" className="text-right">
                Heure
              </Label>
              <div className="col-span-3">
                <Input
                  id="interview-time"
                  type="time"
                  value={tempData.interviewTime || ''}
                  onChange={(e) => setTempData({...tempData, interviewTime: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interview-link" className="text-right">
                Lien Google Meet
              </Label>
              <div className="col-span-3">
                <Input
                  id="interview-link"
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={tempData.interviewLink || ''}
                  onChange={(e) => setTempData({...tempData, interviewLink: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanningDialog(null)}>
              Annuler
            </Button>
            <Button onClick={() => {
              if (planningDialog) {
                // Mettre à jour automatiquement le statut
                if (tempData.interviewDate && tempData.interviewTime) {
                  tempData.status = 'Qualifié pour entretien';
                }
                handleSaveTeam(planningDialog);
              }
            }}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour l'édition des scores */}
      <Dialog open={!!editScoreDialog} onOpenChange={(open) => !open && setEditScoreDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer les résultats du QCM</DialogTitle>
            <DialogDescription>
              Entrez le score obtenu au QCM. La qualification est automatiquement déterminée selon la catégorie.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="qcm-score" className="text-right">
                Score QCM (sur 100)
              </Label>
              <div className="col-span-3">
                <Input
                  id="qcm-score"
                  type="number"
                  min="0"
                  max="100"
                  value={tempData.qcmScore || ''}
                  onChange={(e) => setTempData({...tempData, qcmScore: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            {/* Aperçu de la qualification (calculée lors de la sauvegarde) */}
            {tempData.qcmScore !== undefined && editScoreDialog && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Qualification prévisionnelle: </span>
                  {calculateQcmQualification(
                    tempData.qcmScore, 
                    teams.find(t => t.id === editScoreDialog)?.generalInfo.category || 'Secondaire'
                  ) ? (
                    <span className="text-green-600 font-medium">Qualifié</span>
                  ) : (
                    <span className="text-red-600 font-medium">Non qualifié</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Seuil: {teams.find(t => t.id === editScoreDialog)?.generalInfo.category === 'Secondaire' ? '60' : '70'}/100
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interview-score" className="text-right">
                Score entretien (sur 10)
              </Label>
              <div className="col-span-3">
                <Input
                  id="interview-score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={tempData.interviewScore || ''}
                  onChange={(e) => setTempData({...tempData, interviewScore: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditScoreDialog(null)}>
              Annuler
            </Button>
            <Button onClick={() => {
              if (editScoreDialog) {
                // Mise à jour automatique du statut si le score d'entretien est défini
                if (tempData.interviewScore !== undefined) {
                  tempData.status = 'Entretien réalisé';
                } else if (tempData.qcmScore !== undefined) {
                  tempData.status = 'QCM soumis';
                }
                handleSaveTeam(editScoreDialog);
              }
            }}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog pour l'édition des notes et commentaires */}
      <Dialog open={!!editNotesDialog} onOpenChange={(open) => !open && setEditNotesDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notes et commentaires</DialogTitle>
            <DialogDescription>
              Ajoutez des notes d'entretien et des commentaires pour cette équipe.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="interview-notes">Notes des interviewers</Label>
              <Textarea
                id="interview-notes"
                rows={5}
                placeholder="Impressions après l'entretien, justifiant le score..."
                value={tempData.interviewNotes || ''}
                onChange={(e) => setTempData({...tempData, interviewNotes: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comments">Commentaires</Label>
              <Textarea
                id="comments"
                rows={3}
                placeholder="Feedback ou remarques supplémentaires..."
                value={tempData.comments || ''}
                onChange={(e) => setTempData({...tempData, comments: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditNotesDialog(null)}>
              Annuler
            </Button>
            <Button onClick={() => {
              if (editNotesDialog) {
                handleSaveTeam(editNotesDialog);
              }
            }}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamTrackingTable;
