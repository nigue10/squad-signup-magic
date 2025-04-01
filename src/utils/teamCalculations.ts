
import { TeamRegistration } from '@/types/igc';

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

// Function to sort teams based on various criteria
export const sortTeams = (teams: TeamRegistration[], sortKey: string, sortDirection: 'asc' | 'desc') => {
  return [...teams].sort((a, b) => {
    // Handle nested properties
    if (sortKey === 'name') {
      const valueA = a.generalInfo?.name || '';
      const valueB = b.generalInfo?.name || '';
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    if (sortKey === 'institution') {
      const valueA = a.generalInfo?.institution || '';
      const valueB = b.generalInfo?.institution || '';
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    if (sortKey === 'category') {
      const valueA = a.generalInfo?.category || '';
      const valueB = b.generalInfo?.category || '';
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Handle numeric values
    if (sortKey === 'qcmScore') {
      const valueA = a.qcmScore || 0;
      const valueB = b.qcmScore || 0;
      return sortDirection === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    }
    
    // Handle status
    if (sortKey === 'status') {
      const valueA = a.status || '';
      const valueB = b.status || '';
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return 0;
  });
};
