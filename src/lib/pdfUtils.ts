
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
    const leftLogoWidth = 25;
    const rightLogoWidth = 35;
    
    // Logo gauche (robot IGC)
    doc.addImage("/lovable-uploads/f2bba9e8-108e-4607-9b68-2192cbc4963a.png", "PNG", 15, 10, leftLogoWidth, leftLogoWidth);
    
    // Logo droit (texte IGC)
    doc.addImage("/lovable-uploads/034e2fe6-1491-4af1-a834-7b32d6879658.png", "PNG", doc.internal.pageSize.width - rightLogoWidth - 15, 10, rightLogoWidth, 17);
  } catch (error) {
    console.error("Erreur lors de l'ajout des logos:", error);
  }
};

export const addHeader = (doc: any, settings: any) => {
  // Add a title
  doc.setFontSize(14);
  doc.setTextColor(120, 120, 120);
  doc.text("Ivorian Genius Contest " + settings.applicationYear, 105, 20, { align: 'center' });
  
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(27, 20, 100); // Couleur IGC Navy
  doc.text("FICHE D'ÉQUIPE - IGC " + settings.applicationYear, 105, 35, { align: 'center' });
  doc.setFont("helvetica", "normal");
};

export const addPdfFooter = (doc: any, team: TeamRegistration, settings: any) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Ivorian Genius Contest ${settings.applicationYear} - Fiche d'équipe ${team.generalInfo.name}`,
      105, 
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
