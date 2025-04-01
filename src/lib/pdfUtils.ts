import { TeamRegistration } from '@/types/igc';
import { calculatePoints } from '@/utils/teamCalculations';
import { getSettings } from '@/lib/settings';

// Helper functions for PDF generation

export const createPdfBackground = (doc: any) => {
  // Add a fond with gradient
  doc.setFillColor(230, 230, 245); // Light purple/blue background
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
  // Add a decorative overlay
  doc.setFillColor(27, 20, 100, 0.03); // igc-navy with low opacity
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * doc.internal.pageSize.width;
    const y = Math.random() * doc.internal.pageSize.height;
    const size = 20 + Math.random() * 50;
    doc.circle(x, y, size, 'F');
  }
};

export const addLogos = (doc: any) => {
  try {
    const centerX = doc.internal.pageSize.width / 2;
    const logoWidth = 40;
    
    // Logo IGC centered at top
    doc.addImage("/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png", "PNG", 
                centerX - (logoWidth / 2), 15, logoWidth, logoWidth);
    
    // Add title text below logo
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "italic");
    doc.text("International Genius Challenge 2025 – Compétition de Robotique Éducative", 
             centerX, 65, { align: 'center' });
    doc.setFont("helvetica", "normal");
  } catch (error) {
    console.error("Erreur lors de l'ajout des logos:", error);
  }
};

export const addHeader = (doc: any, settings: any) => {
  // Add a title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 20, 100); // Couleur IGC Navy
  doc.text("FICHE D'IDENTIFICATION DE L'ÉQUIPE – IGC " + settings.applicationYear, 
           doc.internal.pageSize.width / 2, 80, { align: 'center' });
  doc.setFont("helvetica", "normal");
  
  // Add horizontal rule
  doc.setDrawColor(27, 20, 100);
  doc.setLineWidth(0.5);
  doc.line(20, 85, doc.internal.pageSize.width - 20, 85);
};

export const addPdfFooter = (doc: any, team: TeamRegistration, settings: any) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add footer text
    doc.setFontSize(8);
    doc.setTextColor(27, 20, 100); // IGC Navy
    doc.setFont("helvetica", "normal");
    doc.text(
      `© ${settings.applicationYear} IGC – Tous droits réservés`,
      doc.internal.pageSize.width / 2, 
      doc.internal.pageSize.height - 10, 
      { align: 'center' }
    );
    
    // Page number
    doc.text(
      `Page ${i} / ${pageCount}`,
      doc.internal.pageSize.width - 20, 
      doc.internal.pageSize.height - 10
    );
  }
};

export const getTeamPoints = (team: TeamRegistration): number => {
  return calculatePoints(team);
};

export const formatMemberInfo = (doc: any, team: TeamRegistration, startY: number): number => {
  // Set table headers
  const headers = [
    "Nom & Prénoms", "Sexe", "Date de naissance", "Classe/Niveau", 
    "Établissement", "Ville", "Commune", "Téléphone", "Email"
  ];
  
  // Create rows array from team members
  const rows = team.members.map(member => [
    member.name || "-",
    member.gender || "-",
    member.birthDate || "-",
    member.level || "-",
    member.school || "-",
    member.city || "-",
    member.commune || "-",
    member.phone || "-",
    member.email || "-"
  ]);
  
  // If less than 6 members, add empty rows to fill the table
  const maxMembers = team.generalInfo.category === 'Secondaire' ? 6 : 6;
  while (rows.length < maxMembers) {
    rows.push(["-", "-", "-", "-", "-", "-", "-", "-", "-"]);
  }
  
  // Set table styles
  const tableStyles = {
    startY: startY,
    headStyles: {
      fillColor: [27, 20, 100],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [240, 240, 245]
    },
    margin: { left: 15, right: 15 },
    styles: {
      overflow: 'linebreak',
      cellPadding: 2,
      fontSize: 8,
      valign: 'middle'
    },
    theme: 'grid'
  };
  
  // Add the table to the document
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    ...tableStyles
  });
  
  // Return the Y position after the table
  return (doc as any).lastAutoTable.finalY;
};

export const formatSkillsSection = (doc: any, team: TeamRegistration, startY: number): number => {
  // Title
  doc.setFontSize(14);
  doc.setTextColor(27, 20, 100);
  doc.setFont("helvetica", "bold");
  doc.text("🧠 Compétences & Outils maîtrisés dans l'équipe", 20, startY + 10);
  doc.setFont("helvetica", "normal");
  
  // Skills list
  let skillsList = "";
  if (team.skills) {
    const skills = [];
    if (team.skills.arduino) skills.push("Arduino");
    if (team.skills.sensors) skills.push("Capteurs");
    if (team.skills.design3d) skills.push("Conception 3D");
    if (team.skills.basicElectronics) skills.push("Électronique de base");
    if (team.skills.programming) skills.push("Programmation");
    if (team.skills.robotDesign) skills.push("Conception de robots");
    if (team.skills.remoteControl) skills.push("Contrôle à distance");
    if (team.skills.teamwork) skills.push("Travail d'équipe");
    skillsList = skills.join(", ");
  }
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Compétences: ${skillsList || "Aucune compétence spécifiée"}`, 25, startY + 20);
  
  // Other skills
  const otherSkills = team.skills?.otherDescription || "Aucune";
  doc.text(`Autre(s): ${otherSkills}`, 25, startY + 30);
  
  // Return the new Y position
  return startY + 40;
};

export const formatMotivationSection = (doc: any, team: TeamRegistration, startY: number): number => {
  // Title
  doc.setFontSize(14);
  doc.setTextColor(27, 20, 100);
  doc.setFont("helvetica", "bold");
  doc.text("💡 Motivation & Vision", 20, startY + 10);
  doc.setFont("helvetica", "normal");
  
  // Motivation
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Pourquoi souhaitez-vous participer à l'IGC 2025 ?", 25, startY + 20);
  doc.setFont("helvetica", "normal");
  
  // Split motivation text into lines to fit on the page
  const motivation = team.vision?.motivation || "Non spécifiée";
  const splitMotivation = doc.splitTextToSize(motivation, doc.internal.pageSize.width - 50);
  doc.text(splitMotivation, 25, startY + 30);
  
  // Calculate vertical space needed for motivation text
  const motivationHeight = splitMotivation.length * 5;
  
  // Values
  doc.setFont("helvetica", "bold");
  doc.text("En quoi votre équipe incarne les valeurs de l'IGC ?", 25, startY + 35 + motivationHeight);
  doc.setFont("helvetica", "normal");
  
  // Split values text into lines
  const values = team.vision?.values || "Non spécifiée";
  const splitValues = doc.splitTextToSize(values, doc.internal.pageSize.width - 50);
  doc.text(splitValues, 25, startY + 45 + motivationHeight);
  
  // Calculate vertical space for values
  const valuesHeight = splitValues.length * 5;
  
  // Skill level and workspace
  doc.setFont("helvetica", "bold");
  doc.text("Niveau de connaissances en robotique de l'équipe:", 25, startY + 55 + motivationHeight + valuesHeight);
  doc.setFont("helvetica", "normal");
  doc.text(team.vision?.roboticsLevel || "Non spécifié", 25, startY + 65 + motivationHeight + valuesHeight);
  
  doc.setFont("helvetica", "bold");
  doc.text("L'équipe dispose-t-elle d'un espace de travail ?", 25, startY + 75 + motivationHeight + valuesHeight);
  doc.setFont("helvetica", "normal");
  doc.text(team.vision?.hasWorkspace ? "Oui" : "Non", 25, startY + 85 + motivationHeight + valuesHeight);
  
  // Return the new Y position
  return startY + 95 + motivationHeight + valuesHeight;
};

export const formatGeneralInfo = (doc: any, team: TeamRegistration, startY: number): number => {
  // Title
  doc.setFontSize(14);
  doc.setTextColor(27, 20, 100);
  doc.setFont("helvetica", "bold");
  doc.text("📌 Informations Générales sur l'Équipe", 20, startY + 10);
  
  // Create two columns for general info
  const col1X = 25;
  const col2X = doc.internal.pageSize.width / 2 + 10;
  let rowY = startY + 20;
  
  // Helper function to add a field with label and value
  const addField = (label: string, value: string | undefined, x: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`${label}:`, x, rowY);
    doc.setFont("helvetica", "normal");
    doc.text(value || "-", x + 60, rowY);
  };
  
  // First row
  addField("Date", team.generalInfo.date || new Date().toISOString().split('T')[0], col1X);
  addField("Catégorie", team.generalInfo.category, col2X);
  rowY += 10;
  
  // Second row
  addField("Nom de l'équipe", team.generalInfo.name, col1X);
  addField("Ville", team.generalInfo.city, col2X);
  rowY += 10;
  
  // Third row
  addField("Commune", team.generalInfo.commune || "-", col1X);
  addField("Établissement", team.generalInfo.institution, col2X);
  rowY += 10;
  
  // Fourth row - Referent info
  addField("Référent pédagogique", team.generalInfo.pedagogicalReferentName || "-", col1X);
  addField("Téléphone référent", team.generalInfo.pedagogicalReferentPhone || "-", col2X);
  rowY += 10;
  
  // Fifth row
  addField("Email référent", team.generalInfo.pedagogicalReferentEmail || "-", col1X);
  addField("Chef d'équipe", team.generalInfo.teamLeaderName || "-", col2X);
  rowY += 10;
  
  // Horizontal rule
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, rowY + 5, doc.internal.pageSize.width - 20, rowY + 5);
  
  // Return the new Y position
  return rowY + 10;
};
