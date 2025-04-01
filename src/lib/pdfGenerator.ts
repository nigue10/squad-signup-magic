
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getRegistrationById, getAllRegistrations } from './storage';
import { getSettings } from './settings';
import { TeamRegistration } from '@/types/igc';
import { 
  createPdfBackground, 
  addLogos, 
  addHeader, 
  addPdfFooter, 
  getTeamPoints,
  formatGeneralInfo,
  formatMemberInfo,
  formatSkillsSection,
  formatMotivationSection,
  generateMarkdownTemplate
} from './pdfUtils';
import { toast } from 'sonner';

/**
 * Génère un PDF pour une équipe spécifique
 * @param teamId ID de l'équipe
 */
export const generateTeamPDF = async (teamId: string): Promise<void> => {
  try {
    // Récupérer les données de l'équipe
    const team = getRegistrationById(teamId);
    if (!team) {
      toast.error(`Équipe avec l'ID ${teamId} non trouvée`);
      throw new Error(`Équipe avec l'ID ${teamId} non trouvée`);
    }

    const settings = getSettings();
    
    // Pour débogage: générer le template markdown
    console.log("Markdown template:", generateMarkdownTemplate(team, settings));
    
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Create background
    createPdfBackground(doc);
    
    // Add the IGC logo and header
    addLogos(doc);
    addHeader(doc, settings);
    
    // Set initial Y position for content
    let yPos = 95;
    
    // 1. General Information
    yPos = formatGeneralInfo(doc, team, yPos);
    
    // 2. Team Members
    doc.setFontSize(14);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("👥 Composition de l'Équipe", 20, yPos);
    doc.setFont("helvetica", "normal");
    
    // Add notes about team composition
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text("👉 Le chef d'équipe doit figurer dans la liste ci-dessous et y renseigner ses coordonnées.", 25, yPos + 10);
    doc.text(`✅ Rappel composition : ${team.generalInfo.category === 'Secondaire' ? 'Secondaire : 6 membres' : 'Supérieur : 4 à 6 membres'}`, 25, yPos + 18);
    doc.text("NB : Les équipes composées de filles sont très encouragées.", 25, yPos + 26);
    doc.setFont("helvetica", "normal");
    
    // Add members table
    yPos = formatMemberInfo(doc, team, yPos + 30);
    
    // Check if we need a new page
    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = 20;
    }
    
    // 3. Skills Section
    yPos = formatSkillsSection(doc, team, yPos);
    
    // Check if we need a new page
    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = 20;
    }
    
    // 4. Motivation & Vision
    yPos = formatMotivationSection(doc, team, yPos);
    
    // Add footer with page numbers
    addPdfFooter(doc, team, settings);
    
    // Save the PDF
    doc.save(`IGC_${settings.applicationYear}_Fiche_${team.generalInfo.name.replace(/\s+/g, '_')}.pdf`);
    toast.success(`PDF généré avec succès pour l'équipe ${team.generalInfo.name}`);
    return Promise.resolve();
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return Promise.reject(error);
  }
};

/**
 * Génère un PDF avec toutes les équipes
 */
export const generateAllTeamsPDF = async (): Promise<void> => {
  try {
    const teams = getAllRegistrations();
    if (teams.length === 0) {
      toast.error("Aucune équipe trouvée");
      throw new Error("Aucune équipe trouvée");
    }
    
    toast.info(`Génération des fiches PDF pour ${teams.length} équipes...`);
    
    // Create separate PDF for each team
    const promises = teams.map(team => 
      new Promise<void>((resolve, reject) => {
        try {
          if (team.id) {
            generateTeamPDF(team.id)
              .then(() => resolve())
              .catch(err => reject(err));
          } else {
            resolve(); // Ignorer les équipes sans ID
          }
        } catch (error) {
          reject(error);
        }
      })
    );
    
    await Promise.all(promises);
    toast.success(`${teams.length} fiches PDF ont été générées avec succès.`);
  } catch (error) {
    console.error("Erreur lors de la génération des fiches PDF:", error);
    toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    throw error;
  }
};

/**
 * Exporte une seule équipe au format CSV
 */
export const exportTeamToCSV = (team: TeamRegistration): string => {
  // Headers for CSV
  const headers = [
    "Nom de l'équipe",
    "Catégorie",
    "Établissement",
    "Ville",
    "Commune",
    "Email Référent",
    "Téléphone Référent",
    "Statut",
    "Score QCM",
    "Qualification QCM",
    "Date entretien",
    "Heure entretien",
    "Lien entretien",
    "Score entretien",
    "Classement",
    "Décision",
    "Commentaires",
    "Nombre de membres",
    "Niveau en robotique",
    "Espace de travail"
  ];
  
  // Prepare data row
  const row = [
    team.generalInfo.name,
    team.generalInfo.category,
    team.generalInfo.institution,
    team.generalInfo.city,
    team.generalInfo.commune || "",
    team.generalInfo.pedagogicalReferentEmail || "",
    team.generalInfo.pedagogicalReferentPhone || "",
    team.status || "Inscrit",
    team.qcmScore !== undefined ? String(team.qcmScore) : "",
    team.qcmQualified !== undefined ? (team.qcmQualified ? "Oui" : "Non") : "",
    team.interviewDate || "",
    team.interviewTime || "",
    team.interviewLink || "",
    team.interviewScore !== undefined ? String(team.interviewScore) : "",
    team.interviewRank !== undefined ? String(team.interviewRank) : "",
    team.decision || "",
    team.comments || "",
    team.members ? String(team.members.length) : "0",
    team.vision?.roboticsLevel || "",
    team.vision?.hasWorkspace ? "Oui" : "Non"
  ];
  
  // Format as CSV
  return headers.join(",") + "\n" + row.map(field => {
    // Escape fields with commas, quotes or newlines
    if (field && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }).join(",");
};
