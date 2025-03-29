
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
  
  // Convertir les en-têtes en français et améliorer la présentation
  const headerLabels = headers.map(header => {
    const label = header
      .replace(/_/g, ' ')        // Remplace les underscores par des espaces
      .replace(/\b\w/g, l => l.toUpperCase());  // Met la première lettre de chaque mot en majuscule
    return label;
  });
  
  // Créer la ligne d'en-tête
  let csv = headerLabels.join(';') + '\n';
  
  // Ajouter les lignes de données
  data.forEach((item) => {
    const row = headers.map(header => {
      // Gérer les valeurs spéciales, les virgules et les points-virgules
      const value = item[header] === null || item[header] === undefined ? '' : item[header];
      
      // Si la valeur contient un point-virgule, on l'entoure de guillemets
      if (typeof value === 'string' && (value.includes(';') || value.includes('"'))) {
        // Si la valeur contient déjà des guillemets, on les double
        const escapedValue = value.replace(/"/g, '""');
        return `"${escapedValue}"`;
      }
      
      return value;
    }).join(';');
    
    csv += row + '\n';
  });
  
  // Ajouter BOM pour assurer une bonne détection UTF-8 dans Excel
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  
  // Télécharger le fichier
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Formate une valeur booléenne en texte
export const formatBoolean = (value: boolean, trueText = 'Oui', falseText = 'Non'): string => {
  return value ? trueText : falseText;
};
