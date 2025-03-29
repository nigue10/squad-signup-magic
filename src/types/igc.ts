
export type TeamCategory = 'Secondaire' | 'Supérieur';
export type Gender = 'M' | 'F';
export type RoboticsLevel = 'Débutant' | 'Intermédiaire' | 'Avancé';
export type TeamStatus = 
  | 'Inscrit' 
  | 'QCM soumis' 
  | 'Éliminé QCM' 
  | 'Qualifié pour entretien' 
  | 'Entretien réalisé'
  | 'Sélectionné'
  | 'Non retenu';
export type TeamDecision = 'Sélectionné' | 'Non retenu' | '';

export interface TeamMember {
  id: string;
  name: string;
  gender: Gender;
  birthDate: string;
  level: string;
  school: string;
  city: string;
  commune: string;
  phone?: string;
  email?: string;
}

export interface TeamSkills {
  arduino: boolean;
  sensors: boolean;
  design3d: boolean;
  basicElectronics: boolean;
  programming: boolean;
  robotDesign: boolean;
  remoteControl: boolean;
  teamwork: boolean;
  other: boolean;
  otherDescription?: string;
}

export interface TeamVision {
  motivation: string;
  values: string;
  roboticsLevel: RoboticsLevel;
  hasWorkspace: boolean;
}

export interface TeamGeneralInfo {
  date: string;
  name: string;
  category: TeamCategory;
  city: string;
  commune: string;
  institution: string;
  pedagogicalReferentName?: string;
  pedagogicalReferentPhone?: string;
  pedagogicalReferentEmail?: string;
  teamLeaderName: string;
}

export interface TeamRegistration {
  id?: string;
  generalInfo: TeamGeneralInfo;
  members: TeamMember[];
  skills: TeamSkills;
  vision: TeamVision;
  createdAt?: string;
  
  // Champs additionnels pour le processus de sélection
  status?: TeamStatus;
  qcmScore?: number;
  qcmQualified?: boolean;
  interviewDate?: string;
  interviewTime?: string;
  interviewLink?: string;
  interviewScore?: number;
  interviewNotes?: string;
  interviewRank?: number;
  decision?: TeamDecision;
  comments?: string;
}
