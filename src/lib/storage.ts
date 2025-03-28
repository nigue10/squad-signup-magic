
import { TeamRegistration } from "@/types/igc";

// Simule un backend en stockant les données dans le localStorage
export const saveRegistration = (registration: TeamRegistration): string => {
  try {
    // Génération d'un ID unique
    const id = `team_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Ajout de l'ID et de la date de création
    const registrationWithMeta: TeamRegistration = {
      ...registration,
      id,
      createdAt: new Date().toISOString(),
    };
    
    // Récupération des inscriptions existantes
    const existingData = localStorage.getItem('igc_registrations');
    const registrations: TeamRegistration[] = existingData 
      ? JSON.parse(existingData) 
      : [];
    
    // Ajout de la nouvelle inscription
    registrations.push(registrationWithMeta);
    
    // Sauvegarde dans le localStorage
    localStorage.setItem('igc_registrations', JSON.stringify(registrations));
    
    return id;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    throw new Error("Erreur lors de l'enregistrement de l'équipe");
  }
};

// Récupère toutes les inscriptions
export const getAllRegistrations = (): TeamRegistration[] => {
  try {
    const data = localStorage.getItem('igc_registrations');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des inscriptions:", error);
    return [];
  }
};

// Récupère une inscription par ID
export const getRegistrationById = (id: string): TeamRegistration | null => {
  try {
    const registrations = getAllRegistrations();
    return registrations.find(reg => reg.id === id) || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'inscription:", error);
    return null;
  }
};
