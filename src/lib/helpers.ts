
import { TeamMember } from "@/types/igc";

// Génère un ID unique pour les membres de l'équipe
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Crée un nouveau membre d'équipe vide
export const createEmptyMember = (): TeamMember => {
  return {
    id: generateId(),
    name: "",
    gender: "M",
    birthDate: "",
    level: "",
    school: "",
    city: "",
    commune: "",
    phone: "",
    email: "",
  };
};

// Format de date française
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

// Vérifie si un email est valide
export const isValidEmail = (email: string): boolean => {
  if (!email) return true; // Les emails peuvent être optionnels
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Vérifie si un numéro de téléphone est valide (format international ou local)
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Les téléphones peuvent être optionnels
  const phoneRegex = /^(\+\d{1,3}[\s-]?)?\d{8,12}$/;
  return phoneRegex.test(phone);
};

// Télécharge les données au format CSV
export const downloadCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return;
  
  // Obtenir les en-têtes (toutes les clés du premier objet)
  const headers = Object.keys(data[0]);
  
  // Créer la ligne d'en-tête
  let csv = headers.join(',') + '\n';
  
  // Ajouter les lignes de données
  data.forEach((item) => {
    const row = headers.map(header => {
      // Entourer les valeurs contenant des virgules de guillemets
      const value = item[header] === null || item[header] === undefined ? '' : item[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(',');
    csv += row + '\n';
  });
  
  // Créer un blob et le télécharger
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
