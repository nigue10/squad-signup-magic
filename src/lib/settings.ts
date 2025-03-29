
// Paramètres éditables pour l'application IGC
// Ces paramètres peuvent être modifiés par l'administrateur

// Type des paramètres de l'application
export interface IGCSettings {
  // Contact et informations générales
  contactEmail: string;
  applicationYear: string;
  
  // Quotas de sélection
  secondaryTeamSelectionCount: number;
  higherTeamSelectionCount: number;
  
  // Seuils de qualification QCM
  secondaryQcmThreshold: number;
  higherQcmThreshold: number;
  
  // Descriptions et textes spécifiques
  welcomeMessage: string;
  registrationInfo: string;
  
  // Dates importantes
  registrationDeadline: string;
  qcmStartDate: string;
  interviewPeriod: string;
  resultsDate: string;
}

// Paramètres par défaut
const defaultSettings: IGCSettings = {
  contactEmail: "igc2025@example.com",
  applicationYear: "2025",
  
  secondaryTeamSelectionCount: 16,
  higherTeamSelectionCount: 16,
  
  secondaryQcmThreshold: 60,
  higherQcmThreshold: 70,
  
  welcomeMessage: "Bienvenue sur la plateforme d'inscription de l'IGC, le plus grand concours de robotique et d'innovation de Côte d'Ivoire.",
  registrationInfo: "Cette année, l'IGC accueille deux catégories: Secondaire et Supérieur. Les équipes du secondaire doivent compter 6 membres, tandis que les équipes du supérieur peuvent participer avec un minimum de 4 membres.",
  
  registrationDeadline: "30 octobre 2024",
  qcmStartDate: "5 novembre 2024",
  interviewPeriod: "15-25 novembre 2024",
  resultsDate: "30 novembre 2024"
};

// Clé de stockage dans le localStorage
const SETTINGS_STORAGE_KEY = "igc_admin_settings";

// Fonction pour obtenir les paramètres actuels
export const getSettings = (): IGCSettings => {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!storedSettings) {
      // Si aucun paramètre n'est enregistré, utiliser les paramètres par défaut
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    
    return JSON.parse(storedSettings) as IGCSettings;
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
    return defaultSettings;
  }
};

// Fonction pour mettre à jour tous les paramètres
export const updateSettings = (newSettings: IGCSettings): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    console.log("Paramètres mis à jour avec succès");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
  }
};

// Fonction pour mettre à jour un paramètre spécifique
export const updateSetting = <K extends keyof IGCSettings>(key: K, value: IGCSettings[K]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, [key]: value };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    console.log(`Paramètre ${key} mis à jour avec succès`);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du paramètre ${key}:`, error);
  }
};

// Fonction pour réinitialiser les paramètres aux valeurs par défaut
export const resetSettings = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
    console.log("Paramètres réinitialisés aux valeurs par défaut");
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des paramètres:", error);
  }
};
