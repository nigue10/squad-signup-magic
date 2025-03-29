
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import { TeamRegistration } from '@/types/igc';
import { Printer, Download, MoreHorizontal, Mail, Trash, FileCheck } from 'lucide-react';

interface AdminTeamActionsProps {
  team: TeamRegistration;
}

const AdminTeamActions = ({ team }: AdminTeamActionsProps) => {
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handlePrint = () => {
    toast({
      title: "Impression préparée",
      description: "La fiche d'inscription est prête à être imprimée",
    });
    // Dans une vraie application, cette fonction ouvrirait une fenêtre d'impression
    window.print();
  };
  
  const handleSendEmail = () => {
    // Cette fonction enverrait un email au référent pédagogique
    const email = team.generalInfo.pedagogicalReferentEmail;
    if (email) {
      toast({
        title: "Email en préparation",
        description: `Un email sera envoyé à ${email}`,
      });
    } else {
      toast({
        title: "Pas d'email disponible",
        description: "Aucune adresse email n'est associée à cette équipe",
        variant: "destructive",
      });
    }
  };
  
  const handleMarkAsVerified = () => {
    toast({
      title: "Équipe vérifiée",
      description: "L'inscription a été marquée comme vérifiée",
    });
  };
  
  const handleDeleteConfirm = () => {
    setConfirmDelete(false);
    
    // Simule la suppression (à implémenter dans une vraie application)
    toast({
      title: "Équipe supprimée",
      description: "L'inscription a été supprimée avec succès"
    });
  };
  
  const downloadTeamData = () => {
    // Création d'un fichier JSON avec les données de l'équipe
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(team, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `equipe-${team.generalInfo.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Téléchargement réussi",
      description: "Les données de l'équipe ont été téléchargées",
    });
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Imprimer
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2" onClick={downloadTeamData}>
            <Download className="h-4 w-4" /> Télécharger
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2" onClick={handleSendEmail}>
            <Mail className="h-4 w-4" /> Envoyer un email
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2" onClick={handleMarkAsVerified}>
            <FileCheck className="h-4 w-4" /> Marquer comme vérifié
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="flex items-center gap-2 text-red-500" 
            onClick={() => setConfirmDelete(true)}
          >
            <Trash className="h-4 w-4" /> Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'inscription de l'équipe <strong>{team.generalInfo.name}</strong> ?
              <br />Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminTeamActions;
