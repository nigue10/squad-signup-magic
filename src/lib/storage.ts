
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

// Fonction pour valider les données avant sauvegarde
const validateRegistration = (registration: TeamRegistration): string[] => {
  const errors: string[] = [];
  
  // Vérification du nom d'équipe (pas de caractères spéciaux)
  if (!/^[a-zA-Z0-9\s\-_àáâäãåąćęèéêëìíîïłńòóôöõøùúûüÿýżźñçšžÀÁÂÄÃÅĄĆĘÈÉÊËÌÍÎÏŁŃÒÓÔÖÕØÙÚÛÜŸÝŻŹÑßÇŠŽ.']+$/.test(registration.generalInfo.name)) {
    errors.push("Le nom d'équipe contient des caractères non autorisés");
  }
  
  // Vérification des emails
  if (registration.generalInfo.pedagogicalReferentEmail && 
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(registration.generalInfo.pedagogicalReferentEmail)) {
    errors.push("Le format de l'email du référent pédagogique est invalide");
  }
  
  // Vérification des numéros de téléphone (format international)
  if (registration.generalInfo.pedagogicalReferentPhone && 
      !/^\+?[0-9\s]{8,15}$/.test(registration.generalInfo.pedagogicalReferentPhone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push("Le format du numéro de téléphone du référent pédagogique est invalide");
  }
  
  // Vérification de la catégorie
  if (!['Secondaire', 'Supérieur'].includes(registration.generalInfo.category)) {
    errors.push("La catégorie doit être 'Secondaire' ou 'Supérieur'");
  }
  
  return errors;
};

// Fonction pour sauvegarder une nouvelle inscription
export const saveRegistration = (registration: TeamRegistration): string => {
  initializeStorage();
  try {
    // Validation des données
    const validationErrors = validateRegistration(registration);
    if (validationErrors.length > 0) {
      console.error("Erreurs de validation:", validationErrors);
      throw new Error(`Validation échouée: ${validationErrors.join(', ')}`);
    }
    
    const registrations = getAllRegistrations();
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    
    // Statut initial
    const newRegistration = { 
      ...registration, 
      id, 
      createdAt,
      status: 'Inscrit' // Statut initial défini à "Inscrit"
    };
    
    registrations.push(newRegistration);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    console.log("Nouvelle inscription sauvegardée avec l'ID:", id);
    return id;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'inscription:", error);
    throw new Error("Impossible de sauvegarder l'inscription");
  }
};

// Mettre à jour une inscription existante avec validation
export const updateRegistration = (id: string, updatedData: Partial<TeamRegistration>): void => {
  try {
    const registrations = getAllRegistrations();
    const index = registrations.findIndex(registration => registration.id === id);
    
    if (index !== -1) {
      // Validation des modifications si nécessaire
      if (updatedData.generalInfo && (
          updatedData.generalInfo.name || 
          updatedData.generalInfo.pedagogicalReferentEmail || 
          updatedData.generalInfo.pedagogicalReferentPhone ||
          updatedData.generalInfo.category
      )) {
        const mergedRegistration = {
          ...registrations[index],
          ...updatedData,
          generalInfo: {
            ...registrations[index].generalInfo,
            ...(updatedData.generalInfo || {})
          }
        };
        
        const validationErrors = validateRegistration(mergedRegistration);
        if (validationErrors.length > 0) {
          console.error("Erreurs de validation lors de la mise à jour:", validationErrors);
          throw new Error(`Validation échouée: ${validationErrors.join(', ')}`);
        }
      }
      
      // Validation du statut selon les règles d'étapes
      if (updatedData.status) {
        validateStatusTransition(registrations[index].status, updatedData.status, registrations[index]);
      }
      
      // Validation des scores
      if (updatedData.qcmScore !== undefined && (updatedData.qcmScore < 0 || updatedData.qcmScore > 100)) {
        throw new Error("Le score QCM doit être entre 0 et 100");
      }
      
      if (updatedData.interviewScore !== undefined && (updatedData.interviewScore < 0 || updatedData.interviewScore > 10)) {
        throw new Error("Le score d'entretien doit être entre 0 et 10");
      }
      
      // Merge les données existantes avec les mises à jour
      registrations[index] = { 
        ...registrations[index], 
        ...updatedData,
        generalInfo: {
          ...registrations[index].generalInfo,
          ...(updatedData.generalInfo || {})
        }
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
      console.log(`Inscription ${id} mise à jour avec succès`);
    } else {
      console.error(`Inscription ${id} non trouvée`);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'inscription:", error);
    throw new Error("Impossible de mettre à jour l'inscription: " + (error instanceof Error ? error.message : 'Erreur inconnue'));
  }
};

// Fonction pour valider la transition d'un statut à un autre
const validateStatusTransition = (
  currentStatus: string | undefined, 
  newStatus: string,
  registration: TeamRegistration
): void => {
  // Définir l'ordre des statuts
  const statusOrder = [
    'Inscrit',
    'QCM soumis',
    'Éliminé QCM',
    'Qualifié pour entretien',
    'Entretien réalisé',
    'Sélectionné',
    'Non retenu'
  ];
  
  // Si le statut actuel n'est pas défini, n'importe quel statut est accepté
  if (!currentStatus) return;
  
  // Vérifier que le nouveau statut est valide
  if (!statusOrder.includes(newStatus)) {
    throw new Error(`Statut invalide: ${newStatus}`);
  }
  
  // Vérifier les conditions pour passer à "Qualifié pour entretien"
  if (newStatus === 'Qualifié pour entretien') {
    // Un score QCM est requis
    if (registration.qcmScore === undefined) {
      throw new Error("Un score QCM est requis pour qualifier une équipe pour l'entretien");
    }
    
    // Vérifier les seuils QCM
    const threshold = registration.generalInfo.category === 'Secondaire' ? 60 : 70;
    if (registration.qcmScore < threshold) {
      throw new Error(`Le score QCM (${registration.qcmScore}) est inférieur au seuil requis (${threshold})`);
    }
  }
  
  // Vérifier les conditions pour passer à "Entretien réalisé"
  if (newStatus === 'Entretien réalisé' && registration.interviewScore === undefined) {
    throw new Error("Un score d'entretien est requis pour marquer l'entretien comme réalisé");
  }
  
  // Le statut final ne peut être que "Sélectionné" ou "Non retenu"
  if (currentStatus === 'Sélectionné' || currentStatus === 'Non retenu') {
    throw new Error(`Impossible de changer le statut ${currentStatus}`);
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
