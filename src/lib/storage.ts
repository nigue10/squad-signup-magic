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
