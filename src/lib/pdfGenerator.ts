
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getRegistrationById, getAllRegistrations } from './storage';
import { getSettings } from './settings';
import { TeamRegistration } from '@/types/igc';

/**
 * Génère un PDF pour une équipe spécifique
 * @param teamId ID de l'équipe
 */
export const generateTeamPDF = async (teamId: string): Promise<void> => {
  // Récupérer les données de l'équipe
  const team = getRegistrationById(teamId);
  if (!team) {
    throw new Error(`Équipe avec l'ID ${teamId} non trouvée`);
  }

  const settings = getSettings();
  
  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // Ajouter un titre
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102); // Couleur IGC Navy
  doc.text("Fiche d'Équipe IGC", 105, 15, { align: 'center' });
  doc.setFontSize(16);
  doc.text(`${settings.applicationYear}`, 105, 22, { align: 'center' });
  
  // Ajouter les informations de base
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Informations Générales", 14, 35);
  
  // Tableau d'informations générales
  autoTable(doc, {
    startY: 40,
    head: [['Champ', 'Valeur']],
    body: [
      ["Nom de l'équipe", team.generalInfo.name],
      ["Catégorie", team.generalInfo.category],
      ["Institution", team.generalInfo.institution],
      ["Ville", team.generalInfo.city],
      ["Email référent", team.generalInfo.pedagogicalReferentEmail || '-'],
      ["Téléphone référent", team.generalInfo.pedagogicalReferentPhone || '-'],
      ["Statut actuel", team.status || 'Inscrit']
    ],
    headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 245] }
  });
  
  // Ajouter les résultats du QCM si disponibles
  if (team.qcmScore !== undefined) {
    const currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Résultats du QCM", 14, currentY);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Détail', 'Valeur']],
      body: [
        ["Score QCM", `${team.qcmScore}/100`],
        ["Qualification", team.qcmQualified ? 'Oui' : 'Non'],
        ["Seuil de qualification", team.generalInfo.category === 'Secondaire' 
          ? `${settings.secondaryQcmThreshold}%` 
          : `${settings.higherQcmThreshold}%`],
      ],
      headStyles: { fillColor: [148, 0, 211], textColor: [255, 255, 255] }, // Couleur IGC Magenta/Purple
      alternateRowStyles: { fillColor: [245, 240, 250] }
    });
  }
  
  // Ajouter les informations d'entretien si disponibles
  if (team.interviewDate || team.interviewScore !== undefined) {
    const currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Entretien", 14, currentY);
    
    const interviewData = [
      ["Date", team.interviewDate || '-'],
      ["Heure", team.interviewTime || '-'],
      ["Lien", team.interviewLink || '-'],
    ];
    
    if (team.interviewScore !== undefined) {
      interviewData.push(
        ["Score", `${team.interviewScore}/10`],
        ["Classement", team.interviewRank ? `#${team.interviewRank}` : '-'],
        ["Décision", team.decision || '-']
      );
    }
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Détail', 'Valeur']],
      body: interviewData,
      headStyles: { fillColor: [0, 102, 51], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 250, 240] }
    });
  }
  
  // Ajouter les membres de l'équipe si disponibles
  if (team.members && team.members.length > 0) {
    const currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Membres de l'équipe", 14, currentY);
    
    const memberRows = team.members.map((member, index) => [
      `${index + 1}`,
      member.name,
      member.gender,
      member.email || '-',
      member.phone || '-',
      member.level || '-'
    ]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['#', 'Nom', 'Genre', 'Email', 'Téléphone', 'Niveau']],
      body: memberRows,
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 245] }
    });
  }
  
  // Ajouter les notes et commentaires si disponibles
  if (team.interviewNotes || team.comments) {
    const currentY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Notes et commentaires", 14, currentY);
    
    const notesData = [];
    if (team.interviewNotes) notesData.push(["Notes d'entretien", team.interviewNotes]);
    if (team.comments) notesData.push(["Commentaires", team.comments]);
    
    autoTable(doc, {
      startY: currentY + 5,
      head: [['Type', 'Contenu']],
      body: notesData,
      headStyles: { fillColor: [120, 120, 120], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
  }
  
  // Ajouter un pied de page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Ivorian Genius Contest ${settings.applicationYear} - Généré le ${new Date().toLocaleDateString()}`,
      105, 
      doc.internal.pageSize.height - 10, 
      { align: 'center' }
    );
  }
  
  // Télécharger le PDF
  doc.save(`IGC_Fiche_${team.generalInfo.name.replace(/\s+/g, '_')}.pdf`);
};

/**
 * Génère un PDF avec toutes les équipes
 */
export const generateAllTeamsPDF = async (): Promise<void> => {
  const teams = getAllRegistrations();
  if (teams.length === 0) {
    throw new Error("Aucune équipe trouvée");
  }
  
  // Créer une promesse pour attendre que toutes les générations de PDF soient terminées
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
  
  try {
    await Promise.all(promises);
    console.log(`${teams.length} fiches PDF ont été générées avec succès.`);
  } catch (error) {
    console.error("Erreur lors de la génération des fiches PDF:", error);
    throw error;
  }
};
