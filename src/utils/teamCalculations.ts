
import { TeamRegistration, TeamCategory, TeamDecision } from '@/types/igc';

// Calculate if a team qualifies based on QCM score and category
export const calculateQcmQualification = (category: TeamCategory, score: number): boolean => {
  if (category === 'Secondaire') {
    return score >= 60;
  } else if (category === 'Supérieur') {
    return score >= 70;
  }
  return false;
};

// Calculate points for an individual team based on various factors
export const calculatePoints = (team: TeamRegistration): number => {
  let points = 0;
  
  // Points from QCM score (if available)
  if (team.qcmScore) {
    points += team.qcmScore;
  }
  
  // Points from interview score (if available, scaled to match QCM scale)
  if (team.interviewScore !== undefined && team.interviewScore !== null) {
    // Interview score is on scale of 0-10, multiply by 10 to match QCM scale
    points += team.interviewScore * 10;
  }
  
  // Bonus points for team composition diversity
  if (team.members) {
    const hasMaleMembers = team.members.some(member => member.gender === 'M');
    const hasFemaleMembers = team.members.some(member => member.gender === 'F');
    
    // Bonus for gender diversity
    if (hasMaleMembers && hasFemaleMembers) {
      points += 5;
    }
  }
  
  // Bonus points for skills diversity
  if (team.skills) {
    let skillCount = 0;
    if (team.skills.arduino) skillCount++;
    if (team.skills.sensors) skillCount++;
    if (team.skills.design3d) skillCount++;
    if (team.skills.basicElectronics) skillCount++;
    if (team.skills.programming) skillCount++;
    if (team.skills.robotDesign) skillCount++;
    if (team.skills.remoteControl) skillCount++;
    if (team.skills.teamwork) skillCount++;
    if (team.skills.other) skillCount++;
    
    // Add bonus points based on skill diversity
    points += skillCount * 2;
  }
  
  return Math.round(points);
};

// Determine team decision based on category and ranking
export const determineTeamDecision = (category: TeamCategory, rank?: number): TeamDecision | undefined => {
  if (rank === undefined) return undefined;
  
  if (category === 'Secondaire') {
    return rank <= 20 ? 'Sélectionné' : 'Non retenu';
  } else if (category === 'Supérieur') {
    return rank <= 10 ? 'Sélectionné' : 'Non retenu';
  }
  
  return undefined;
};

// Update team rankings based on interview scores (by category)
export const updateTeamRankings = (teams: TeamRegistration[], categoryFilter?: TeamCategory): Partial<TeamRegistration>[] => {
  const results: Partial<TeamRegistration>[] = [];
  
  // Process teams by category
  const categories: TeamCategory[] = categoryFilter ? [categoryFilter] : ['Secondaire', 'Supérieur'];
  
  categories.forEach(category => {
    // Get teams of this category with interview scores
    const categoryTeams = teams
      .filter(team => team.generalInfo.category === category && team.interviewScore !== undefined)
      .sort((a, b) => {
        const scoreA = a.interviewScore ?? -1;
        const scoreB = b.interviewScore ?? -1;
        return scoreB - scoreA; // Sort descending
      });
    
    // Assign rankings and decisions
    categoryTeams.forEach((team, index) => {
      const rank = index + 1;
      const decision = determineTeamDecision(category, rank);
      
      results.push({
        id: team.id,
        interviewRank: rank,
        decision
      });
    });
  });
  
  return results;
};

// Function to recalculate all teams' data (QCM qualification, rankings, decisions)
export const recalculateAllTeamsData = (teams: TeamRegistration[]): Partial<TeamRegistration>[] => {
  const updates: Partial<TeamRegistration>[] = [];
  
  // First, calculate QCM qualification for all teams
  teams.forEach(team => {
    if (team.qcmScore !== undefined) {
      const qcmQualified = calculateQcmQualification(team.generalInfo.category, team.qcmScore);
      updates.push({
        id: team.id,
        qcmQualified,
        interviewScore: 0, // Reset interview scores to 0
        interviewRank: undefined,
        decision: undefined
      });
    }
  });
  
  // Then update rankings
  const secondaryRankings = updateTeamRankings(teams, 'Secondaire');
  const higherRankings = updateTeamRankings(teams, 'Supérieur');
  
  // Merge ranking updates with existing updates
  [...secondaryRankings, ...higherRankings].forEach(rankingUpdate => {
    const existingUpdateIndex = updates.findIndex(u => u.id === rankingUpdate.id);
    
    if (existingUpdateIndex !== -1) {
      updates[existingUpdateIndex] = {
        ...updates[existingUpdateIndex],
        interviewRank: rankingUpdate.interviewRank,
        decision: rankingUpdate.decision
      };
    } else {
      updates.push(rankingUpdate);
    }
  });
  
  return updates;
};

// Function to sort teams based on various criteria
export const sortTeams = (teams: TeamRegistration[], sortKey: string, sortDirection: 'asc' | 'desc') => {
  return [...teams].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    // Extract values based on key
    switch (sortKey) {
      case 'name':
        valueA = a.generalInfo?.name || '';
        valueB = b.generalInfo?.name || '';
        break;
      case 'category':
        valueA = a.generalInfo?.category || '';
        valueB = b.generalInfo?.category || '';
        break;
      case 'institution':
        valueA = a.generalInfo?.institution || '';
        valueB = b.generalInfo?.institution || '';
        break;
      case 'city':
        valueA = a.generalInfo?.city || '';
        valueB = b.generalInfo?.city || '';
        break;
      case 'email':
        valueA = a.generalInfo?.pedagogicalReferentEmail || '';
        valueB = b.generalInfo?.pedagogicalReferentEmail || '';
        break;
      case 'phone':
        valueA = a.generalInfo?.pedagogicalReferentPhone || '';
        valueB = b.generalInfo?.pedagogicalReferentPhone || '';
        break;
      case 'status':
        valueA = a.status || '';
        valueB = b.status || '';
        break;
      case 'qcmScore':
        valueA = a.qcmScore || 0;
        valueB = b.qcmScore || 0;
        break;
      case 'qcmQualified':
        valueA = a.qcmQualified ? 'Oui' : 'Non';
        valueB = b.qcmQualified ? 'Oui' : 'Non';
        break;
      case 'interviewDate':
        valueA = a.interviewDate || '';
        valueB = b.interviewDate || '';
        break;
      case 'interviewTime':
        valueA = a.interviewTime || '';
        valueB = b.interviewTime || '';
        break;
      case 'interviewLink':
        valueA = a.interviewLink || '';
        valueB = b.interviewLink || '';
        break;
      case 'interviewScore':
        valueA = a.interviewScore || 0;
        valueB = b.interviewScore || 0;
        break;
      case 'interviewNotes':
        valueA = a.interviewNotes || '';
        valueB = b.interviewNotes || '';
        break;
      case 'interviewRank':
        valueA = a.interviewRank || 9999;
        valueB = b.interviewRank || 9999;
        break;
      case 'decision':
        valueA = a.decision || '';
        valueB = b.decision || '';
        break;
      case 'comments':
        valueA = a.comments || '';
        valueB = b.comments || '';
        break;
      default:
        valueA = a[sortKey as keyof TeamRegistration] || '';
        valueB = b[sortKey as keyof TeamRegistration] || '';
    }
    
    // Sort based on type
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    } else {
      return sortDirection === 'asc' 
        ? (valueA as number) - (valueB as number) 
        : (valueB as number) - (valueA as number);
    }
  });
};
