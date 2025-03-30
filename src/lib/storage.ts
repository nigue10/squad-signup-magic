
import { TeamRegistration } from "@/types/igc";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = "igc_registrations";

// Fonction pour initialiser le localStorage avec un tableau vide si nécessaire
const initializeStorage = () => {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }
};

// Fonction pour récupérer toutes les inscriptions
export const getAllRegistrations = (): TeamRegistration[] => {
  initializeStorage();
  try {
    const storedRegistrations = localStorage.getItem(STORAGE_KEY);
    return storedRegistrations ? JSON.parse(storedRegistrations) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des inscriptions:", error);
    return [];
  }
};

// Fonction pour sauvegarder une nouvelle inscription
export const saveRegistration = (registration: TeamRegistration): string => {
  initializeStorage();
  try {
    const registrations = getAllRegistrations();
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const newRegistration = { ...registration, id, createdAt };
    registrations.push(newRegistration);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    console.log("Nouvelle inscription sauvegardée avec l'ID:", id);
    return id;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'inscription:", error);
    throw new Error("Impossible de sauvegarder l'inscription");
  }
};

// Mettre à jour une inscription existante
export const updateRegistration = (id: string, updatedData: Partial<TeamRegistration>): void => {
  try {
    const registrations = getAllRegistrations();
    const index = registrations.findIndex(registration => registration.id === id);
    
    if (index !== -1) {
      // Merge les données existantes avec les mises à jour
      registrations[index] = { 
        ...registrations[index], 
        ...updatedData 
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
      console.log(`Inscription ${id} mise à jour avec succès`);
    } else {
      console.error(`Inscription ${id} non trouvée`);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'inscription:", error);
    throw new Error("Impossible de mettre à jour l'inscription");
  }
};

// Fonction pour supprimer une inscription
export const deleteRegistration = (id: string): void => {
  initializeStorage();
  try {
    const registrations = getAllRegistrations();
    const updatedRegistrations = registrations.filter(registration => registration.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRegistrations));
    console.log(`Inscription ${id} supprimée avec succès`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'inscription:", error);
    throw new Error("Impossible de supprimer l'inscription");
  }
};

// Fonction pour obtenir une inscription spécifique par ID
export const getRegistrationById = (id: string): TeamRegistration | null => {
  try {
    const registrations = getAllRegistrations();
    const registration = registrations.find(reg => reg.id === id);
    return registration || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'inscription:", error);
    return null;
  }
};

// Exporter toutes les inscriptions au format CSV
export const exportAllRegistrationsToCSV = (): string => {
  const registrations = getAllRegistrations();
  if (registrations.length === 0) {
    return "";
  }

  // Créer les en-têtes
  let headers = [
    "Nom de l'équipe", 
    "Catégorie", 
    "Institution", 
    "Ville", 
    "Email contact", 
    "Téléphone contact",
    "Statut",
    "Score QCM",
    "Qualification QCM",
    "Date d'entretien",
    "Heure d'entretien",
    "Score entretien",
    "Classement",
    "Décision",
    "Commentaires"
  ];

  // Créer les lignes
  let csvRows = [headers.join(',')];

  // Ajouter les données pour chaque équipe
  for (const team of registrations) {
    const row = [
      escapeCsvValue(team.generalInfo.name),
      escapeCsvValue(team.generalInfo.category),
      escapeCsvValue(team.generalInfo.institution),
      escapeCsvValue(team.generalInfo.city),
      escapeCsvValue(team.generalInfo.pedagogicalReferentEmail || ''),
      escapeCsvValue(team.generalInfo.pedagogicalReferentPhone || ''),
      escapeCsvValue(team.status || ''),
      team.qcmScore !== undefined ? team.qcmScore : '',
      team.qcmQualified !== undefined ? (team.qcmQualified ? 'Oui' : 'Non') : '',
      escapeCsvValue(team.interviewDate || ''),
      escapeCsvValue(team.interviewTime || ''),
      team.interviewScore !== undefined ? team.interviewScore : '',
      team.interviewRank !== undefined ? team.interviewRank : '',
      escapeCsvValue(team.decision || ''),
      escapeCsvValue(team.comments || '')
    ];
    
    csvRows.push(row.join(','));
  }

  return csvRows.join('\n');
};

// Fonction utilitaire pour échapper les valeurs CSV
const escapeCsvValue = (value: string): string => {
  if (!value) return '';
  // Si la valeur contient des virgules, des guillemets ou des sauts de ligne, la mettre entre guillemets
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    // Échapper les guillemets en les doublant
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};
