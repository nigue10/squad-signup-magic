import { supabase } from "@/integrations/supabase/client";
import { TeamRegistration, TeamStatus, TeamDecision } from "@/types/igc";
import { v4 as uuidv4 } from 'uuid';
import type { Json } from '@/integrations/supabase/types';

// Fonction pour convertir le format TeamRegistration vers le format de la table Supabase
const convertToSupabaseFormat = (registration: TeamRegistration) => {
  return {
    name: registration.generalInfo.name,
    category: registration.generalInfo.category,
    city: registration.generalInfo.city,
    commune: registration.generalInfo.commune,
    institution: registration.generalInfo.institution,
    pedagogical_referent: registration.generalInfo.pedagogicalReferentName || registration.generalInfo.pedagogicalReferentEmail || registration.generalInfo.pedagogicalReferentPhone 
      ? {
          name: registration.generalInfo.pedagogicalReferentName,
          email: registration.generalInfo.pedagogicalReferentEmail,
          phone: registration.generalInfo.pedagogicalReferentPhone
        } as Json
      : null,
    team_leader: registration.generalInfo.teamLeaderName,
    members: registration.members as unknown as Json,
    skills: registration.skills as unknown as Json,
    vision: registration.vision as unknown as Json,
    status: registration.status || 'Inscrit',
    qcm_score: registration.qcmScore,
    qcm_qualified: registration.qcmQualified,
    interview_date: registration.interviewDate,
    interview_time: registration.interviewTime,
    interview_link: registration.interviewLink,
    interview_score: registration.interviewScore,
    interview_notes: registration.interviewNotes,
    interview_rank: registration.interviewRank,
    decision: registration.decision || '',
    comments: registration.comments
  };
};

// Fonction pour convertir le format Supabase vers le format TeamRegistration
const convertFromSupabaseFormat = (team: any): TeamRegistration => {
  return {
    id: team.id,
    generalInfo: {
      date: team.created_at ? new Date(team.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      name: team.name,
      category: team.category as TeamRegistration['generalInfo']['category'],
      city: team.city || '',
      commune: team.commune || '',
      institution: team.institution,
      pedagogicalReferentName: team.pedagogical_referent?.name || '',
      pedagogicalReferentPhone: team.pedagogical_referent?.phone || '',
      pedagogicalReferentEmail: team.pedagogical_referent?.email || '',
      teamLeaderName: team.team_leader
    },
    members: team.members || [],
    skills: team.skills || {
      arduino: false,
      sensors: false,
      design3d: false,
      basicElectronics: false,
      programming: false,
      robotDesign: false,
      remoteControl: false,
      teamwork: false,
      other: false
    },
    vision: team.vision || {
      motivation: '',
      values: '',
      roboticsLevel: 'Débutant',
      hasWorkspace: false
    },
    createdAt: team.created_at,
    status: team.status as TeamStatus,
    qcmScore: team.qcm_score,
    qcmQualified: team.qcm_qualified,
    interviewDate: team.interview_date,
    interviewTime: team.interview_time,
    interviewLink: team.interview_link,
    interviewScore: team.interview_score,
    interviewNotes: team.interview_notes,
    interviewRank: team.interview_rank,
    decision: team.decision as TeamDecision,
    comments: team.comments
  };
};

// Fonction pour obtenir toutes les inscriptions
export const getAllRegistrations = async (): Promise<TeamRegistration[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data ? data.map(convertFromSupabaseFormat) : [];
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
export const saveRegistration = async (registration: TeamRegistration): Promise<string> => {
  try {
    // Validation des données
    const validationErrors = validateRegistration(registration);
    if (validationErrors.length > 0) {
      console.error("Erreurs de validation:", validationErrors);
      throw new Error(`Validation échouée: ${validationErrors.join(', ')}`);
    }
    
    // Conversion au format Supabase
    const teamData = convertToSupabaseFormat(registration);
    
    // Insertion dans Supabase
    const { data, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select('id')
      .single();
    
    if (error) throw error;
    
    console.log("Nouvelle inscription sauvegardée avec l'ID:", data.id);
    return data.id;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'inscription:", error);
    throw new Error("Impossible de sauvegarder l'inscription");
  }
};

// Mettre à jour une inscription existante avec validation
export const updateRegistration = async (id: string, updatedData: Partial<TeamRegistration>): Promise<void> => {
  try {
    // Récupérer l'inscription existante
    const { data: existingTeam, error: fetchError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    if (!existingTeam) throw new Error(`Inscription ${id} non trouvée`);
    
    // Convertir en format TeamRegistration
    const existingRegistration = convertFromSupabaseFormat(existingTeam);
    
    // Fusionner avec les mises à jour
    const mergedRegistration = {
      ...existingRegistration,
      ...updatedData,
      generalInfo: {
        ...existingRegistration.generalInfo,
        ...(updatedData.generalInfo || {})
      }
    };
    
    // Validation si nécessaire
    if (updatedData.generalInfo) {
      const validationErrors = validateRegistration(mergedRegistration);
      if (validationErrors.length > 0) {
        console.error("Erreurs de validation lors de la mise à jour:", validationErrors);
        throw new Error(`Validation échouée: ${validationErrors.join(', ')}`);
      }
    }
    
    // Validation du statut selon les règles d'étapes
    if (updatedData.status) {
      validateStatusTransition(
        existingRegistration.status as TeamStatus, 
        updatedData.status as TeamStatus, 
        existingRegistration
      );
    }
    
    // Validation des scores
    if (updatedData.qcmScore !== undefined && (updatedData.qcmScore < 0 || updatedData.qcmScore > 100)) {
      throw new Error("Le score QCM doit être entre 0 et 100");
    }
    
    if (updatedData.interviewScore !== undefined && (updatedData.interviewScore < 0 || updatedData.interviewScore > 10)) {
      throw new Error("Le score d'entretien doit être entre 0 et 10");
    }
    
    // Convertir en format Supabase pour la mise à jour
    const updateData: any = {};
    
    // Mise à jour du statut
    if (updatedData.status) {
      updateData.status = updatedData.status;
    }
    
    // Mise à jour des scores et autres champs simples
    if (updatedData.qcmScore !== undefined) updateData.qcm_score = updatedData.qcmScore;
    if (updatedData.qcmQualified !== undefined) updateData.qcm_qualified = updatedData.qcmQualified;
    if (updatedData.interviewDate !== undefined) updateData.interview_date = updatedData.interviewDate;
    if (updatedData.interviewTime !== undefined) updateData.interview_time = updatedData.interviewTime;
    if (updatedData.interviewLink !== undefined) updateData.interview_link = updatedData.interviewLink;
    if (updatedData.interviewScore !== undefined) updateData.interview_score = updatedData.interviewScore;
    if (updatedData.interviewNotes !== undefined) updateData.interview_notes = updatedData.interviewNotes;
    if (updatedData.interviewRank !== undefined) updateData.interview_rank = updatedData.interviewRank;
    if (updatedData.decision !== undefined) updateData.decision = updatedData.decision;
    if (updatedData.comments !== undefined) updateData.comments = updatedData.comments;
    
    // Mise à jour des informations générales si nécessaire
    if (updatedData.generalInfo) {
      if (updatedData.generalInfo.name) updateData.name = updatedData.generalInfo.name;
      if (updatedData.generalInfo.category) updateData.category = updatedData.generalInfo.category;
      if (updatedData.generalInfo.city) updateData.city = updatedData.generalInfo.city;
      if (updatedData.generalInfo.commune) updateData.commune = updatedData.generalInfo.commune;
      if (updatedData.generalInfo.institution) updateData.institution = updatedData.generalInfo.institution;
      
      // Mise à jour du référent pédagogique
      if (updatedData.generalInfo.pedagogicalReferentName || 
          updatedData.generalInfo.pedagogicalReferentEmail || 
          updatedData.generalInfo.pedagogicalReferentPhone) {
        
        updateData.pedagogical_referent = {
          name: updatedData.generalInfo.pedagogicalReferentName || existingRegistration.generalInfo.pedagogicalReferentName,
          email: updatedData.generalInfo.pedagogicalReferentEmail || existingRegistration.generalInfo.pedagogicalReferentEmail,
          phone: updatedData.generalInfo.pedagogicalReferentPhone || existingRegistration.generalInfo.pedagogicalReferentPhone
        };
      }
      
      if (updatedData.generalInfo.teamLeaderName) updateData.team_leader = updatedData.generalInfo.teamLeaderName;
    }
    
    // Mise à jour des membres, compétences et vision si nécessaire
    if (updatedData.members) updateData.members = updatedData.members;
    if (updatedData.skills) updateData.skills = updatedData.skills;
    if (updatedData.vision) updateData.vision = updatedData.vision;
    
    // Effectuer la mise à jour
    const { error: updateError } = await supabase
      .from('teams')
      .update(updateData)
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    console.log(`Inscription ${id} mise à jour avec succès`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'inscription:", error);
    throw new Error("Impossible de mettre à jour l'inscription: " + (error instanceof Error ? error.message : 'Erreur inconnue'));
  }
};

// Fonction pour valider la transition d'un statut à un autre
const validateStatusTransition = (
  currentStatus: TeamStatus | undefined, 
  newStatus: TeamStatus,
  registration: TeamRegistration
): void => {
  // Définir l'ordre des statuts
  const statusOrder: TeamStatus[] = [
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
export const deleteRegistration = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    console.log(`Inscription ${id} supprimée avec succès`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'inscription:", error);
    throw new Error("Impossible de supprimer l'inscription");
  }
};

// Fonction pour obtenir une inscription spécifique par ID
export const getRegistrationById = async (id: string): Promise<TeamRegistration | null> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? convertFromSupabaseFormat(data) : null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'inscription:", error);
    return null;
  }
};

// Exporter toutes les inscriptions au format CSV
export const exportAllRegistrationsToCSV = async (): Promise<string> => {
  const registrations = await getAllRegistrations();
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
