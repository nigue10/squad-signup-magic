
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getRegistrationById, getAllRegistrations } from './storage';
import { getSettings } from './settings';
import { TeamRegistration } from '@/types/igc';
import { createPdfBackground, addLogos, addHeader, addPdfFooter, getTeamPoints } from './pdfUtils';

/**
 * Génère un PDF pour une équipe spécifique
 * @param teamId ID de l'équipe
 */
export const generateTeamPDF = async (teamId: string): Promise<void> => {
  try {
    // Récupérer les données de l'équipe
    const team = getRegistrationById(teamId);
    if (!team) {
      throw new Error(`Équipe avec l'ID ${teamId} non trouvée`);
    }

    const settings = getSettings();
    
    // Calculer les points
    const points = getTeamPoints(team);
    
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    
    // Create background and add logos
    createPdfBackground(doc);
    addLogos(doc);
    addHeader(doc, settings);
    
    // Partie 1: Informations Générales sur l'Équipe
    let yPos = 50;
    
    doc.setFontSize(16);
    doc.setTextColor(27, 20, 100);
    doc.setFillColor(27, 20, 100);
    doc.rect(15, yPos - 5, 10, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("1", 20, yPos);
    doc.setFontSize(16);
    doc.setTextColor(27, 20, 100);
    doc.text("Informations Générales", 30, yPos);
    
    yPos += 15;
    
    // Cadre d'information principale
    doc.setDrawColor(27, 20, 100);
    doc.setFillColor(255, 255, 255, 0.7);
    doc.roundedRect(15, yPos - 5, 180, 60, 5, 5, 'FD');
    
    // Nom de l'équipe
    doc.setFontSize(14);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Équipe:", 25, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(team.generalInfo.name, 70, yPos + 5);
    
    // Points
    doc.setFontSize(14);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Points:", 135, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(points.toString(), 175, yPos + 5);
    
    yPos += 15;
    
    // Catégorie
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Catégorie:", 25, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(team.generalInfo.category, 70, yPos + 5);
    
    // Statut
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Statut:", 135, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(team.status || "Non défini", 175, yPos + 5);
    
    yPos += 15;
    
    // Institution
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Institution:", 25, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(team.generalInfo.institution || "-", 70, yPos + 5);
    
    yPos += 15;
    
    // Ville
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Ville / Commune:", 25, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(
      `${team.generalInfo.city || "-"}${team.generalInfo.commune ? ` / ${team.generalInfo.commune}` : ''}`,
      70, 
      yPos + 5
    );
    
    yPos += 30;
    
    // Partie 2: Scores et Évaluation
    doc.setFontSize(16);
    doc.setTextColor(27, 20, 100);
    doc.setFillColor(27, 20, 100);
    doc.rect(15, yPos - 5, 10, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("2", 20, yPos);
    doc.setFontSize(16);
    doc.setTextColor(27, 20, 100);
    doc.text("Scores et Évaluation", 30, yPos);
    
    yPos += 15;
    
    // Cadre des scores
    doc.setDrawColor(27, 20, 100);
    doc.setFillColor(255, 255, 255, 0.7);
    doc.roundedRect(15, yPos - 5, 180, 50, 5, 5, 'FD');
    
    // Score QCM
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Score QCM:", 25, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(team.qcmScore !== undefined ? `${team.qcmScore}/100` : "Non disponible", 70, yPos + 5);
    
    // Qualification QCM
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Qualification QCM:", 25, yPos + 20);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(team.qcmQualified ? "Oui" : "Non", 70, yPos + 20);
    
    // Score entretien
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Score entretien:", 25, yPos + 35);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(
      team.interviewScore !== undefined && team.interviewScore !== null
        ? `${team.interviewScore.toFixed(1)}/10`
        : "Non disponible", 
      70, 
      yPos + 35
    );
    
    // Classement
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Classement:", 135, yPos + 5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(team.interviewRank ? `#${team.interviewRank}` : "Non classé", 175, yPos + 5);
    
    // Décision
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Décision finale:", 135, yPos + 20);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(team.decision || "En attente", 175, yPos + 20);
    
    // Points totaux
    doc.setFontSize(12);
    doc.setTextColor(27, 20, 100);
    doc.setFont("helvetica", "bold");
    doc.text("Points totaux:", 135, yPos + 35);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(points.toString(), 175, yPos + 35);
    
    yPos += 60;
    
    // Partie 3: Composition de l'équipe
    doc.setFontSize(16);
    doc.setTextColor(27, 20, 100);
    doc.setFillColor(27, 20, 100);
    doc.rect(15, yPos - 5, 10, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("3", 20, yPos);
    doc.setFontSize(16);
    doc.setTextColor(27, 20, 100);
    doc.text("Composition de l'Équipe", 30, yPos);
    
    yPos += 15;
    
    // Tableau des membres
    if (team.members && team.members.length > 0) {
      const tableHeaders = [
        ["Nom & Prénoms", "Sexe", "Date de naissance", "Classe/Niveau", "École", "Téléphone", "Email"]
      ];
      
      const tableRows = team.members.map(member => [
        member.name,
        member.gender,
        member.birthDate || "-",
        member.level || "-",
        member.school || "-",
        member.phone || "-",
        member.email || "-"
      ]);
      
      autoTable(doc, {
        startY: yPos,
        head: tableHeaders,
        body: tableRows,
        headStyles: { 
          fillColor: [27, 20, 100], 
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [0, 0, 0]
        },
        alternateRowStyles: { 
          fillColor: [240, 240, 245] 
        },
        margin: { left: 15, right: 15 },
        styles: {
          cellPadding: 2,
          valign: 'middle',
          overflow: 'linebreak',
          lineWidth: 0.1,
          lineColor: [27, 20, 100]
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 10, halign: 'center' },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 25, halign: 'center' },
          6: { cellWidth: 35 }
        },
        theme: 'grid'
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    } else {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Aucun membre d'équipe enregistré", 105, yPos + 10, { align: 'center' });
      yPos += 25;
    }
    
    // Si on dépasse une page, passer à la page suivante
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
      
      // Ajout d'un fond léger sur la nouvelle page
      doc.setFillColor(240, 240, 245);
      doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
    }
    
    // Add footer with page numbers
    addPdfFooter(doc, team, settings);
    
    // Télécharger le PDF
    doc.save(`IGC_Fiche_${team.generalInfo.name.replace(/\s+/g, '_')}.pdf`);
    return Promise.resolve();
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    return Promise.reject(error);
  }
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
