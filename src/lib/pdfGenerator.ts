
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
  
  // Ajouter les logos
  try {
    const leftLogoWidth = 20;
    const rightLogoWidth = 30;
    
    // Logo gauche (robot IGC)
    doc.addImage("/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png", "PNG", 15, 10, leftLogoWidth, leftLogoWidth);
    
    // Logo droit (texte IGC)
    doc.addImage("/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png", "PNG", doc.internal.pageSize.width - rightLogoWidth - 15, 10, rightLogoWidth, 15);
  } catch (error) {
    console.error("Erreur lors de l'ajout des logos:", error);
  }
  
  // Ajouter un titre
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text("Ivorian Genius Contest " + settings.applicationYear, 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 102); // Couleur IGC Navy
  doc.text("FICHE D'IDENTIFICATION DE L'ÉQUIPE - IGC " + settings.applicationYear, 105, 35, { align: 'center' });
  doc.setFont("helvetica", "normal");
  
  // Partie 1: Informations Générales sur l'Équipe
  let yPos = 50;
  
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.setFillColor(240, 240, 245);
  doc.rect(15, yPos - 5, 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("📋", 17, yPos);
  doc.setTextColor(0, 51, 102);
  doc.text("Informations Générales sur l'Équipe", 30, yPos);
  
  yPos += 10;
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Date :", 15, yPos);
  doc.text(team.generalInfo.date || (new Date().toLocaleDateString()), 50, yPos);
  
  yPos += 8;
  
  // Nom de l'équipe
  doc.text("Nom de l'équipe * :", 15, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(team.generalInfo.name, 50, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 8;
  
  // Catégorie
  doc.text("Catégorie * :", 15, yPos);
  doc.text(team.generalInfo.category, 50, yPos);
  
  yPos += 8;
  
  // Ville
  doc.text("Ville * :", 15, yPos);
  doc.text(team.generalInfo.city, 50, yPos);
  
  yPos += 8;
  
  // Commune
  doc.text("Commune * :", 15, yPos);
  doc.text(team.generalInfo.commune || "-", 50, yPos);
  
  yPos += 8;
  
  // Établissement
  doc.text("Établissement ou structure de rattachement * :", 15, yPos);
  doc.text(team.generalInfo.institution, 120, yPos);
  
  yPos += 8;
  
  // Référent pédagogique (seulement pour la catégorie Secondaire)
  if (team.generalInfo.category === "Secondaire") {
    doc.text("Nom du référent pédagogique (obligatoire pour le secondaire) :", 15, yPos);
    doc.text(team.generalInfo.pedagogicalReferentName || "-", 120, yPos);
    
    yPos += 8;
    
    doc.text("Téléphone référent pédagogique :", 15, yPos);
    doc.text(team.generalInfo.pedagogicalReferentPhone || "-", 120, yPos);
    
    yPos += 8;
    
    doc.text("Email référent pédagogique :", 15, yPos);
    doc.text(team.generalInfo.pedagogicalReferentEmail || "-", 120, yPos);
    
    yPos += 8;
  }
  
  // Chef d'équipe
  doc.text("Nom du chef d'équipe :", 15, yPos);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(148, 0, 211); // Couleur IGC Magenta/Purple
  doc.text(team.generalInfo.teamLeaderName || (team.members && team.members.length > 0 ? team.members[0].name : "-"), 80, yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  yPos += 25;
  
  // Partie 2: Composition de l'Équipe
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.setFillColor(240, 240, 245);
  doc.rect(15, yPos - 5, 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("👥", 17, yPos);
  doc.setTextColor(0, 51, 102);
  doc.text("Composition de l'Équipe", 30, yPos);
  
  yPos += 10;
  
  // Instruction chef d'équipe
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("👉 Le chef d'équipe doit figurer dans la liste ci-dessous et y renseigner ses coordonnées.", 15, yPos);
  
  yPos += 10;
  
  // Rappel composition
  doc.setFillColor(230, 250, 230);
  doc.rect(15, yPos - 5, 5, 5, "F");
  doc.setTextColor(0, 150, 0);
  doc.text("✓", 16, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text("Rappel composition :", 25, yPos);
  
  yPos += 10;
  
  // Liste des règles de composition
  doc.text("• Secondaire : 6 membres", 25, yPos);
  yPos += 6;
  doc.text("• Supérieur : 4 à 6 membres", 25, yPos);
  yPos += 8;
  
  // Note sur les équipes avec filles
  doc.setFontStyle("italic");
  doc.text("NB : Les équipes composées de filles sont très encouragées.", 15, yPos);
  doc.setFontStyle("normal");
  
  yPos += 15;
  
  // Tableau des membres
  if (team.members && team.members.length > 0) {
    const tableHeaders = [
      ["Nom & Prénoms*", "Sexe*", "Date de naissance*", "Classe / Niveau*", "Établissement*", "Ville*", "Commune*", "Téléphone", "Email"]
    ];
    
    const tableRows = team.members.map(member => [
      member.name,
      member.gender,
      member.birthDate || "-",
      member.level || "-",
      member.school || "-",
      member.city || "-",
      member.commune || "-",
      member.phone || "-",
      member.email || "-"
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: tableHeaders,
      body: tableRows,
      headStyles: { 
        fillColor: [0, 51, 102], 
        textColor: [255, 255, 255],
        fontSize: 8
      },
      bodyStyles: {
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 30 }, // Nom & Prénoms
        1: { cellWidth: 10 }, // Sexe
        2: { cellWidth: 20 }, // Date de naissance
        3: { cellWidth: 20 }, // Classe / Niveau
        4: { cellWidth: 30 }, // Établissement
        5: { cellWidth: 15 }, // Ville
        6: { cellWidth: 15 }, // Commune
        7: { cellWidth: 20 }, // Téléphone
        8: { cellWidth: 30 }  // Email
      },
      alternateRowStyles: { fillColor: [240, 240, 245] }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 20;
  } else {
    yPos += 10;
  }
  
  // Si on dépasse une page, passer à la page suivante
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  // Partie 3: Compétences & Outils
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.setFillColor(240, 240, 245);
  doc.rect(15, yPos - 5, 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("🛠️", 17, yPos);
  doc.setTextColor(0, 51, 102);
  doc.text("Compétences & Outils maîtrisés dans l'équipe (à cocher)", 30, yPos);
  
  yPos += 15;
  
  // Liste des compétences
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  const skills = [
    { name: "Programmation Arduino", checked: team.skills?.arduino },
    { name: "Capteurs & actionneurs", checked: team.skills?.sensors },
    { name: "Design 3D / Impression 3D", checked: team.skills?.design3d },
    { name: "Électronique de base", checked: team.skills?.basicElectronics },
    { name: "Programmation Python / C++", checked: team.skills?.programming },
    { name: "Conception de robot mobile", checked: team.skills?.robotDesign },
    { name: "Téléguidage / Contrôle Bluetooth", checked: team.skills?.remoteControl },
    { name: "Travail en équipe / Gestion de projet", checked: team.skills?.teamwork },
    { name: "Autre(s) :", checked: team.skills?.other, description: team.skills?.otherDescription }
  ];
  
  let colCount = 0;
  let rowPos = yPos;
  const colWidth = 90;
  
  skills.forEach((skill, index) => {
    const xPos = 15 + (colCount * colWidth);
    
    // Dessiner la checkbox
    doc.setDrawColor(0);
    doc.rect(xPos, rowPos - 4, 4, 4, skill.checked ? "F" : "S");
    
    // Ajouter le nom de la compétence
    doc.text(skill.name, xPos + 7, rowPos);
    
    // Ajouter la description pour "Autre(s)"
    if (skill.name === "Autre(s) :" && skill.description) {
      doc.text(skill.description, xPos + 27, rowPos);
    }
    
    colCount++;
    if (colCount >= 2 || index === skills.length - 1) {
      colCount = 0;
      rowPos += 10;
    }
  });
  
  yPos = rowPos + 10;
  
  // Partie 4: Motivation & Vision
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.setFillColor(240, 240, 245);
  doc.rect(15, yPos - 5, 8, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("💡", 17, yPos);
  doc.setTextColor(0, 51, 102);
  doc.text("Motivation & Vision", 30, yPos);
  
  yPos += 15;
  
  // Question motivation
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Pourquoi souhaitez-vous participer à l'IGC 2025 ? (5 à 8 lignes) * :", 15, yPos);
  
  yPos += 10;
  
  // Réponse motivation (avec retour à la ligne si nécessaire)
  if (team.vision?.motivation) {
    const motivationText = doc.splitTextToSize(team.vision.motivation, 180);
    doc.text(motivationText, 15, yPos);
    yPos += 6 * Math.min(motivationText.length, 8); // Max 8 lignes
  } else {
    yPos += 20; // Espace vide
  }
  
  yPos += 10;
  
  // Question valeurs
  doc.text("En quoi votre équipe incarne les valeurs de l'IGC ? (Créativité, esprit d'équipe, innovation) * :", 15, yPos);
  
  yPos += 10;
  
  // Réponse valeurs (avec retour à la ligne si nécessaire)
  if (team.vision?.values) {
    const valuesText = doc.splitTextToSize(team.vision.values, 180);
    doc.text(valuesText, 15, yPos);
    yPos += 6 * Math.min(valuesText.length, 8); // Max 8 lignes
  } else {
    yPos += 20; // Espace vide
  }
  
  yPos += 10;
  
  // Niveau de connaissances en robotique
  doc.text("Niveau de connaissances en robotique de l'équipe * :", 15, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(team.vision?.roboticsLevel || "-", 120, yPos);
  doc.setFont("helvetica", "normal");
  
  yPos += 10;
  
  // Espace de travail
  doc.text("L'équipe dispose-t-elle d'un espace de travail ? * :", 15, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(team.vision?.hasWorkspace ? "Oui" : "Non", 120, yPos);
  doc.setFont("helvetica", "normal");
  
  // Ajouter un pied de page sur toutes les pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Ivorian Genius Contest ${settings.applicationYear} - Fiche d'identification de l'équipe ${team.generalInfo.name}`,
      105, 
      doc.internal.pageSize.height - 10, 
      { align: 'center' }
    );
    
    // Numéro de page
    doc.text(
      `Page ${i} / ${pageCount}`,
      doc.internal.pageSize.width - 20, 
      doc.internal.pageSize.height - 10
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
